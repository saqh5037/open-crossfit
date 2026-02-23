-- AlterEnum: Add 'coach' to AdminRole
ALTER TYPE "AdminRole" ADD VALUE 'coach';

-- AlterTable: Add participant_number to athletes (auto-increment)
ALTER TABLE "athletes" ADD COLUMN "participant_number" SERIAL NOT NULL;
CREATE UNIQUE INDEX "athletes_participant_number_key" ON "athletes"("participant_number");

-- AlterTable: Add qr_base_url to event_config
ALTER TABLE "event_config" ADD COLUMN "qr_base_url" TEXT NOT NULL DEFAULT '';
