-- CreateEnum
CREATE TYPE "ScoreAction" AS ENUM ('created', 'updated', 'confirmed', 'rejected', 'deleted');

-- AlterTable
ALTER TABLE "scores" ADD COLUMN     "confirmed_by" TEXT;

-- CreateTable
CREATE TABLE "score_audits" (
    "id" TEXT NOT NULL,
    "score_id" TEXT NOT NULL,
    "action" "ScoreAction" NOT NULL,
    "old_values" JSONB,
    "new_values" JSONB,
    "performed_by" TEXT NOT NULL,
    "performed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "score_audits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "score_audits_score_id_idx" ON "score_audits"("score_id");

-- CreateIndex
CREATE INDEX "score_audits_performed_by_idx" ON "score_audits"("performed_by");
