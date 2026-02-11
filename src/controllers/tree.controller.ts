import { Request, Response } from "express";
import { treeService } from "../services/tree.service";
import { sendSuccess, sendError } from "../utils/response.util";
import { error } from "node:console";



class TreeController{
    async getAllSpecies (req: Request, res: Response){
        try{
            const species = await treeService.getAllSpecies();
            sendSuccess(res, 'Species retrieved successfully', species)
        } catch(error: any) {
            sendError(res, error.message)
        }
    }

    async getSpeciesById(req: Request, res: Response){
        try{
            const {id} = req.params;
            const speciesById = await treeService.getSpeciesById(id);
            sendSuccess(res, 'Species retrieved successfully', speciesById);
        } catch(error: any) {
            sendError(res, error.message, 404);
        }
    }

    async getAvailableTrees(req: Request, res: Response) {
        try {
        const { speciesId } = req.query;
        const trees = await treeService.getAvailableTree(speciesId as string);
        sendSuccess(res, 'Trees retrieved successfully', trees);
        } catch (error: any) {
        sendError(res, error.message);
        }
    }

    async getTreeById(req: Request, res: Response) {
        try {
        const { id } = req.params;
        const tree = await treeService.getTreeById(id);
        sendSuccess(res, 'Tree retrieved successfully', tree);
        } catch (error: any) {
        sendError(res, error.message, 404);
        }
    }


    async postSpecies(req: Request, res: Response){
        try{
            const { name, latinName, storyContent, mainImageUrl, basePrice, carbonAbsorptionRate, description, availabelStok, category } = req.body;
            if (!name || !latinName || !storyContent || !mainImageUrl || !basePrice || !carbonAbsorptionRate || !description || !availabelStok || !category) {
                return sendError(res, 'All fields are required', 400);
            }
            const species = await treeService.postSpecies({
                name,
                latinName,
                storyContent,
                mainImageUrl,
                basePrice,
                carbonAbsorptionRate,
                description,
                availabelStok,
                category,

            });
            sendSuccess(res, "Species succes to post", species, 201)
        } catch (error: any){
            sendError(res, error.message)
        }
    }

    async bulkCreateSpecies(req:Request, res: Response){
        try{
            const data = req.body;
            if (!Array.isArray(data) || data.length === 0) {
                return sendError(res, 'Body harus berupa array dan tidak boleh kosong', 400);
            }

            const result =  await treeService.bulkCreateSpecies(data);
            return sendSuccess(res, `${result.count} species berhasil ditambahkan`, result, 201)
        } catch (error: any){
            sendError(res, error.message)
        }
    }

    async createSpecies(req: Request, res: Response){
        try{
            const { name, latinName, storyContent, mainImageUrl, basePrice, carbonAbsorptionRate } = req.body;

            if(!name || !latinName || !storyContent || !mainImageUrl || !basePrice || !carbonAbsorptionRate){
                return res.status(400).json({
                    success: false,
                    message: 'name, latinName, storyContent, mainImageUrl, basePrice, and carbonAbsorptionRate are required'
                });
            }

            


        }catch (error: any){
            sendError(res, error.message)
        }
    }
}

export const treeController = new TreeController();














{/*
import { Request, Response } from 'express';
import express from 'express';
import prisma from '../prisma/prisma';

const router = express.Router();

// GET all trees
router.get('/trees', async (req: Request, res: Response) => {
    try {
        console.log('Fetching trees...');
        const trees = await prisma.tree.findMany({
            include: {
                species: true,
                adoptions: true,
                orderItems: true,
                treeUpdates: true
            }
        });
        console.log('Trees fetched:', trees);
        res.json(trees);
    } catch (error) {
        console.error('Error fetching trees:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST create new tree
router.post('/trees', async (req: Request, res: Response) => {
    try {
        const { speciesId, serialNumber, latitude, longitude, status, plantedAt } = req.body;

        if (!speciesId || !serialNumber || !latitude || !longitude || !plantedAt) {
            return res.status(400).json({
                success: false,
                message: 'speciesId, serialNumber, latitude, longitude, and plantedAt are required'
            });
        }

        // Check if serial number already exists
        const existingTree = await prisma.tree.findUnique({
            where: { serialNumber }
        });

        if (existingTree) {
            return res.status(409).json({
                success: false,
                message: 'Serial number already exists'
            });
        }

        const newTree = await prisma.tree.create({
            data: {
                speciesId,
                serialNumber,
                latitude,
                longitude,
                status: status || 'AVAILABLE',
                plantedAt: new Date(plantedAt)
            },
            include: {
                species: true
            }
        });

        res.status(201).json({
            success: true,
            message: 'Tree created successfully',
            data: newTree
        });
    } catch (error) {
        console.error('Error creating tree:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create tree',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;
*/}