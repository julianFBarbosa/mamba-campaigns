FROM node:22-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock* package-lock.json* ./

# Install dependencies based on the preferred package manager
RUN if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm i; \
    fi

COPY . .

EXPOSE 5174

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 