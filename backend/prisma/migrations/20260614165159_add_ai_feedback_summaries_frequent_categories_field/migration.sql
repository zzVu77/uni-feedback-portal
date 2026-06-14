/*
  Warnings:

  - You are about to drop the column `recommendations` on the `AiFeedbackSummaries` table. All the data in the column will be lost.
  - You are about to drop the column `topIssues` on the `AiFeedbackSummaries` table. All the data in the column will be lost.
  - Added the required column `frequentCategories` to the `AiFeedbackSummaries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AiFeedbackSummaries" DROP COLUMN "recommendations",
DROP COLUMN "topIssues",
ADD COLUMN     "frequentCategories" JSONB NOT NULL;
