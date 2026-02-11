-- AlterTable
ALTER TABLE "tree_species" ADD COLUMN     "available_stock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'umum',
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '';
