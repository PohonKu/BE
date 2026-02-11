import { Request, Response } from 'express';
import express from 'express';
import prisma from '../prisma/prisma';

const app = express();

app.get('/', async (req: Request, res: Response) => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    // Test query
    const userCount = await prisma.user.count();
    res.json({
      status: 'connected',
      message: 'Database connection successful',
      userCount
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    await prisma.$disconnect();
  }
});


app.get('/hello', (req: Request, res: Response) => {
  res.send('Pohonku API is running');
});

export default app;