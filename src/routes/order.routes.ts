// src/routes/order.routes.ts
import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// ✅ Webhook PALING ATAS - tidak butuh auth
// Harus sebelum /:id agar tidak konflik routing
router.post('/webhook', orderController.handleWebhook);

// Protected routes - butuh login
router.use(authenticate);
router.post('/', orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);
router.post('/:id/payment', orderController.createPayment);
router.patch('/:id/cancel', orderController.cancelOrder);

export default router;