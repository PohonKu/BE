-- AlterTable
ALTER TABLE "adoptions" ADD COLUMN     "expires_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "duration_years" INTEGER NOT NULL DEFAULT 1;
