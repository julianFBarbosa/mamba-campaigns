# Mamba Culture Campaign Management

A full-stack application for managing marketing campaigns and categories.

## Project Structure

- `api/` - NestJS backend API with Prisma ORM
- `client/` - React frontend with Chakra UI

## Running the Application

### Using Docker (Recommended)

1. Make sure you have Docker and Docker Compose installed
2. Clone the repository
3. Run the application:

```bash
docker-compose up
```

This will start:
- PostgreSQL database on port 5432
- NestJS API on port 3001
- React client on port 5174

Access the application at http://localhost:5174

### Development Mode (Without Docker)

1. Install dependencies:

```bash
npm run install:all
```

2. Start the PostgreSQL database (you can use Docker for just the database):

```bash
docker-compose up postgres
```

3. Run the API and client in development mode:

```bash
npm run start:dev
```

## API Documentation

The API documentation is available at http://localhost:3001/api/docs when the API is running.

## Technologies Used

- **Backend**:
  - NestJS
  - Prisma ORM
  - PostgreSQL
  - TypeScript

- **Frontend**:
  - React
  - Chakra UI
  - TypeScript
  - Vite
  - React Router 