import { Request, Response, NextFunction } from 'express';
import { QueryFailedError } from 'typeorm';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error for server-side debugging
  console.error(`[ERROR] ${error.name}: ${error.message}`);
  if (error.stack) {
    console.error(error.stack);
  }

  // Handle AppError
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      error: error.message,
      statusCode: error.statusCode,
      details: error.details,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }

  // Handle database errors
  if (error instanceof QueryFailedError) {
    return res.status(400).json({
      status: 'error',
      error: 'Database operation failed',
      statusCode: 400,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }

  // Handle all other errors
  res.status(500).json({
    status: 'error',
    error: 'Internal Server Error',
    statusCode: 500,
    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};
