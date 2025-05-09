import { Router } from 'express';
import healthRoutes from './health.routes';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';

const router = Router();

// Register all routes
router.use('/health', healthRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

export default router;