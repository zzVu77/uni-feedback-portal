/*
  Warnings:

  - Added the required column `updatedAt` to the `CommentReports` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReportDecision" AS ENUM ('VIOLATION', 'NO_VIOLATION');

-- AlterTable
ALTER TABLE "CommentReports" ADD COLUMN     "decision" "ReportDecision",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
