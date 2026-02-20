import { Request, Response } from 'express';
import { adoptionService } from '../services/adoption.service';
//import { certificateService } from '../services/certificate.service';
import { sendSuccess, sendError } from '../utils/response.util';


class AdoptionController{
    async getUserAdoptions(req: Request, res: Response){
        try{
            const userId = (req.params as any).id;
            const adoption = await adoptionService.getUserAdoptions(userId);

            sendSuccess(res, 'Adoptions retrieved successfully', adoption)
        } catch (error: any){
            sendError(res, error.message, 404);
        }
    }

    async getAdoptionDetail(req: Request, res: Response) {
        try {
        const userId = (req.user as any).id;
        const { id } = req.params;

        const adoption = await adoptionService.getAdoptionDetail(id, userId);
        
        sendSuccess(res, 'Detail adoption berhasil diambil', adoption);
        } catch (error: any) {
        const statusCode = error.message.includes('tidak memiliki akses') ? 403 : 404;
        sendError(res, error.message, statusCode);
        }
    }

    async getDashboardStats(req: Request, res: Response) {
        try {
        const userId = (req.user as any).id;
        
        const stats = await adoptionService.getDashboardStats(userId);
        
        sendSuccess(res, 'Statistik berhasil diambil', stats);
        } catch (error: any) {
        sendError(res, error.message);
        }
    }

    async getAdoptionById(req: Request, res: Response) {
        try {
        const { id } = req.params;
        const adoption = await adoptionService.getAdoptionById(id);
        sendSuccess(res, 'Adoption retrieved successfully', adoption);
        } catch (error: any) {
        sendError(res, error.message, 404);
        }
    }
}

export const adoptionController = new AdoptionController();




{/**
import { Request, Response } from 'express';
import express from 'express';
import prisma from '../prisma/prisma';

const router = express.Router();

// GET all adoptions
router.get('/adoptions', async (req: Request, res: Response) => {
    try {
        console.log('Fetching adoptions...');
        const adoptions = await prisma.adoption.findMany({
            include: {
                user: true,
                tree: true,
                order: true
            }
        });
        console.log('Adoptions fetched:', adoptions);
        res.json(adoptions);
    } catch (error) {
        console.error('Error fetching adoptions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST create new adoption
router.post('/adoptions', async (req: Request, res: Response) => {
    try {
        const { userId, treeId, orderId, nameOnTag, certificateUrl } = req.body;

        if (!userId || !treeId || !orderId || !nameOnTag) {
            return res.status(400).json({
                success: false,
                message: 'userId, treeId, orderId, and nameOnTag are required'
            });
        }

        const newAdoption = await prisma.adoption.create({
            data: {
                userId,
                treeId,
                orderId,
                nameOnTag,
                certificateUrl: certificateUrl || null
            },
            include: {
                user: true,
                tree: true,
                order: true
            }
        });

        res.status(201).json({
            success: true,
            message: 'Adoption created successfully',
            data: newAdoption
        });
    } catch (error) {
        console.error('Error creating adoption:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create adoption',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;
 */}