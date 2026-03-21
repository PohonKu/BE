import { Request, Response } from 'express';
import { treeUpdateService } from '../services/treeUpdate.service';
import { sendSuccess, sendError } from '../utils/response.util';

class TreeUpdateController {

    // [ADMIN] POST /api/v1/admin/trees/:treeId/updates
    async createTreeUpdate(req: Request, res: Response) {
        try {
            const { treeId } = req.params;
            const { photoUrl, heightCm, diameterCm, co2AbsorbedTotal, adminNotes } = req.body;

            if (!photoUrl || heightCm === undefined || diameterCm === undefined || co2AbsorbedTotal === undefined) {
                return sendError(res, 'photoUrl, heightCm, diameterCm, dan co2AbsorbedTotal wajib diisi', 400);
            }

            const update = await treeUpdateService.createTreeUpdate(treeId, {
                photoUrl,
                heightCm: Number(heightCm),
                diameterCm: Number(diameterCm),
                co2AbsorbedTotal: Number(co2AbsorbedTotal),
                adminNotes,
            });

            sendSuccess(res, 'Update pohon berhasil ditambahkan', update, 201);
        } catch (error: any) {
            const status = error.message.includes('tidak ditemukan') ? 404 : 500;
            sendError(res, error.message, status);
        }
    }

    // [ADMIN] GET /api/v1/admin/trees/:treeId/updates
    async getUpdatesByTreeId(req: Request, res: Response) {
        try {
            const { treeId } = req.params;

            const updates = await treeUpdateService.getUpdatesByTreeId(treeId);

            sendSuccess(res, 'Daftar update pohon berhasil diambil', updates);
        } catch (error: any) {
            const status = error.message.includes('tidak ditemukan') ? 404 : 500;
            sendError(res, error.message, status);
        }
    }

    // [ADMIN] PATCH /api/v1/admin/trees/:treeId/updates/:updateId
    async updateTreeUpdate(req: Request, res: Response) {
        try {
            const { updateId } = req.params;
            const { photoUrl, heightCm, diameterCm, co2AbsorbedTotal, adminNotes } = req.body;

            // Semua field opsional saat edit
            const data: any = {};
            if (photoUrl !== undefined) data.photoUrl = photoUrl;
            if (heightCm !== undefined) data.heightCm = Number(heightCm);
            if (diameterCm !== undefined) data.diameterCm = Number(diameterCm);
            if (co2AbsorbedTotal !== undefined) data.co2AbsorbedTotal = Number(co2AbsorbedTotal);
            if (adminNotes !== undefined) data.adminNotes = adminNotes;

            if (Object.keys(data).length === 0) {
                return sendError(res, 'Tidak ada field yang diubah', 400);
            }

            const updated = await treeUpdateService.updateTreeUpdate(updateId, data);

            sendSuccess(res, 'Update pohon berhasil diubah', updated);
        } catch (error: any) {
            const status = error.message.includes('tidak ditemukan') ? 404 : 500;
            sendError(res, error.message, status);
        }
    }

    // [ADMIN] DELETE /api/v1/admin/trees/:treeId/updates/:updateId
    async deleteTreeUpdate(req: Request, res: Response) {
        try {
            const { updateId } = req.params;

            await treeUpdateService.deleteTreeUpdate(updateId);

            sendSuccess(res, 'Update pohon berhasil dihapus', null);
        } catch (error: any) {
            const status = error.message.includes('tidak ditemukan') ? 404 : 500;
            sendError(res, error.message, status);
        }
    }

    // [USER] GET /api/v1/adoptions/:adoptionId/updates
    async getUpdatesByAdoptionId(req: Request, res: Response) {
        try {
            const userId = (req.user as any).id;
            const { adoptionId } = req.params;

            const updates = await treeUpdateService.getUpdatesByAdoptionId(adoptionId, userId);

            sendSuccess(res, 'Riwayat perkembangan pohon berhasil diambil', updates);
        } catch (error: any) {
            const status = error.message.includes('tidak memiliki akses') ? 403
                : error.message.includes('tidak ditemukan') ? 404
                    : 500;
            sendError(res, error.message, status);
        }
    }
}

export const treeUpdateController = new TreeUpdateController();