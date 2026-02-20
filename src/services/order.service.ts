// src/services/order.service.ts
import prisma from '../config/database';
import { orderRepository } from '../repository/order.repository';
import { generateOrderNumber } from '../utils/order.util';

class OrderService{
  // ========================
  // CREATE ORDER
  // User klik adopsi → kirim speciesId & nameOnTag
  // ========================
   async createOrder(
    userId: string,
    data: { speciesId: string; nameOnTag: string }
  ) {
    return await prisma.$transaction(async (tx) => {

      // 1. Cek species ada
      const species = await tx.treeSpecies.findUnique({
        where: { id: data.speciesId }
      });
      if (!species) throw new Error('Species tidak ditemukan');

      // 2. Cek stok
      if (species.availabelStok < 1) {
        throw new Error(`Stok pohon ${species.name} habis`);
      }

      // 3. Kurangi availableStock, tambah reservedStock
      await tx.treeSpecies.update({
        where: { id: data.speciesId },
        data: {
          availabelStok: { decrement: 1 },
          reservedStok:  { increment: 1 },
        }
      });

      // 4. Set expired 24 jam dari sekarang
      const expiredAt = new Date();
      expiredAt.setHours(expiredAt.getHours() + 24);

      // 5. Buat order + orderItem sekaligus
      const order = await tx.order.create({
        data: {
          userId,
          orderNumber: generateOrderNumber(),
          totalAmount: species.basePrice,
          expiredAt,
          paymentStatus: 'PENDING',
          orderItems: {
            create: {
              speciesId: data.speciesId,
              nameOnTag: data.nameOnTag,
              priceAtPurchase: species.basePrice,
            }
          }
        },
        include: {
          orderItems: {
            include: { species: true }
          }
        }
      });

      return order;
    });
  }


  async getOrderById(orderId: string, userId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new Error('Order tidak ditemukan');
    if (order.userId !== userId) throw new Error('Akses ditolak');
    return order;
  }

  async getUserOrders(userId: string) {
    return orderRepository.findByUserId(userId);
  }

  // Cancel manual oleh user
  async cancelOrder(orderId: string, userId: string) {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { orderItems: true }
      });

      if (!order) throw new Error('Order tidak ditemukan');
      if (order.userId !== userId) throw new Error('Akses ditolak');
      if (order.paymentStatus !== 'PENDING') {
        throw new Error('Hanya order PENDING yang bisa dibatalkan');
      }

      // Kembalikan stok
      if (order.orderItems) {
        await tx.treeSpecies.update({
          where: { id: order.orderItems.speciesId },
          data: {
            availabelStok: { increment: 1 },
            reservedStok:  { decrement: 1 },
          }
        });
      }

      return tx.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'FAILED' }
      });
    });
  }
}

export const orderService = new OrderService();




{/** 
import { orderRepository } from '../repository/order.repository';
import { treeRepository } from '../repository/tree.repository';

class OrderService {
  async createOrder(
    userId: string,
    items: { treeId: string; nameOnTag: string }[]
  ) {
    // Validate trees availability
    for (const item of items) {
      const tree = await treeRepository.getTreeById(item.treeId);
      if (!tree || tree.status !== 'AVAILABLE') {
        throw new Error(`Tree ${item.treeId} is not available`);
      }
    }

    // Calculate total amount
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const tree = await treeRepository.getTreeById(item.treeId);
        return {
          treeId: item.treeId,
          priceAtPurchase: tree!.species.basePrice,
        };
      })
    );

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + Number(item.priceAtPurchase),
      0
    );

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

    // Create order
    const order = await orderRepository.create({
      userId,
      orderNumber,
      totalAmount,
      items : orderItems
    });

    // Update tree status to BOOKED
    await Promise.all(
      items.map((item) =>
        treeRepository.updateTreeStatus(item.treeId, 'BOOKED')
      )
    );

    return order;
  }

  async getOrderById(orderId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new Error('Order not found');
    return order;
  }

  async getUserOrders(userId: string) {
    return orderRepository.getUserOrders(userId);
  }
}

export const orderService = new OrderService();

*/}