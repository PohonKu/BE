import prisma from '../prisma/prisma';
import {Prisma, Tree, TreeSpecies} from '@prisma/client';

interface CreateTreeSpeciesDTO {
  name: string;
  latinName: string;
  storyContent: string;
  mainImageUrl: string;
  basePrice: number;
  carbonAbsorptionRate: number;
  description: string;
  availabelStock: number;
  category: string;
}


class TreeRepository {

    //------------------------------------Tree Species----------------------------------------------//
    // AMBIL SEMUA DATA SPECIES TREE (page order)
    async getAllSpecies(): Promise<TreeSpecies[]> {
        return prisma.treeSpecies.findMany({
            orderBy: {
                name: 'asc'
            },
        });
    }

    // AMBIL DATA SPECIES TREE BERDASARKAN ID
    async getSpeciesById(id: string): Promise<TreeSpecies | null> {
        return prisma.treeSpecies.findUnique({
            where: { id },
            include: {
                trees: true
            }
        });
    }

    // MEMBUAT DATA SPECIES TREE BARU (post di admin untuk nambahin data)
    async createSpecies(data: CreateTreeSpeciesDTO): Promise<TreeSpecies> {
        return prisma.treeSpecies.create({ data });
    }

    async postSpecies(data:{
        name: string;
        latinName: string;
        storyContent: string;
        mainImageUrl: string;
        basePrice: number;
        carbonAbsorptionRate: number;
        description: string;
        availabelStok: number;
        category: string;
    }){
        const species = await prisma.treeSpecies.create({
            data: {
                name: data.name,
                latinName: data.latinName,
                storyContent: data.storyContent,
                mainImageUrl: data.mainImageUrl,
                basePrice: data.basePrice,
                carbonAbsorptionRate: data.carbonAbsorptionRate,
                description: data.description,
                availabelStok: data.availabelStok,
                category: data.category
            }
        });
        return species;
    }

    async bulkCreateSpecies(data: CreateTreeSpeciesDTO[]): Promise<{ count: number }> {
        return prisma.treeSpecies.createMany({
            data,
            skipDuplicates: true  // skip kalau name sudah ada
        });
    }
    



    //-------------------------------------Tree---------------------------------------------//
    //
    async getAvailableTrees(speciesId?: string){
        return prisma.tree.findMany({
            where:{
                status: 'available',
                ...(speciesId && { speciesId })
            },
            include:{
                species: true
            }
        });
    }

    async getTreeById(id: string) {
        return prisma.tree.findUnique({
            where: { id },
            include: {
                species: true,
                treeUpdates: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }

        });
    }

    async updateTreeStatus(id: string, status: string): Promise<Tree> {
        return prisma.tree.update({
            where: { id },
            data: { status }
        })
    }

    async createTree(data: Prisma.TreeCreateInput): Promise<Tree> {
        return prisma.tree.create({ data });
    }

    async createTreeUpdate(data: Prisma.TreeUpdateCreateInput) {
        return prisma.treeUpdate.create({ data });
    }

}

export const treeRepository = new TreeRepository();