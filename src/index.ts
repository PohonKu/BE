import express from 'express';
import dotenv from 'dotenv';
import middlewareApp from './middleware/middleware';
import treeRoutes from './routes/tree.routes';
import authRoutes from "./routes/auth.routes";
import adoptionRoutes from "./routes/adoption.routes";
import treeUpdateAdminRoutes from './routes/treeUpdate.routes';
import './config/oauth';
import orderRoutes from "./routes/order.routes";
import userRoutes from './routes/user.routes';

dotenv.config();

const PORT = process.env.PORT || 2000;
const app = express();

// ============ MIDDLEWARE ============
app.use(middlewareApp);

// ============ ROUTE ============
app.use("/api/v1/trees", treeRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/', authRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/adoptions', adoptionRoutes);
app.use('/api/v1/admin/trees/:treeId/updates', treeUpdateAdminRoutes);
app.use('/api/v1/users', userRoutes);


// ============ START SERVER ============
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`🔗 Google OAuth: http://localhost:${PORT}/api/v1/auth/google`);
});

export default app;
