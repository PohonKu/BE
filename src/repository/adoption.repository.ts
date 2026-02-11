import prisma from '../prisma/prisma';

class AdoptionRepository {
    async create(data:{
        userId: string;
        treeId: string;
        orderId: string;
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


}

export const adoptionRepository = new AdoptionRepository();