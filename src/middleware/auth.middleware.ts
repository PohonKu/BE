// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { sendError } from '../utils/response.util';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: any, user: any, info: any) => {
      // Log untuk debug
      console.log('🔐 Auth middleware:');
      console.log('  - err:', err);
      console.log('  - user:', user ? user.email : 'null');
      console.log('  - info:', info);

      if (err) {
        console.error('❌ Auth error:', err);
        return sendError(res, 'Authentication error', 500);
      }

      if (!user) {
        // info.message berisi alasan gagal
        const message = info?.message || 'Unauthorized';
        console.log('❌ No user:', message);
        return sendError(res, message, 401);
      }

      req.user = user;
      next();
    }
  )(req, res, next);
};