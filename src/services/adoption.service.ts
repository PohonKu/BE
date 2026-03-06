// src/services/adoption.service.ts



import { adoptionRepository } from '../repository/adoption.repository';
import { orderRepository } from '../repository/order.repository';
import {
  getGrowthPhase,
  getHealthStatus,
  calculateExpectedHeight,
  getMonthsSinceAdoption,
  getDaysSinceAdoption,
  predictNextUpdate,
} from '../utils/tree.util';


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

  async getDashboardBaru(userId: string){
    const adoptions = await adoptionRepository.findByUserId(userId);

    if (adoptions.length === 0) {
      return {
        totalCO2Absorbed: 0,
        totalTrees: 0,
        growthPhaseDistribution: {
          seedling: 0,
          sapling: 0,
          pole: 0,
          tree: 0,
        },
        healthStatusDistribution: {
          healthy: 0,
          adapting: 0,
          critical: 0,
        },
        averageHeight: 0,
        nextUpdateEstimate: null,
        averageRemainingDays: 0,
      };
    }

    let totalCO2 = 0;
    const phaseCount = { seedling: 0, sapling: 0, pole: 0, tree: 0 };
    const healthCount = { healthy: 0, adapting: 0, critical: 0 };
    let totalHeight = 0;
    const allUpdateDates: Date[] = [];
    let totalRemainingDays = 0;


    adoptions.forEach((adoption) => {
      const tree = adoption.tree;
      if (!tree) return;

      const latestUpdate = tree.treeUpdates[0]; 

      if (latestUpdate){
        //total co2
        totalCO2 += latestUpdate.co2AbsorbedTotal;
        const phase = getGrowthPhase(latestUpdate.heightCm);

        // 2. Growth Phase
        if (phase === 'SEEDLING') phaseCount.seedling++;
        else if (phase === 'SAPLING') phaseCount.sapling++;
        else if (phase === 'POLE') phaseCount.pole++;
        else phaseCount.tree++;

        // 3. Health Status
        const monthsOld = getMonthsSinceAdoption(adoption.adoptedAt);
        const expectedHeight = calculateExpectedHeight(
          adoption.species.carbonAbsorptionRate,
          monthsOld
        );
        const healthStatus = getHealthStatus(
          latestUpdate.heightCm,
          expectedHeight
        );

        if (healthStatus === 'HEALTHY') healthCount.healthy++;
        else if (healthStatus === 'ADAPTING') healthCount.adapting++;
        else healthCount.critical++;

        // 4. Average Height
        totalHeight += latestUpdate.heightCm;

        // 5. Collect update dates for prediction
        allUpdateDates.push(new Date(latestUpdate.createdAt));

        // 6. Remaining adoption days (assuming 5 years adoption period)
        const adoptionEndDate = new Date(adoption.adoptedAt);
        adoptionEndDate.setFullYear(adoptionEndDate.getFullYear() + 5);
        const remainingDays = Math.max(
          0,
          Math.floor(
            (adoptionEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          )
        );
        totalRemainingDays += remainingDays;
      }
    })

    const totalTrees = adoptions.length;

    // Sort update dates untuk prediksi
    allUpdateDates.sort((a, b) => a.getTime() - b.getTime());
    const nextUpdate = predictNextUpdate(allUpdateDates);

    return {
      totalCO2Absorbed: Math.round(totalCO2 * 100) / 100,
      totalTrees,
      
      // Pie Chart Data - Growth Phase
      growthPhaseDistribution: {
        seedling: phaseCount.seedling,
        sapling: phaseCount.sapling,
        pole: phaseCount.pole,
        tree: phaseCount.tree,
      },

      // Pie Chart Data - Health Status
      healthStatusDistribution: {
        healthy: healthCount.healthy,
        adapting: healthCount.adapting,
        critical: healthCount.critical,
      },

      averageHeight: Math.round((totalHeight / totalTrees) * 100) / 100,
      
      nextUpdateEstimate: nextUpdate ? nextUpdate.toISOString() : null,
      
      averageRemainingDays: Math.floor(totalRemainingDays / totalTrees),
    };

    
  }

  // GET USER ADOPTIONS (dengan detail stats per pohon)
  async getUserAdoptionBaru(userId: string){

    const adoptions = await adoptionRepository.findByUserId(userId);
    return adoptions.map((adoption) => {
      const tree = adoption.tree;
      const latestUpdate = tree?.treeUpdates[0];

      let growthPhase = null;
      let healthStatus = null;
      let expectedHeight = 0;
      let growthPercentage = 0;

      if (latestUpdate) {
        growthPhase = getGrowthPhase(latestUpdate.heightCm);
        
        const monthsOld = getMonthsSinceAdoption(adoption.adoptedAt);
        expectedHeight = calculateExpectedHeight(
          adoption.species.carbonAbsorptionRate,
          monthsOld
        );
        growthPercentage = Math.round(
          (latestUpdate.heightCm / expectedHeight) * 100
        );
        healthStatus = getHealthStatus(latestUpdate.heightCm, expectedHeight);
      }

      // Calculate remaining days
      const adoptionEndDate = new Date(adoption.adoptedAt);
      adoptionEndDate.setFullYear(adoptionEndDate.getFullYear() + 5);
      const remainingDays = Math.max(
        0,
        Math.floor(
          (adoptionEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        )
      );

      return {
        adoptionId: adoption.id,
        adoptedAt: adoption.adoptedAt,
        nameOnTag: adoption.nameOnTag,
        
        species: {
          id: adoption.species.id,
          name: adoption.species.name,
          latinName: adoption.species.latinName,
          imageUrl: adoption.species.mainImageUrl,
          carbonRate: adoption.species.carbonAbsorptionRate,
          category: adoption.species.category,
        },

        tree: tree ? {
          id: tree.id,
          serialNumber: tree.serialNumber,
          latitude: tree.latitude,
          longitude: tree.longitude,
          plantedAt: tree.plantedAt,
          status: tree.status,
          
          latestUpdate: latestUpdate ? {
            ...latestUpdate,
            growthPhase,
            healthStatus,
            expectedHeight: Math.round(expectedHeight * 100) / 100,
            growthPercentage,
          } : null,
        } : null,

        statistics: {
          daysAdopted: getDaysSinceAdoption(adoption.adoptedAt),
          remainingDays,
          co2Absorbed: latestUpdate?.co2AbsorbedTotal || 0,
        },

        order: {
          orderNumber: adoption.order.orderNumber,
          totalAmount: Number(adoption.order.totalAmount),
          paymentStatus: adoption.order.paymentStatus,
          purchasedAt: adoption.order.createdAt,
        },
      };
    });
  }
}

export const adoptionService = new AdoptionService();