import { tr } from 'zod/v4/locales';
import prisma from '../prisma/prisma';

class AdoptionRepository {
    // UNTUK MEMBUAT ADOPSI BARU
    async create(data:{
        userId: string;
        treeId: string;
        orderId: string;
        speciesId: string;
        nameOnTag: string;
        certificateUrl?: string | null;
        adoptionDate: Date;
    })  {
        return prisma.adoption.create({ 
            data,
            include: {
                user: true,
                tree: {include: {species: true }},
            }
        });        
    }

    // UNTUK MELIHAT DETAIL ADOPSI(POHON APA SAJA YANG UDAH DIADOPSI)
    async findById(id: string)  {
        return prisma.adoption.findUnique({
            where: { id },
            include: {
                tree: {include: {
                    species: true,
                    treeUpdates : {
                        orderBy: {
                            createdAt: 'desc'
                        }
                    }
                }},
                user: true,
            }
        });
    }


    // UNTUK DASHBOARD USER(MELIHAT ADOPSI USER TERTENTU)
    async getUserAdoptions(userId: string){
        return prisma.adoption.findMany({
            where: {userId},
            include: {
                tree:{
                    include:{
                        species: true,
                        treeUpdates: { orderBy: { createdAt: 'desc' }, take: 1 },
                    }

                }
            },
            orderBy: {
                adoptedAt: 'desc'
            }
        })
    }

    //UNTUK MENGUPDATE URL SERTIFIKAT ADOPSI
    async updateCertificateUrl(id: string, certificateUrl: string){
        return prisma.adoption.update({
            where: {id},
            data: {certificateUrl}
        });
    }

    //untuk dashboard
    async findByUserId(userId: string) {
    return prisma.adoption.findMany({
      where: { userId },
      include: {
        // Data species
        species: {
          select: {
            id: true,
            name: true,
            latinName: true,
            mainImageUrl: true,
            carbonAbsorptionRate: true,
            category: true,
          }
        },
        // Data pohon fisik
        tree: {
          select: {
            id: true,
            serialNumber: true,
            latitude: true,
            longitude: true,
            plantedAt: true,
            status: true,
            createdAt: true,
            // Update terbaru (ambil 1 saja)
            treeUpdates: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: {
                id: true,
                photoUrl: true,
                heightCm: true,
                diameterCm: true,
                co2AbsorbedTotal: true,
                adminNotes: true,
                createdAt: true,
              }
            }
          }
        },
        // Data order
        order: {
          select: {
            id: true,
            orderNumber: true,
            totalAmount: true,
            paymentStatus: true,
            createdAt: true,
          }
        }
      },
      orderBy: { adoptedAt: 'desc' } // terbaru dulu
        });
    }


    async detailAdoption(adoptionId: string){
        return prisma.adoption.findUnique({
            where: {id: adoptionId},
            include: {
                species: true,
                tree: {
                    include:{
                        treeUpdates:{
                            orderBy: {createdAt: 'desc'},
                            select:{
                                id: true,
                                photoUrl: true,
                                heightCm: true,
                                diameterCm: true,
                                co2AbsorbedTotal: true,
                                adminNotes: true,
                                createdAt: true,
                            }
                        }
                    }
                },
                order: true,
                user:{
                    select:{
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        })
    }

    async getStatistic(userId: string) {
        const adoptions = await prisma.adoption.findMany({
            where: { userId },
            include: {
                species: true,
                tree: {
                include: {
                    treeUpdates: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    }
                }
                }
            }
        });

        //total pohon
        const totalTrees = adoptions.length;

        // Hitung total CO2 diserap (dari update terbaru)
        const totalCO2Absorbed = adoptions.reduce((sum, adoption) => {
            const latestUpdate = adoption.tree?.treeUpdates[0];
            return sum + (latestUpdate?.co2AbsorbedTotal || 0);
        }, 0);

        //Hitung species yang berbeda
        const uniqueSpecies = new Set(
            adoptions.map(a => a.speciesId)
        ).size;

        // Pohon tertinggi
        const tallestTree = adoptions.reduce((max, adoption) => {
        const latestUpdate = adoption.tree?.treeUpdates[0];
        const height = latestUpdate?.heightCm || 0;
        return height > max ? height : max;
        }, 0);

        return {
            totalTrees,
            totalCO2Absorbed,
            uniqueSpecies,
            tallestTree,
        };

    }
}

export const adoptionRepository = new AdoptionRepository();