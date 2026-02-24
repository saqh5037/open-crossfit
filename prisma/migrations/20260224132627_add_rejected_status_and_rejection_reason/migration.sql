-- AlterEnum
ALTER TYPE "ScoreStatus" ADD VALUE 'rejected';

-- AlterTable
ALTER TABLE "scores" ADD COLUMN     "rejection_reason" TEXT;
