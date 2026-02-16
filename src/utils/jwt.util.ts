// src/utils/jwt.util.ts
import jwt, { SignOptions, Secret } from 'jsonwebtoken';

export const generateToken = (payload: any): string => {
  const secret: Secret = process.env.JWT_SECRET!;
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as SignOptions['expiresIn'],
  };
  
  return jwt.sign(payload, secret, options);
};

export const generateRefreshToken = (payload: any): string => {
  const secret: Secret = process.env.JWT_REFRESH_SECRET!;
  const options: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  };
  
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET as Secret);
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET as Secret);
};