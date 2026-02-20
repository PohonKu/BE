/*
  Warnings:

  - You are about to drop the column `tree_id` on the `order_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tree_id]` on the table `adoptions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_id]` on the table `adoptions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_id]` on the table `order_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `species_id` to the `adoptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_on_tag` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `species_id` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_tree_id_fkey";

-- AlterTable
ALTER TABLE "adoptions" ADD COLUMN     "species_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "tree_id",
ADD COLUMN     "name_on_tag" TEXT NOT NULL,
ADD COLUMN     "species_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "expired_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "tree_species" ADD COLUMN     "reserved_stock" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "trees" ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'SOLD',
ALTER COLUMN "planted_at" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "adoptions_tree_id_key" ON "adoptions"("tree_id");

-- CreateIndex
CREATE UNIQUE INDEX "adoptions_order_id_key" ON "adoptions"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_items_order_id_key" ON "order_items"("order_id");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "tree_species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoptions" ADD CONSTRAINT "adoptions_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "tree_species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
