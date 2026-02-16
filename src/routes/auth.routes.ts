// src/routes/auth.routes.ts
import { Router } from 'express';
import passport from 'passport';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

//import { authenticate } from '../middlewares/auth.middleware';
import {
  registerSchema,
  loginSchema,
} from '../middleware/validation.middleware';
import { authService } from '../services/auth.service';

const router = Router();

// ==================== LOCAL AUTH ====================
router.post('/register',  authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshToken);
router.get('/me',authenticate, authController.getMe);
router.get('', authController.cekKoneksi);
router.get('profile', authService.findProfile)

// ==================== GOOGLE OAUTH ====================

// Step 1: User klik "Login dengan Google"
// Redirect ke halaman login Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'], // Data yang diminta dari Google
    session: false,
  })
);

// Step 2: Google redirect balik ke sini setelah user login
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed`,
  }),
  authController.googleCallback
);

export default router;