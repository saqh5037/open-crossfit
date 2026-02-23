-- DropIndex
DROP INDEX "athletes_full_name_gender_key";

-- AlterTable: make email and phone required
ALTER TABLE "athletes" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "athletes" ALTER COLUMN "phone" SET NOT NULL;

-- CreateIndex: unique on email
CREATE UNIQUE INDEX "athletes_email_key" ON "athletes"("email");
