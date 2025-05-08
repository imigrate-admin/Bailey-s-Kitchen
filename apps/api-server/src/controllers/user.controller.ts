import { Request, Response } from 'express';
import { User } from '../entities/User';
import { AppError } from '../middleware/error-handler';
import { ParsedQs } from 'qs';
// Removed redundant import of 'Request' and 'Response' as they are already imported above
/**
 * Controller for user-related operations
 */
export class UserController {
  /**
   * Get all users
   */
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find({
        select: ['id', 'firstName', 'lastName', 'email', 'isActive', 'createdAt', 'updatedAt']
      });
      
      res.status(200).json({
        status: 'success',
        data: users
      });
    } catch (error) {
      throw new AppError(
        'Failed to retrieve users',
        500,
        error instanceof Error ? error.message : undefined
      );
    }
  }

  /**
   * Get user by ID
   */
  async findOne(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findOne({ 
        where: { id },
        select: ['id', 'firstName', 'lastName', 'email', 'isActive', 'createdAt', 'updatedAt']
      });

      if (!user) {
        throw new AppError(`User with ID ${id} not found`, 404);
      }

      res.status(200).json({
        status: 'success',
        data: user
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Failed to retrieve user',
        500,
        error instanceof Error ? error.message : undefined
      );
    }
  }

  /**
   * Create a new user
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { firstName, lastName, email, password } = req.body;
      
      // Check if user with email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new AppError('User with this email already exists', 409);
      }

      // Create new user
      const user = new User();
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.password = password; // In a real app, hash the password before saving
      user.isActive = true;

      await user.save();

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json({
        status: 'success',
        data: userWithoutPassword
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Failed to create user',
        500,
        error instanceof Error ? error.message : undefined
      );
    }
  }

  /**
   * Update an existing user
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { firstName, lastName, email, isActive } = req.body;

      // Find user
      const user = await User.findOne({ where: { id } });
      if (!user) {
        throw new AppError(`User with ID ${id} not found`, 404);
      }

      // Update user fields
      if (firstName !== undefined) {
        user.firstName = firstName;
      }
      if (lastName !== undefined) {
        user.lastName = lastName;
      }
      if (email !== undefined) {
        user.email = email;
      }
      if (isActive !== undefined) {
        user.isActive = isActive;
      }

      await user.save();

      // Return updated user without password
      const { password: _, ...updatedUser } = user;

      res.status(200).json({
        status: 'success',
        data: updatedUser
      });
    }
    catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Failed to update user',
        500,
        error instanceof Error ? error.message : undefined
      );
    }
  }
  /**
   * Delete a user
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findOne({ where: { id } });

      if (!user) {
        throw new AppError(`User with ID ${id} not found`, 404);
      }

      await user.remove();

      res.status(204).json({
        status: 'success',
        message: 'User deleted successfully'
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Failed to delete user',
        500,
        error instanceof Error ? error.message : undefined
      );
    }
  }
}