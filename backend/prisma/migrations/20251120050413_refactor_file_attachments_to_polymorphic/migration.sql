/*
  Warnings:

  - You are about to drop the `FileAttachmentForAnnouncement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FileAttachmentForFeedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FileAttachmentForMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FileTargetType" AS ENUM ('FEEDBACK', 'MESSAGE', 'ANNOUNCEMENT');

-- DropForeignKey
ALTER TABLE "public"."FileAttachmentForAnnouncement" DROP CONSTRAINT "FileAttachmentForAnnouncement_announcementId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FileAttachmentForFeedback" DROP CONSTRAINT "FileAttachmentForFeedback_feedbackId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FileAttachmentForMessage" DROP CONSTRAINT "FileAttachmentForMessage_messageId_fkey";

-- DropTable
DROP TABLE "public"."FileAttachmentForAnnouncement";

-- DropTable
DROP TABLE "public"."FileAttachmentForFeedback";

-- DropTable
DROP TABLE "public"."FileAttachmentForMessage";

-- CreateTable
CREATE TABLE "FileAttachments" (
    "id" UUID NOT NULL,
    "targetId" UUID NOT NULL,
    "targetType" "FileTargetType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileAttachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FileAttachments_targetId_targetType_idx" ON "FileAttachments"("targetId", "targetType");
