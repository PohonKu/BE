import { Request, Response } from 'express';
import express from 'express';
import prisma from '../prisma/prisma';

const router = express.Router();

// GET all tree species
router.get('/tree-species', async (req: Request, res: Response) => {
    try {
        console.log('Fetching tree species...');
        const treeSpecies = await prisma.treeSpecies.findMany({
            include: {
                trees: true
            }
        });
        console.log('Tree species fetched:', treeSpecies);
        res.json(treeSpecies);
    } catch (error) {
        console.error('Error fetching tree species:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST create new tree species
router.post('/tree-species', async (req: Request, res: Response) => {
    try {
        const { name, latinName, storyContent, mainImageUrl, basePrice, carbonAbsorptionRate } = req.body;

        if (!name || !latinName || !storyContent || !mainImageUrl || !basePrice || !carbonAbsorptionRate) {
            return res.status(400).json({
                success: false,
                message: 'name, latinName, storyContent, mainImageUrl, basePrice, and carbonAbsorptionRate are required'
            });
        }

        // Check if name already exists
        const existingSpecies = await prisma.treeSpecies.findUnique({
            where: { name }
        });

        if (existingSpecies) {
            return res.status(409).json({
                success: false,
                message: 'Tree species name already exists'
            });
        }

        const newTreeSpecies = await prisma.treeSpecies.create({
            data: {
                name,
                latinName,
                storyContent,
                mainImageUrl,
                basePrice,
                carbonAbsorptionRate
            }
        });

        res.status(201).json({
            success: true,
            message: 'Tree species created successfully',
            data: newTreeSpecies
        });
    } catch (error) {
        console.error('Error creating tree species:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create tree species',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;
