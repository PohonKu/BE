// src/utils/response.util.ts
import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  message: string,
  data?: any,
  statusCode: number = 200
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: any
) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};
