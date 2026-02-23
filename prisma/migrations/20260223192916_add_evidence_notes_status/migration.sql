-- CreateEnum
CREATE TYPE "ScoreStatus" AS ENUM ('pending', 'confirmed');

-- AlterTable
ALTER TABLE "scores" ADD COLUMN     "evidence_url" TEXT,
ADD COLUMN     "judge_notes" TEXT,
ADD COLUMN     "status" "ScoreStatus" NOT NULL DEFAULT 'pending';
