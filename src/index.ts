import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './prisma/prisma';
import middlewareApp from './middleware/middleware';
import treeRoutes from './routes/tree.routes';
import authRoutes from "./routes/auth.routes";
import adoptionRoutes from "./routes/adoption.routes";
import './config/oauth';        // ← INI YANG SERING LUPA!
import passport from 'passport';
import orderRoutes from "./routes/order.routes";

dotenv.config();

const PORT = process.env.PORT;
const app = express();

// ============ MIDDLEWARE ============
app.use(middlewareApp);

app.use("/api/v1/trees", treeRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/', authRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/adoptions', adoptionRoutes);


// ============ START SERVER ============

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`🔗 Google OAuth: http://localhost:${PORT}/api/v1/auth/google`);
});

export default app;
