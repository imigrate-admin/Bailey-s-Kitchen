import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { AppError } from '../middleware/error-handler';

// JWT secret from environment variables
const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generate a JWT token for a user
 */
export const generateToken = (payload: object): string => {
  try {
    // Using type assertion to handle the expiresIn property
    const options = {
      expiresIn: JWT_EXPIRES_IN
    } as SignOptions;
    
    return jwt.sign(payload, JWT_SECRET, options);
  } catch (error) {
    throw new AppError(
      'Error generating token',
      500,
      error instanceof Error ? error.message : undefined
    );
  }
};

/**
 * Verify a JWT token
 */
export const verifyToken = (token: string): JwtPayload | string => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Token expired', 401);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid token', 401);
    }
    throw new AppError(
      'Error verifying token',
      500,
      error instanceof Error ? error.message : undefined
    );
  }
};

