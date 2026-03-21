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

class TreeUpdateRepository {

    // Buat update baru untuk pohon tertentu
    async createTreeUpdate(treeId: string, data: CreateTreeUpdateDTO) {
        return prisma.treeUpdate.create({
            data: {
                treeId,
                photoUrl: data.photoUrl,
                heightCm: data.heightCm,
                diameterCm: data.diameterCm,
                co2AbsorbedTotal: data.co2AbsorbedTotal,
                adminNotes: data.adminNotes ?? null,
            },
        });
    }

    // Ambil semua update milik satu pohon (terbaru dulu)
    async getUpdatesByTreeId(treeId: string) {
        return prisma.treeUpdate.findMany({
            where: { treeId },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Ambil satu update berdasarkan id-nya
    async getUpdateById(updateId: string) {
        return prisma.treeUpdate.findUnique({
            where: { id: updateId },
        });
    }

    // Edit update yang sudah ada
    async updateTreeUpdate(updateId: string, data: UpdateTreeUpdateDTO) {
        return prisma.treeUpdate.update({
            where: { id: updateId },
            data,
        });
    }

    // Hapus update
    async deleteTreeUpdate(updateId: string) {
        return prisma.treeUpdate.delete({
            where: { id: updateId },
        });
    }

    // Ambil semua update milik pohon-pohon dari adoption user tertentu
    // Dipakai untuk halaman detail adopsi dari sisi user
    async getUpdatesByAdoptionId(adoptionId: string, userId: string) {
        const adoption = await prisma.adoption.findFirst({
            where: {
                id: adoptionId,
                userId, // pastikan adopsi ini milik user yang request
            },
            select: {
                treeId: true,
            },
        });

        if (!adoption) return null; // null = adopsi tidak ditemukan / bukan milik user ini

        return prisma.treeUpdate.findMany({
            where: { treeId: adoption.treeId },
            orderBy: { createdAt: 'desc' },
        });
    }
}

export const treeUpdateRepository = new TreeUpdateRepository();