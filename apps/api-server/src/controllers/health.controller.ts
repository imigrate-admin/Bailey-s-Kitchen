import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';

class HealthController {
  async check(req: Request, res: Response): Promise<void> {
    try {
      const isConnected = AppDataSource.isInitialized;

      res.status(200).json({
        status: 'success',
        message: 'API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: {
          connected: isConnected,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export default new HealthController();