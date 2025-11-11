/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Departments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Departments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Departments" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Departments_email_key" ON "public"."Departments"("email");

-- CreateIndex
CREATE INDEX "Departments_isActive_idx" ON "public"."Departments"("isActive");
