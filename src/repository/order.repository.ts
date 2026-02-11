import { snapshot } from 'node:test';
import prisma from '../prisma/prisma';
import { Order } from '@prisma/client';

class OrderRepository {
    async create(data:{
        userId: string;
        orderNumber: string;
        totalAmount: number;
        paymentStatus: string;
        paymentMethod: string;
        snapToken: string;
        createdAt?: Date;
        updatedAt?: Date;
        items: { treeId: string; priceAtPurchase: number }[];
    }) : Promise <Order> {
        return prisma.order.create({ 
            data :{
                userId: data.userId,
                orderNumber: data.orderNumber,
                totalAmount: data.totalAmount,
                paymentStatus: data.paymentStatus,
                paymentMethod: data.paymentMethod,
                snapToken: data.snapToken,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                orderItems: {
                    create: data.items.map(item => ({
                        treeId: item.treeId,
                        priceAtPurchase: item.priceAtPurchase
                    }))
                }
            },
            include: {
                orderItems: {
                    include: {
                        tree: {include: {
                            species : true
                        }}
                    }
                }
            }
        });   
    }

    async findById(id: string) {
        return prisma.order.findUnique({
            where: { id },
            include: {
                orderItems: {
                    include: {
                        tree: {include: {
                            species : true
                        }}
                    }
                }
            }
        });
    }

    async findByOrderNumber(orderNumber: string) {
        return prisma.order.findUnique({
            where: { orderNumber },
            include: {
                orderItems: {
                    include: {
                        tree: {include: {
                            species : true
                        }}
                    }
                }
            }
        });
    }

    async updatePaymentStatus(id: string, status: string, snapToken?: string): Promise<Order> {
        return prisma.order.update({
            where: { id },
            data: { 
                paymentStatus: status,
                ...(snapToken && {snapshot})
            }

        })
    }

    async getUserOrders(userId: string) {
        return prisma.order.findMany({
            where: {userId},
            include : {
                orderItems : {
                    include: {
                        tree: {include: {
                            species : true
                        }}
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }
    


}

export const orderRepository = new OrderRepository();

