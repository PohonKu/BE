import { error } from "node:console";
import { Prisma } from "@prisma/client";
import { treeRepository } from "../repository/tree.repository";

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

class TreeService {

    //ambil species tree dengan search name dan filter category
    async getAllSpecies(searchName?: string, category?: string){
        return treeRepository.getAllSpecies(searchName, category);
    }

    //ambil species dengan id nya
    async getSpeciesById(id: string){
        const species =  await treeRepository.getSpeciesById(id);
        if(!species){
            throw new Error ('species not found');
        }
        return species;
    }

    //cari available tree untuk ditampilkan
    async getAvailableTree(speciesId?: string){
        const available = treeRepository.getAvailableTrees(speciesId);
        return available;
    }

    //cari berdasarkan id
    async getTreeById (id: string){
        const tree = await treeRepository.getTreeById(id);
        if(!tree) throw new Error('Tree by id not found');
        return tree;
    }

    async createTreeUpdate(treeId: string, data: Prisma.TreeUpdateCreateInput) {
        const tree = await treeRepository.getTreeById(treeId);
        if (!tree) throw new Error('Tree not found');

        return treeRepository.createTreeUpdate({
            
            ...data,
        });

    }

    async bulkCreateSpecies(data: CreateTreeSpeciesDTO[]) {
        return treeRepository.bulkCreateSpecies(data);
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
        const species = await treeRepository.postSpecies(data);
        return species;
    }

    //ambil species berdasarkan category
    async getSpeciesByCategory(category: string){
        const species = await treeRepository.getSpeciesByCategory(category);
        if(!species || species.length === 0){
            throw new Error('No species found for this category');
        }
        return species;
    }

}

export const treeService = new TreeService();
