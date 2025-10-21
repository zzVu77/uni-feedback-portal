/*
  Warnings:

  - The primary key for the `Announcements` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryId` on the `Categories` table. All the data in the column will be lost.
  - You are about to drop the column `categoryName` on the `Categories` table. All the data in the column will be lost.
  - The primary key for the `ClarificationConversations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `conversationId` on the `ClarificationConversations` table. All the data in the column will be lost.
  - The primary key for the `CommentReports` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `commentReportId` on the `CommentReports` table. All the data in the column will be lost.
  - The `status` column on the `CommentReports` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `commentId` on the `Comments` table. All the data in the column will be lost.
  - The primary key for the `Departments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `departmentId` on the `Departments` table. All the data in the column will be lost.
  - You are about to drop the column `departmentName` on the `Departments` table. All the data in the column will be lost.
  - The primary key for the `FeedbackStatusHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `feedbackStatusId` on the `FeedbackStatusHistory` table. All the data in the column will be lost.
  - The primary key for the `Feedbacks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `feedbackId` on the `Feedbacks` table. All the data in the column will be lost.
  - The `currentStatus` column on the `Feedbacks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `FileAttachmentForAnnouncement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FileAttachmentForFeedback` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ForumPosts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `postId` on the `ForumPosts` table. All the data in the column will be lost.
  - The primary key for the `ForwardingLogs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `forwardingLogId` on the `ForwardingLogs` table. All the data in the column will be lost.
  - The primary key for the `Messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `messageId` on the `Messages` table. All the data in the column will be lost.
  - The primary key for the `Notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `notificationId` on the `Notifications` table. All the data in the column will be lost.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Users` table. All the data in the column will be lost.
  - The primary key for the `Votes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `Announcements` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `Announcements` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `id` was added to the `Categories` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `Categories` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `ClarificationConversations` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `feedbackId` on the `ClarificationConversations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `ClarificationConversations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `id` was added to the `CommentReports` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `commentId` on the `CommentReports` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `CommentReports` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `id` was added to the `Comments` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `postId` on the `Comments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `Comments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `id` was added to the `Departments` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `Departments` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `FeedbackStatusHistory` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `feedbackId` on the `FeedbackStatusHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `FeedbackStatusHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `message` on table `FeedbackStatusHistory` required. This step will fail if there are existing NULL values in that column.
  - The required column `id` was added to the `Feedbacks` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `userId` on the `Feedbacks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `departmentId` on the `Feedbacks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `categoryId` on the `Feedbacks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `FileAttachmentForAnnouncement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `announcementId` on the `FileAttachmentForAnnouncement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `FileAttachmentForFeedback` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `feedbackId` on the `FileAttachmentForFeedback` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `id` was added to the `ForumPosts` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `feedbackId` on the `ForumPosts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `id` was added to the `ForwardingLogs` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `feedbackId` on the `ForwardingLogs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `fromDepartmentId` on the `ForwardingLogs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `toDepartmentId` on the `ForwardingLogs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `ForwardingLogs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `id` was added to the `Messages` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `conversationId` on the `Messages` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `Messages` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `id` was added to the `Notifications` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `userId` on the `Notifications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `notificationType` on the `Notifications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `id` was added to the `Users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `role` on the `Users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `departmentId` on the `Users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `Votes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `postId` on the `Votes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('VOTE_NOTIFICATION', 'REPORT_NOTIFICATION', 'COMMENT_NOTIFICATION', 'MESSAGE_NOTIFICATION', 'FEEDBACK_NOTIFICATION');

-- CreateEnum
CREATE TYPE "public"."FeedbackStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('RESOLVED', 'PENDING', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('DEPARTMENT_STAFF', 'STUDENT', 'ADMIN');

-- DropForeignKey
ALTER TABLE "public"."Announcements" DROP CONSTRAINT "Announcements_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClarificationConversations" DROP CONSTRAINT "ClarificationConversations_feedbackId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClarificationConversations" DROP CONSTRAINT "ClarificationConversations_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CommentReports" DROP CONSTRAINT "CommentReports_commentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CommentReports" DROP CONSTRAINT "CommentReports_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comments" DROP CONSTRAINT "Comments_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comments" DROP CONSTRAINT "Comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FeedbackStatusHistory" DROP CONSTRAINT "FeedbackStatusHistory_feedbackId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Feedbacks" DROP CONSTRAINT "Feedbacks_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Feedbacks" DROP CONSTRAINT "Feedbacks_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Feedbacks" DROP CONSTRAINT "Feedbacks_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FileAttachmentForAnnouncement" DROP CONSTRAINT "FileAttachmentForAnnouncement_announcementId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FileAttachmentForFeedback" DROP CONSTRAINT "FileAttachmentForFeedback_feedbackId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ForumPosts" DROP CONSTRAINT "ForumPosts_feedbackId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ForwardingLogs" DROP CONSTRAINT "ForwardingLogs_feedbackId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ForwardingLogs" DROP CONSTRAINT "ForwardingLogs_fromDepartmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ForwardingLogs" DROP CONSTRAINT "ForwardingLogs_toDepartmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ForwardingLogs" DROP CONSTRAINT "ForwardingLogs_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Messages" DROP CONSTRAINT "Messages_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Messages" DROP CONSTRAINT "Messages_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Notifications" DROP CONSTRAINT "Notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Users" DROP CONSTRAINT "Users_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Votes" DROP CONSTRAINT "Votes_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Votes" DROP CONSTRAINT "Votes_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Announcements" DROP CONSTRAINT "Announcements_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "Announcements_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Categories" DROP CONSTRAINT "Categories_pkey",
DROP COLUMN "categoryId",
DROP COLUMN "categoryName",
ADD COLUMN     "id" UUID NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD CONSTRAINT "Categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."ClarificationConversations" DROP CONSTRAINT "ClarificationConversations_pkey",
DROP COLUMN "conversationId",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "feedbackId",
ADD COLUMN     "feedbackId" UUID NOT NULL,
ALTER COLUMN "isClosed" SET DEFAULT false,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "ClarificationConversations_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."CommentReports" DROP CONSTRAINT "CommentReports_pkey",
DROP COLUMN "commentReportId",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "commentId",
ADD COLUMN     "commentId" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."ReportStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "CommentReports_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Comments" DROP CONSTRAINT "Comments_pkey",
DROP COLUMN "commentId",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "postId",
ADD COLUMN     "postId" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Comments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Departments" DROP CONSTRAINT "Departments_pkey",
DROP COLUMN "departmentId",
DROP COLUMN "departmentName",
ADD COLUMN     "id" UUID NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD CONSTRAINT "Departments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."FeedbackStatusHistory" DROP CONSTRAINT "FeedbackStatusHistory_pkey",
DROP COLUMN "feedbackStatusId",
ADD COLUMN     "id" UUID NOT NULL,
ADD COLUMN     "note" TEXT,
DROP COLUMN "feedbackId",
ADD COLUMN     "feedbackId" UUID NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."FeedbackStatus" NOT NULL,
ALTER COLUMN "message" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "FeedbackStatusHistory_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Feedbacks" DROP CONSTRAINT "Feedbacks_pkey",
DROP COLUMN "feedbackId",
ADD COLUMN     "id" UUID NOT NULL,
ADD COLUMN     "location" TEXT,
DROP COLUMN "currentStatus",
ADD COLUMN     "currentStatus" "public"."FeedbackStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "isPrivate" SET DEFAULT false,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
DROP COLUMN "departmentId",
ADD COLUMN     "departmentId" UUID NOT NULL,
DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" UUID NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Feedbacks_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."FileAttachmentForAnnouncement" DROP CONSTRAINT "FileAttachmentForAnnouncement_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "announcementId",
ADD COLUMN     "announcementId" UUID NOT NULL,
ADD CONSTRAINT "FileAttachmentForAnnouncement_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."FileAttachmentForFeedback" DROP CONSTRAINT "FileAttachmentForFeedback_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "feedbackId",
ADD COLUMN     "feedbackId" UUID NOT NULL,
ADD CONSTRAINT "FileAttachmentForFeedback_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."ForumPosts" DROP CONSTRAINT "ForumPosts_pkey",
DROP COLUMN "postId",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "feedbackId",
ADD COLUMN     "feedbackId" UUID NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "ForumPosts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."ForwardingLogs" DROP CONSTRAINT "ForwardingLogs_pkey",
DROP COLUMN "forwardingLogId",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "feedbackId",
ADD COLUMN     "feedbackId" UUID NOT NULL,
DROP COLUMN "fromDepartmentId",
ADD COLUMN     "fromDepartmentId" UUID NOT NULL,
DROP COLUMN "toDepartmentId",
ADD COLUMN     "toDepartmentId" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "ForwardingLogs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Messages" DROP CONSTRAINT "Messages_pkey",
DROP COLUMN "messageId",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "conversationId",
ADD COLUMN     "conversationId" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Messages_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Notifications" DROP CONSTRAINT "Notifications_pkey",
DROP COLUMN "notificationId",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
DROP COLUMN "notificationType",
ADD COLUMN     "notificationType" "public"."NotificationType" NOT NULL,
ALTER COLUMN "isRead" SET DEFAULT false,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Users" DROP CONSTRAINT "Users_pkey",
DROP COLUMN "userId",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "public"."UserRole" NOT NULL,
DROP COLUMN "departmentId",
ADD COLUMN     "departmentId" UUID NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Votes" DROP CONSTRAINT "Votes_pkey",
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
DROP COLUMN "postId",
ADD COLUMN     "postId" UUID NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Votes_pkey" PRIMARY KEY ("userId", "postId");

-- DropEnum
DROP TYPE "public"."FeedbackStatuses";

-- DropEnum
DROP TYPE "public"."NotificationTypes";

-- DropEnum
DROP TYPE "public"."ReportStatuses";

-- DropEnum
DROP TYPE "public"."UserRoles";

-- CreateTable
CREATE TABLE "public"."FileAttachmentForMessage" (
    "id" UUID NOT NULL,
    "messageId" UUID NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,

    CONSTRAINT "FileAttachmentForMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ForumPosts_feedbackId_key" ON "public"."ForumPosts"("feedbackId");

-- AddForeignKey
ALTER TABLE "public"."Users" ADD CONSTRAINT "Users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Feedbacks" ADD CONSTRAINT "Feedbacks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Feedbacks" ADD CONSTRAINT "Feedbacks_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Feedbacks" ADD CONSTRAINT "Feedbacks_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FeedbackStatusHistory" ADD CONSTRAINT "FeedbackStatusHistory_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "public"."Feedbacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ForwardingLogs" ADD CONSTRAINT "ForwardingLogs_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "public"."Feedbacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ForwardingLogs" ADD CONSTRAINT "ForwardingLogs_fromDepartmentId_fkey" FOREIGN KEY ("fromDepartmentId") REFERENCES "public"."Departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ForwardingLogs" ADD CONSTRAINT "ForwardingLogs_toDepartmentId_fkey" FOREIGN KEY ("toDepartmentId") REFERENCES "public"."Departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ForwardingLogs" ADD CONSTRAINT "ForwardingLogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ForumPosts" ADD CONSTRAINT "ForumPosts_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "public"."Feedbacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Votes" ADD CONSTRAINT "Votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Votes" ADD CONSTRAINT "Votes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."ForumPosts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comments" ADD CONSTRAINT "Comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."ForumPosts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comments" ADD CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommentReports" ADD CONSTRAINT "CommentReports_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."Comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommentReports" ADD CONSTRAINT "CommentReports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClarificationConversations" ADD CONSTRAINT "ClarificationConversations_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "public"."Feedbacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClarificationConversations" ADD CONSTRAINT "ClarificationConversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Messages" ADD CONSTRAINT "Messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."ClarificationConversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Messages" ADD CONSTRAINT "Messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FileAttachmentForMessage" ADD CONSTRAINT "FileAttachmentForMessage_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."Messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FileAttachmentForFeedback" ADD CONSTRAINT "FileAttachmentForFeedback_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "public"."Feedbacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FileAttachmentForAnnouncement" ADD CONSTRAINT "FileAttachmentForAnnouncement_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "public"."Announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Announcements" ADD CONSTRAINT "Announcements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
