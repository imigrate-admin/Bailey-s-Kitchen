import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import routes from './routes';
import { errorHandler } from './middleware/error-handler';

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

// Parse CORS origins from environment variable
const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map(origin => origin.trim());

// Configure CORS with dynamic origin validation
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in our allowed list
    if (corsOrigins.indexOf(origin) !== -1) {
      // Return the specific matching origin
      return callback(null, origin);
    } else {
      // If not in allowed origins, reject
      return callback(new Error(`CORS policy: Origin ${origin} not allowed`), false);
    }
  },
  credentials: true
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

// Global error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API is available at ${apiPrefix}`);
});

