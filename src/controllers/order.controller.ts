import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { paymentService } from '../services/payment.service';
import { sendSuccess, sendError } from '../utils/response.util';

class OrderController {
    // POST /api/v1/orders
    async createOrder(req: Request, res: Response) {
        try {
        const userId = (req.user as any).id;
        const { speciesId, nameOnTag } = req.body;

        if (!speciesId) return sendError(res, 'speciesId wajib diisi', 400);
        if (!nameOnTag) return sendError(res, 'nameOnTag wajib diisi', 400);

        const order = await orderService.createOrder(userId, {
            speciesId,
            nameOnTag,
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

}

export const orderController = new OrderController();


{/**
import { Request, Response } from 'express';
import express from 'express';
import prisma from '../prisma/prisma';

const router = express.Router();

// GET all order items
router.get('/order', async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                orderItems: true,
                adoptions: true
            }
        });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST create new order
router.post('/order', async (req: Request, res: Response) => {
    try {
        const {
            userId,
            orderNumber,
            totalAmount,
            paymentStatus,
            paymentMethod,
            snapToken,
            createdAt,
            updatedAt
        } = req.body;

        if (!userId || !orderNumber || !totalAmount || !paymentStatus || !paymentMethod || !snapToken) {
            return res.status(400).json({
                success: false,
                message: 'userId, orderNumber, totalAmount, paymentStatus, paymentMethod, and snapToken are required'
            });
        }

        const newOrderItem = await prisma.order.create({
            data: {
                userId,
                orderNumber,
                totalAmount,
                paymentStatus,
                paymentMethod,
                snapToken,
                createdAt,
                updatedAt
            }
        });

        res.status(201).json({
            success: true,
            message: 'Order item created successfully',
            data: newOrderItem
        });
    } catch (error) {
        console.error('Error creating order item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order item',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;

 */}