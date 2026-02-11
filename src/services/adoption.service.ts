// src/services/adoption.service.ts
import { adoptionRepository } from '../repository/adoption.repository';
import { orderRepository } from '../repository/order.repository';

class AdoptionService {
  async createAdoptions(
    orderId: string,
    adoptionData: { treeId: string; nameOnTag: string }[]
  ) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new Error('Order not found');

    if (order.paymentStatus !== 'PAID') {
      throw new Error('Order must be paid first');
    }

    const adoptions = await Promise.all(
      adoptionData.map((data) =>
        adoptionRepository.create({
          userId: order.userId,
          treeId: data.treeId,
          orderId: order.id,
          nameOnTag: data.nameOnTag,
          adoptionDate: new Date()
        })
      )
    );

    return adoptions;
  }

  async getUserAdoptions(userId: string) {
    return adoptionRepository.getUserAdoptions(userId);
  }

  async getAdoptionById(id: string) {
    const adoption = await adoptionRepository.findById(id);
    if (!adoption) throw new Error('Adoption not found');
    return adoption;
  }
}

export const adoptionService = new AdoptionService();