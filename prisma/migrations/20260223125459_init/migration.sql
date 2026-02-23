-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "ScoreType" AS ENUM ('time', 'reps', 'weight');

-- CreateEnum
CREATE TYPE "SortOrder" AS ENUM ('asc', 'desc');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('owner', 'admin', 'judge');

-- CreateTable
CREATE TABLE "event_config" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'CrossFit Open 2026',
    "description" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "logo_url" TEXT,
    "primary_color" TEXT NOT NULL DEFAULT '#DC2626',
    "secondary_color" TEXT NOT NULL DEFAULT '#1F2937',
    "registration_open" BOOLEAN NOT NULL DEFAULT false,
    "divisions" JSONB NOT NULL DEFAULT '["rx_male","rx_female","scaled_male","scaled_female"]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "athletes" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "gender" "Gender" NOT NULL,
    "division" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "athletes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "day_number" INTEGER NOT NULL,
    "description" TEXT,
    "score_type" "ScoreType" NOT NULL,
    "time_cap_seconds" INTEGER,
    "sort_order" "SortOrder" NOT NULL,
    "display_order" SERIAL NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scores" (
    "id" TEXT NOT NULL,
    "athlete_id" TEXT NOT NULL,
    "wod_id" TEXT NOT NULL,
    "raw_score" DECIMAL(65,30) NOT NULL,
    "display_score" TEXT NOT NULL,
    "is_rx" BOOLEAN NOT NULL DEFAULT true,
    "scored_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'judge',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "athletes_division_idx" ON "athletes"("division");

-- CreateIndex
CREATE INDEX "athletes_gender_idx" ON "athletes"("gender");

-- CreateIndex
CREATE UNIQUE INDEX "athletes_full_name_gender_key" ON "athletes"("full_name", "gender");

-- CreateIndex
CREATE UNIQUE INDEX "wods_day_number_key" ON "wods"("day_number");

-- CreateIndex
CREATE INDEX "scores_wod_id_idx" ON "scores"("wod_id");

-- CreateIndex
CREATE INDEX "scores_athlete_id_idx" ON "scores"("athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "scores_athlete_id_wod_id_key" ON "scores"("athlete_id", "wod_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_wod_id_fkey" FOREIGN KEY ("wod_id") REFERENCES "wods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
