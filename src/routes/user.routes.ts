import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// User routes (butuh login)
router.get('/profile', authenticate, userController.getProfile);
router.patch('/profile', authenticate, userController.updateProfile);

// Admin routes
router.get('/admin/buyers', authenticate, userController.getAllBuyers);

export default router;