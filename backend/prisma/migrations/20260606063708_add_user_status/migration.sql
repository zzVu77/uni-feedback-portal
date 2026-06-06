/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `DataSources` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DEACTIVATED', 'PERMANENTLY_DELETED');

-- AlterTable
ALTER TABLE "DataSources" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "deactivatedUntil" TIMESTAMP(3),
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
