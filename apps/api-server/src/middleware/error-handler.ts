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
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      statusCode: error.statusCode,
      details: error.details
    });
  }

  if (error instanceof QueryFailedError) {
    return res.status(400).json({
      error: 'Database operation failed',
      statusCode: 400,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    statusCode: 500,
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

