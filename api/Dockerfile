# Development stage
FROM node:22-alpine AS development
WORKDIR /usr/src/app

# Install wget for healthcheck
RUN apk add --no-cache wget

COPY package.json yarn.lock* package-lock.json* ./
RUN if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm i; \
    fi
COPY . .
RUN npm run start:prod

# Production stage
FROM node:22-alpine AS production
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --prod --frozen-lockfile
COPY --from=development /usr/src/app/dist ./dist
COPY prisma ./prisma
RUN yarn prisma generate
EXPOSE 3001
CMD ["yarn", "start:prod"]