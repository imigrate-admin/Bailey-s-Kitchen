import { Request, Response } from 'express';
import { User } from '../entities/User';
import { AppError } from '../middleware/error-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateToken, verifyToken } from '../utils/jwt';

export class AuthController {
  /**
   * Register a new user
   */
  async register(req: Request, res: Response): Promise<void> {
    const { firstName, lastName, email, password } = req.body;

    // Validate request body
    if (!firstName || !lastName || !email || !password) {
      throw new AppError('Please provide firstName, lastName, email and password', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    try {
      // Create new user
      const user = new User();
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      
      // Save user
      await user.save();

      // Generate JWT token
      const token = generateToken({ id: user.id });

      // Return user without password
      res.status(201).json({
        status: 'success',
        accessToken: token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      throw new AppError(
        'Error registering user',
        500,
        error instanceof Error ? error.message : undefined
      );
    }
  }

  /**
   * Login a user
   */
  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    try {
      // Find user by email with password
      const user = await User.findOne({ 
        where: { email },
        select: ['id', 'firstName', 'lastName', 'email', 'password', 'isActive'] 
      });

      // Check if user exists
      if (!user) {
        throw new AppError('Invalid email or password', 401);
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AppError('Your account has been deactivated', 403);
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
      }

      // Generate JWT token
      const token = generateToken({ id: user.id });

      // Return token and user data
      res.status(200).json({
        status: 'success',
        accessToken: token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Error logging in',
        500,
        error instanceof Error ? error.message : undefined
      );
    }
  }

  /**
   * Get user profile
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      // Extract token from header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('Authentication required', 401);
      }

      const token = authHeader.split(' ')[1];
      
      // Verify token
      const decoded = verifyToken(token);
      if (!decoded || typeof decoded !== 'object' || !decoded.id) {
        throw new AppError('Invalid token', 401);
      }

      // Find user
      const user = await User.findOne({ where: { id: decoded.id } });
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Return user data
      res.status(200).json({
        status: 'success',
        data: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Error fetching profile',
        500,
        error instanceof Error ? error.message : undefined
      );
    }
  }
}

