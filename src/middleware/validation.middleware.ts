// src/middlewares/validation.middleware.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  fullName: z.string().min(3, 'Nama minimal 3 karakter'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password diperlukan'),
});