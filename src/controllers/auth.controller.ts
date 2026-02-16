// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response.util';
import { User } from '@prisma/client';
import { userController } from './user.controller';

class AuthController {
  // ==================== REGISTER ====================
  
  async register(req: Request, res: Response) {
    try {
      const { email, fullName, password, phone } = req.body;
      const result = await authService.register({
        email,
        fullName,
        password,
        phone,
      });
      sendSuccess(res, 'Registrasi berhasil', result, 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  // ==================== LOGIN ====================
  
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      sendSuccess(res, 'Login berhasil', result);
    } catch (error: any) {
      sendError(res, error.message, 401);
    }
  }

  // ==================== GOOGLE OAUTH ====================
  
  // Step 1: Redirect ke Google
  // Ini handled langsung oleh Passport di routes
  // Tidak perlu method khusus

  // Step 2: Google Callback - setelah user login di Google
  async googleCallback(req: Request, res: Response) {
    try {
      const user = req.user as User;

      // Generate tokens
      const result = await authService.googleLogin(user);

      // Redirect ke frontend dengan token di URL
      // Frontend akan ambil token dari URL params
      const redirectUrl = new URL(`${process.env.FRONTEND_URL}/auth/google/callback`);
      redirectUrl.searchParams.set('accessToken', result.accessToken);
      redirectUrl.searchParams.set('refreshToken', result.refreshToken);
      redirectUrl.searchParams.set('success', 'true');

      res.redirect(redirectUrl.toString());
    } catch (error: any) {
      // Redirect ke frontend dengan error
      const redirectUrl = new URL(`${process.env.FRONTEND_URL}/auth/google/callback`);
      redirectUrl.searchParams.set('success', 'false');
      redirectUrl.searchParams.set('error', error.message);

      res.redirect(redirectUrl.toString());
    }
  }

  // ==================== REFRESH TOKEN ====================
  
  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return sendError(res, 'Refresh token diperlukan', 400);
      }

      const result = await authService.refreshAccesToken(refreshToken);
      sendSuccess(res, 'Token berhasil diperbarui', result);
    } catch (error: any) {
      sendError(res, error.message, 401);
    }
  }

  async findProfile(req: Request, res: Response){
    try{
      const googleID = req.body;

      if(!googleID) return sendError(res, 'belom login', 400)

      const data = await authService.findProfile(googleID);

      sendSuccess(res, 'profile ditemukan', data)

    } catch(error: any){
      sendError(res, error.message, 401)
    }
  }

  // ==================== LOGOUT ====================
  
  async logout(req: Request, res: Response) {
    // Karena JWT stateless, logout cukup hapus token di frontend
    // Optional: blacklist token di Redis
    sendSuccess(res, 'Logout berhasil');
  }

  // ==================== GET CURRENT USER ====================
  
  async getMe(req: Request, res: Response) {
  try {
    // ✅ Cek apakah req.user ada
    if (!req.user) {
      return sendError(res, 'User tidak ditemukan di request', 401);
    }

    const user = req.user as any;

    // ✅ Destructure dengan aman
    const { 
      passwordHash,  // dibuang
      googleId,      // dibuang
      ...safeUser    // yang dikirim ke frontend
    } = user;

    sendSuccess(res, 'Data user berhasil diambil', safeUser);
  } catch (error: any) {
    console.error('❌ getMe error:', error); // tambah log
    sendError(res, error.message, 500);
  }
}

  cekKoneksi(req: Request, res: Response){
    res.send('koneksi sukses, lanjut bisa pakai api')
  }


}

export const authController = new AuthController();