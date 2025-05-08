import { Router } from 'express';
import HealthController from '../controllers/health.controller';

const router = Router();

// Register the health check route
router.get('/', HealthController.check);

export default router;