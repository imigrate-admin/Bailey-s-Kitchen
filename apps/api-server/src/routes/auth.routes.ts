import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

// Authentication routes
router.post('/register', (req, res, next) => authController.register(req, res).catch(next));
router.post('/login', (req, res, next) => authController.login(req, res).catch(next));
router.get('/me', (req, res, next) => authController.getProfile(req, res).catch(next));

export default router;

