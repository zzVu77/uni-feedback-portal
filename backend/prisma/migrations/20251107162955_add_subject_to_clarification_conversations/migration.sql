/*
  Warnings:

  - Added the required column `subject` to the `ClarificationConversations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ClarificationConversations" ADD COLUMN     "subject" TEXT NOT NULL;
