# Mamba Culture Campaign Management System Documentation

## Overview

Mamba Culture Campaign Management System is a full-stack web application for creating and managing marketing campaigns. The system allows users to create, read, update, and delete campaigns, with each campaign having a name, start and end dates, status, and category.

## System Architecture

The application follows a modern microservices architecture with three main components:

1. **PostgreSQL Database**: Stores all campaign and category data
2. **NestJS Backend API**: Provides RESTful endpoints for campaign management
3. **React Frontend**: User interface for interacting with the system

## Technology Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API Documentation**: Swagger
- **Container**: Docker

### Frontend
- **Framework**: React with Vite
- **UI Library**: Chakra UI
- **State Management**: React Hooks
- **Routing**: React Router
- **HTTP Client**: Axios
- **Container**: Docker

## Project Structure

```
mamba-culture/
├── api/                  # NestJS backend
│   ├── prisma/           # Prisma schema and migrations
│   ├── src/              # API source code
│   │   ├── prisma/       # Prisma service
│   │   └── v1/           # API v1 endpoints
│   │       ├── campaigns/# Campaign module
│   │       └── categories/# Category module
│   └── Dockerfile        # Backend Docker configuration
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   │   ├── campaigns/# Campaign-related pages
│   │   │   └── categories/# Category-related pages
│   │   └── services/     # API service layer
│   └── Dockerfile        # Frontend Docker configuration
└── docker-compose.yml    # Docker Compose configuration
```

## Setup and Installation

### Prerequisites

- Docker and Docker Compose
- Node.js (v18+) and npm/yarn (for local development)

### Running with Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mamba-culture
   ```

2. Start the application:
   ```bash
   docker-compose up
   ```

3. Access the application:
   - Frontend: http://localhost:5174
   - API: http://localhost:3001/api/v1
   - API Documentation: http://localhost:3001/api/docs

### Running for Development

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Start the PostgreSQL database:
   ```bash
   docker-compose up postgres
   ```

3. In a separate terminal, start the development servers:
   ```bash
   npm run start:dev
   ```

## API Documentation

The API documentation is available at http://localhost:3001/api/docs when the API is running. It provides detailed information about all available endpoints, request/response formats, and examples.

### Main Endpoints

#### Campaigns

- `GET /api/v1/campaigns` - List all campaigns
- `GET /api/v1/campaigns/:id` - Get a specific campaign
- `POST /api/v1/campaigns` - Create a new campaign
- `PATCH /api/v1/campaigns/:id` - Update a campaign
- `DELETE /api/v1/campaigns/:id` - Delete a campaign (soft delete)

#### Categories

- `GET /api/v1/categories` - List all categories
- `GET /api/v1/categories/:id` - Get a specific category
- `POST /api/v1/categories` - Create a new category
- `PATCH /api/v1/categories/:id` - Update a category
- `DELETE /api/v1/categories/:id` - Delete a category

## Data Models

### Campaign

```typescript
{
  id: number;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED';
  startDate: Date;
  endDate: Date;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
```

### Category

```typescript
{
  id: number;
  name: string;
}
```

## Business Rules

1. The end date must be after the start date
2. If the end date is in the past, the campaign is automatically marked as "EXPIRED"
3. Campaigns are soft deleted (marked with a deletedAt timestamp rather than removed from the database)

## Frontend Pages

1. **Dashboard**: Overview of campaigns and categories
2. **Campaigns List**: View all campaigns with filtering options
3. **Campaign Details**: View details of a specific campaign
4. **Campaign Form**: Create or edit a campaign
5. **Categories List**: View all categories
6. **Category Form**: Create or edit a category

## Troubleshooting

### Common Issues

1. **API Connection Issues**: 
   - Ensure the API is running on port 3001
   - Check that the client's environment variable `VITE_API_URL` is set correctly in docker-compose.yml

2. **Database Connection Issues**:
   - Verify that PostgreSQL is running
   - Check the DATABASE_URL environment variable in docker-compose.yml

3. **Permission Issues**:
   - If you encounter permission issues with files created by Docker, you may need to run:
     ```bash
     sudo chown -R $USER:$USER .
     ```

### Logs

- To view logs for a specific service:
  ```bash
  docker-compose logs -f [service_name]
  ```
  Where [service_name] can be postgres, api, or client.

## Development Guidelines

### Adding New Features

1. **Backend**:
   - Create appropriate entity, repository, use case, and controller
   - Update Swagger documentation
   - Add validation rules

2. **Frontend**:
   - Add API service methods in `client/src/services/api.ts`
   - Create/update React components
   - Add routing in App.tsx if needed

### Code Style

- Backend follows NestJS best practices with a clean architecture approach
- Frontend uses functional components with React hooks
- Both use TypeScript for type safety

## Deployment

The application is containerized and can be deployed to any environment that supports Docker:

1. Build the images:
   ```bash
   docker-compose build
   ```

2. For production deployment, consider using environment variables for sensitive information:
   ```bash
   DATABASE_URL=your_production_db_url docker-compose up -d
   ```

## License

This project is licensed under the MIT License. 