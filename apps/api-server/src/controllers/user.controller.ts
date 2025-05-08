import { Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository';

export class UserController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userRepository.findAll();
      res.json({ data: users, statusCode: 200 });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch users',
        statusCode: 500,
        details: error instanceof Error ? error.message : undefined
      });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await this.userRepository.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          statusCode: 404
        });
      }
      res.json({ data: user, statusCode: 200 });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch user',
        statusCode: 500,
        details: error instanceof Error ? error.message : undefined
      });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const user = await this.userRepository.create(req.body);
      res.status(201).json({ data: user, statusCode: 201 });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to create user',
        statusCode: 500,
        details: error instanceof Error ? error.message : undefined
      });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const user = await this.userRepository.update(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          statusCode: 404
        });
      }
      res.json({ data: user, statusCode: 200 });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update user',
        statusCode: 500,
        details: error instanceof Error ? error.message : undefined
      });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const deleted = await this.userRepository.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          error: 'User not found',
          statusCode: 404
        });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        error: 'Failed to delete user',
        statusCode: 500,
        details: error instanceof Error ? error.message : undefined
      });
    }
  }
}

