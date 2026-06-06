/*
  Warnings:

  - Added the required column `updatedAt` to the `DataSources` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'STAFF_ASSISTANT';

-- AlterTable
ALTER TABLE "DataSources" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Feedbacks" ADD COLUMN     "assigneeId" UUID;
