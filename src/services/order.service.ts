// src/services/order.service.ts
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