# Mamba Culture Client

This is the frontend application for the Mamba Culture project, which interfaces with the NestJS API.

## Features

- Dashboard with summary statistics
- CRUD operations for Campaigns
- CRUD operations for Categories
- Form validation
- Responsive UI with Chakra UI

## Tech Stack

- React
- TypeScript
- React Router v6
- Axios for API requests
- Chakra UI for styling

## Setup Instructions

1. Make sure you're in the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Application Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Page components for each route
- `/src/services` - API service layer
- `/src/pages/campaigns` - Campaign-related components
- `/src/pages/categories` - Category-related components

## API Integration

The application communicates with the NestJS backend API running at `http://localhost:3000/api/v1`. A proxy is configured in `vite.config.ts` to handle CORS.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build locally
