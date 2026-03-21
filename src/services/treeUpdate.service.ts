import { treeUpdateRepository } from '../repository/treeUpdate.repository';
import prisma from '../prisma/prisma';

interface CreateTreeUpdateDTO {
    photoUrl: string;
    heightCm: number;
    diameterCm: number;
    co2AbsorbedTotal: number;
    adminNotes?: string;
}

interface UpdateTreeUpdateDTO {
    photoUrl?: string;
    heightCm?: number;
    diameterCm?: number;
    co2AbsorbedTotal?: number;
    adminNotes?: string;
}

class TreeUpdateService {

    // [ADMIN] Tambah update baru untuk pohon
    async createTreeUpdate(treeId: string, data: CreateTreeUpdateDTO) {
        // Pastikan pohon ada
        const tree = await prisma.tree.findUnique({ where: { id: treeId } });
        if (!tree) throw new Error('Pohon tidak ditemukan');

        return treeUpdateRepository.createTreeUpdate(treeId, data);
    }

    // [ADMIN] Ambil semua update milik satu pohon
    async getUpdatesByTreeId(treeId: string) {
        const tree = await prisma.tree.findUnique({ where: { id: treeId } });
        if (!tree) throw new Error('Pohon tidak ditemukan');

        return treeUpdateRepository.getUpdatesByTreeId(treeId);
    }

    // [ADMIN] Edit update yang sudah ada
    async updateTreeUpdate(updateId: string, data: UpdateTreeUpdateDTO) {
        const existing = await treeUpdateRepository.getUpdateById(updateId);
        if (!existing) throw new Error('Update tidak ditemukan');

        return treeUpdateRepository.updateTreeUpdate(updateId, data);
    }

    // [ADMIN] Hapus update
    async deleteTreeUpdate(updateId: string) {
        const existing = await treeUpdateRepository.getUpdateById(updateId);
        if (!existing) throw new Error('Update tidak ditemukan');

        return treeUpdateRepository.deleteTreeUpdate(updateId);
    }

    // [USER] Ambil semua update pohon berdasarkan adoptionId
    // Sekaligus validasi bahwa adopsi ini memang milik user tersebut
    async getUpdatesByAdoptionId(adoptionId: string, userId: string) {
        const updates = await treeUpdateRepository.getUpdatesByAdoptionId(adoptionId, userId);

        if (updates === null) {
            throw new Error('Adopsi tidak ditemukan atau Anda tidak memiliki akses');
        }

        return updates;
    }
}

export const treeUpdateService = new TreeUpdateService();