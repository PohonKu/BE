// src/services/adoption.service.ts



import { adoptionRepository } from '../repository/adoption.repository';
import { orderRepository } from '../repository/order.repository';

class AdoptionService {
  async createAdoptions(
    orderId: string,
    adoptionData: { treeId: string; nameOnTag: string; speciesId: string }[]
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
          speciesId: data.speciesId,
          nameOnTag: data.nameOnTag,
          adoptionDate: new Date()
        })
      )
    );

    return adoptions;
  }

  async getUserAdoptions(userId: string) {
    const adoptions = await adoptionRepository.findByUserId(userId);

    // Transform data untuk frontend
    return adoptions.map(adoption => ({
      // Info adopsi
      adoptionId: adoption.id,
      adoptedAt: adoption.adoptedAt,
      nameOnTag: adoption.nameOnTag,
      
      // Info species
      species: {
        id: adoption.species.id,
        name: adoption.species.name,
        latinName: adoption.species.latinName,
        imageUrl: adoption.species.mainImageUrl,
        carbonRate: adoption.species.carbonAbsorptionRate,
        category: adoption.species.category,
      },

      // Info pohon fisik
      tree: adoption.tree ? {
        id: adoption.tree.id,
        serialNumber: adoption.tree.serialNumber,
        latitude: adoption.tree.latitude,
        longitude: adoption.tree.longitude,
        plantedAt: adoption.tree.plantedAt,
        status: adoption.tree.status,
        createdAt: adoption.tree.createdAt,
        
        // Update terbaru
        latestUpdate: adoption.tree.treeUpdates[0] || null,
      } : null,

      // Info order
      order: {
        orderNumber: adoption.order.orderNumber,
        totalAmount: Number(adoption.order.totalAmount),
        paymentStatus: adoption.order.paymentStatus,
        purchasedAt: adoption.order.createdAt,
      },
    }));
  }

  async getAdoptionDetail(adoptionId: string, userId: string) {
    const adoption = await adoptionRepository.detailAdoption(adoptionId);

    if (!adoption) {
      throw new Error('Adoption tidak ditemukan');
    }

    // Pastikan adoption milik user ini
    if (adoption.userId !== userId) {
      throw new Error('Anda tidak memiliki akses ke adoption ini');
    }

    return {
      adoptionId: adoption.id,
      adoptedAt: adoption.adoptedAt,
      nameOnTag: adoption.nameOnTag,
      certificateUrl: adoption.certificateUrl,
      species: adoption.species,

      tree: adoption.tree ? {
        ...adoption.tree,
        // Semua update (untuk timeline)
        updates: adoption.tree.treeUpdates.map(update => ({
          id: update.id,
          photoUrl: update.photoUrl,
          heightCm: update.heightCm,
          diameterCm: update.diameterCm,
          co2AbsorbedTotal: update.co2AbsorbedTotal,
          adminNotes: update.adminNotes,
          date: update.createdAt,
        }))
      } : null,

      order: adoption.order,
      owner: adoption.user,
    };
  }

  async getAdoptionById(id: string) {
    const adoption = await adoptionRepository.findById(id);
    if (!adoption) throw new Error('Adoption not found');
    return adoption;
  }

  async getDashboardStats(userId: string) {
    const stats = await adoptionRepository.getStatistic(userId);
    return stats;
  }
}

export const adoptionService = new AdoptionService();