import { Request, Response } from 'express';
import express from 'express';
import prisma from '../prisma/prisma';

const router = express.Router();

// GET all order items
router.get('/order-items', async (req: Request, res: Response) => {
    try {
        console.log('Fetching order items...');
        const orderItems = await prisma.orderItem.findMany({
            include: {
                order: true,
                tree: true
            }
        });
        console.log('Order items fetched:', orderItems);
        res.json(orderItems);
    } catch (error) {
        console.error('Error fetching order items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST create new order item
router.post('/order-items', async (req: Request, res: Response) => {
    try {
        const { orderId, treeId, priceAtPurchase } = req.body;

        if (!orderId || !treeId || !priceAtPurchase) {
            return res.status(400).json({
                success: false,
                message: 'orderId, treeId, and priceAtPurchase are required'
            });
        }

        const newOrderItem = await prisma.orderItem.create({
            data: {
                orderId,
                treeId,
                priceAtPurchase
            },
            include: {
                order: true,
                tree: true
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
