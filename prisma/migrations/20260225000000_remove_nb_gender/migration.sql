-- AlterEnum: Remove NB from Gender
-- First update any existing NB athletes to F (fallback)
UPDATE "Athlete" SET "gender" = 'F'::"Gender" WHERE "gender" = 'NB'::"Gender";

-- Remove the NB value from the Gender enum
ALTER TYPE "Gender" RENAME TO "Gender_old";
CREATE TYPE "Gender" AS ENUM ('M', 'F');
ALTER TABLE "Athlete" ALTER COLUMN "gender" TYPE "Gender" USING ("gender"::text::"Gender");
DROP TYPE "Gender_old";
