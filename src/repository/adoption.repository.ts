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
}

export const adoptionRepository = new AdoptionRepository();