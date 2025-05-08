import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import routes from './routes';
import { ErrorResponse } from './types';

// Load environment variables
dotenv.config();

const app = express();

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection initialized');
  })
  .catch((error) => {
    console.error('Error initializing database connection:', error);
    process.exit(1);
  });

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());

// API Routes
const apiPrefix = process.env.API_PREFIX || '/api/v1';
app.use(apiPrefix, routes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    statusCode: 404
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const errorResponse: ErrorResponse = {
    error: 'Internal Server Error',
    statusCode: 500,
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  };
  res.status(500).json(errorResponse);
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API is available at ${apiPrefix}`);
});

