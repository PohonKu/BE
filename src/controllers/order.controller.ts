import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { paymentService } from '../services/payment.service';
import { sendSuccess, sendError } from '../utils/response.util';
import { orderRepository } from '../repository/order.repository';

class OrderController {
    // POST /api/v1/orders
    async createOrder(req: Request, res: Response) {
        try {
            const userId = (req.user as any).id;
            const { speciesId, nameOnTag, durationYears } = req.body;

            if (!speciesId) return sendError(res, 'speciesId wajib diisi', 400);
            if (!nameOnTag) return sendError(res, 'nameOnTag wajib diisi', 400);

            const order = await orderService.createOrder(userId, {
                speciesId,
                nameOnTag,
                durationYears,

            });

            sendSuccess(res, 'Order berhasil dibuat', order, 201);
        } catch (error: any) {
            sendError(res, error.message, 400);
        }
    }

    // GET /api/v1/orders
    async getUserOrders(req: Request, res: Response) {
        try {
            const userId = (req.user as any).id;
            const orders = await orderService.getUserOrders(userId);
            sendSuccess(res, 'Orders berhasil diambil', orders);
        } catch (error: any) {
            sendError(res, error.message);
        }
    }

    // GET /api/v1/orders/:id
    async getOrderById(req: Request, res: Response) {
        try {
            const userId = (req.user as any).id;
            const { id } = req.params;
            const order = await orderService.getOrderById(id, userId);
            sendSuccess(res, 'Order berhasil diambil', order);
        } catch (error: any) {
            sendError(res, error.message, 404);
        }
    }

    // POST /api/v1/orders/:id/payment
    async createPayment(req: Request, res: Response) {
        try {
            const userId = (req.user as any).id;
            const { id } = req.params;
            const result = await paymentService.createPayment(id, userId);
            sendSuccess(res, 'Payment berhasil dibuat', result);
        } catch (error: any) {
            sendError(res, error.message, 400);
        }
    }

    // POST /api/v1/orders/webhook
    // Dipanggil Midtrans, tidak butuh auth
    async handleWebhook(req: Request, res: Response) {
        try {
            const result = await paymentService.handleWebhook(req.body);
            sendSuccess(res, 'Webhook processed', result);
        } catch (error: any) {
            sendError(res, error.message, 400);
        }
    }

    // PATCH /api/v1/orders/:id/cancel
    async cancelOrder(req: Request, res: Response) {
        try {
            const userId = (req.user as any).id;
            const { id } = req.params;
            await orderService.cancelOrder(id, userId);
            sendSuccess(res, 'Order berhasil dibatalkan');
        } catch (error: any) {
            sendError(res, error.message, 400);
        }
    }

    async getAllOrdersAdmin(req: Request, res: Response) {
        try {
            const requestingUser = req.user as any;
            if (requestingUser.role !== 'ADMIN') {
                return sendError(res, 'Forbidden: Admin access only', 403);
            }

            const orders = await orderRepository.getAllOrdersAdmin();
            sendSuccess(res, 'Semua riwayat order berhasil diambil', orders);
        } catch (error: any) {
            sendError(res, error.message);
        }
    }

}

export const orderController = new OrderController();