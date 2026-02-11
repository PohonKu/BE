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
