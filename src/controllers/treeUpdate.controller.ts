import { Request, Response } from 'express';
import express from 'express';
import prisma from '../prisma/prisma';

const router = express.Router();

// GET all tree updates
router.get('/tree-updates', async (req: Request, res: Response) => {
    try {
        console.log('Fetching tree updates...');
        const treeUpdates = await prisma.treeUpdate.findMany({
            include: {
                tree: true
            }
        });
        console.log('Tree updates fetched:', treeUpdates);
        res.json(treeUpdates);
    } catch (error) {
        console.error('Error fetching tree updates:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST create new tree update
router.post('/tree-updates', async (req: Request, res: Response) => {
    try {
        const { treeId, photoUrl, heightCm, diameterCm, co2AbsorbedTotal, adminNotes } = req.body;

        if (!treeId || !photoUrl || heightCm === undefined || diameterCm === undefined || co2AbsorbedTotal === undefined) {
            return res.status(400).json({
                success: false,
                message: 'treeId, photoUrl, heightCm, diameterCm, and co2AbsorbedTotal are required'
            });
        }

        const newTreeUpdate = await prisma.treeUpdate.create({
            data: {
                treeId,
                photoUrl,
                heightCm: parseFloat(heightCm),
                diameterCm: parseFloat(diameterCm),
                co2AbsorbedTotal: parseFloat(co2AbsorbedTotal),
                adminNotes: adminNotes || null
            },
            include: {
                tree: true
            }
        });

        res.status(201).json({
            success: true,
            message: 'Tree update created successfully',
            data: newTreeUpdate
        });
    } catch (error) {
        console.error('Error creating tree update:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create tree update',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;
