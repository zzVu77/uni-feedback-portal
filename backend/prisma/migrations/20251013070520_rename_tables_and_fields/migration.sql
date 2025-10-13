/*
  Warnings:

  - You are about to drop the `announcements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clarification_conversations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comment_reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `departments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feedback_status_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feedbacks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `file_attachment_for_announcement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `file_attachment_for_feedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `forum_posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `forwarding_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `votes` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."NotificationTypes" AS ENUM ('VOTE_NOTIFICATION', 'REPORT_NOTIFICATION', 'COMMENT_NOTIFICATION', 'MESSAGE_NOTIFICATION', 'FEEDBACK_NOTIFICATION');

-- CreateEnum
CREATE TYPE "public"."FeedbackStatuses" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."ReportStatuses" AS ENUM ('RESOLVED', 'PENDING', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."UserRoles" AS ENUM ('DEPARTMENT_STAFF', 'STUDENT', 'ADMIN');

-- DropForeignKey
ALTER TABLE "public"."announcements" DROP CONSTRAINT "announcements_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."clarification_conversations" DROP CONSTRAINT "clarification_conversations_feedback_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."clarification_conversations" DROP CONSTRAINT "clarification_conversations_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."comment_reports" DROP CONSTRAINT "comment_reports_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."comment_reports" DROP CONSTRAINT "comment_reports_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comments_post_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."feedback_status_history" DROP CONSTRAINT "feedback_status_history_feedback_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."feedbacks" DROP CONSTRAINT "feedbacks_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."feedbacks" DROP CONSTRAINT "feedbacks_department_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."feedbacks" DROP CONSTRAINT "feedbacks_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."file_attachment_for_announcement" DROP CONSTRAINT "file_attachment_for_announcement_announcement_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."file_attachment_for_feedback" DROP CONSTRAINT "file_attachment_for_feedback_feedback_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."forum_posts" DROP CONSTRAINT "forum_posts_feedback_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."forwarding_logs" DROP CONSTRAINT "forwarding_logs_feedback_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."forwarding_logs" DROP CONSTRAINT "forwarding_logs_from_department_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."forwarding_logs" DROP CONSTRAINT "forwarding_logs_to_department_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."forwarding_logs" DROP CONSTRAINT "forwarding_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."messages" DROP CONSTRAINT "messages_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."messages" DROP CONSTRAINT "messages_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_department_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."votes" DROP CONSTRAINT "votes_post_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."votes" DROP CONSTRAINT "votes_user_id_fkey";

-- DropTable
DROP TABLE "public"."announcements";

-- DropTable
DROP TABLE "public"."categories";

-- DropTable
DROP TABLE "public"."clarification_conversations";

-- DropTable
DROP TABLE "public"."comment_reports";

-- DropTable
DROP TABLE "public"."comments";

-- DropTable
DROP TABLE "public"."departments";

-- DropTable
DROP TABLE "public"."feedback_status_history";

-- DropTable
DROP TABLE "public"."feedbacks";

-- DropTable
DROP TABLE "public"."file_attachment_for_announcement";

-- DropTable
DROP TABLE "public"."file_attachment_for_feedback";

-- DropTable
DROP TABLE "public"."forum_posts";

-- DropTable
DROP TABLE "public"."forwarding_logs";

-- DropTable
DROP TABLE "public"."messages";

-- DropTable
DROP TABLE "public"."notifications";

-- DropTable
DROP TABLE "public"."users";

-- DropTable
DROP TABLE "public"."votes";

-- DropEnum
DROP TYPE "public"."FeedbackStatus";

-- DropEnum
DROP TYPE "public"."NotificationType";

-- DropEnum
DROP TYPE "public"."ReportStatus";

-- DropEnum
DROP TYPE "public"."UserRole";

-- CreateTable
CREATE TABLE "public"."Users" (
    "userId" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."UserRoles" NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "public"."Departments" (
    "departmentId" SERIAL NOT NULL,
    "departmentName" TEXT NOT NULL,

    CONSTRAINT "Departments_pkey" PRIMARY KEY ("departmentId")
);

-- CreateTable
CREATE TABLE "public"."Categories" (
    "categoryId" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "public"."Feedbacks" (
    "feedbackId" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "currentStatus" "public"."FeedbackStatuses" NOT NULL,
    "isPrivate" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedbacks_pkey" PRIMARY KEY ("feedbackId")
);

-- CreateTable
CREATE TABLE "public"."FeedbackStatusHistory" (
    "feedbackStatusId" SERIAL NOT NULL,
    "feedbackId" INTEGER NOT NULL,
    "status" "public"."FeedbackStatuses" NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedbackStatusHistory_pkey" PRIMARY KEY ("feedbackStatusId")
);

-- CreateTable
CREATE TABLE "public"."ForwardingLogs" (
    "forwardingLogId" SERIAL NOT NULL,
    "feedbackId" INTEGER NOT NULL,
    "fromDepartmentId" INTEGER NOT NULL,
    "toDepartmentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForwardingLogs_pkey" PRIMARY KEY ("forwardingLogId")
);

-- CreateTable
CREATE TABLE "public"."ForumPosts" (
    "postId" SERIAL NOT NULL,
    "feedbackId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForumPosts_pkey" PRIMARY KEY ("postId")
);

-- CreateTable
CREATE TABLE "public"."Votes" (
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Votes_pkey" PRIMARY KEY ("userId","postId")
);

-- CreateTable
CREATE TABLE "public"."Comments" (
    "commentId" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("commentId")
);

-- CreateTable
CREATE TABLE "public"."CommentReports" (
    "commentReportId" SERIAL NOT NULL,
    "commentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "reason" TEXT,
    "status" "public"."ReportStatuses" NOT NULL,
    "adminResponse" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommentReports_pkey" PRIMARY KEY ("commentReportId")
);

-- CreateTable
CREATE TABLE "public"."ClarificationConversations" (
    "conversationId" SERIAL NOT NULL,
    "feedbackId" INTEGER NOT NULL,
    "isClosed" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClarificationConversations_pkey" PRIMARY KEY ("conversationId")
);

-- CreateTable
CREATE TABLE "public"."Messages" (
    "messageId" SERIAL NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("messageId")
);

-- CreateTable
CREATE TABLE "public"."FileAttachmentForFeedback" (
    "id" SERIAL NOT NULL,
    "feedbackId" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,

    CONSTRAINT "FileAttachmentForFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FileAttachmentForAnnouncement" (
    "id" SERIAL NOT NULL,
    "announcementId" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,

    CONSTRAINT "FileAttachmentForAnnouncement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Announcements" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notifications" (
    "notificationId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "notificationType" "public"."NotificationTypes" NOT NULL,
    "isRead" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("notificationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "public"."Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ForumPosts_feedbackId_key" ON "public"."ForumPosts"("feedbackId");

-- AddForeignKey
ALTER TABLE "public"."Users" ADD CONSTRAINT "Users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Departments"("departmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Feedbacks" ADD CONSTRAINT "Feedbacks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Feedbacks" ADD CONSTRAINT "Feedbacks_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Departments"("departmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Feedbacks" ADD CONSTRAINT "Feedbacks_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Categories"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FeedbackStatusHistory" ADD CONSTRAINT "FeedbackStatusHistory_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "public"."Feedbacks"("feedbackId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ForwardingLogs" ADD CONSTRAINT "ForwardingLogs_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "public"."Feedbacks"("feedbackId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ForwardingLogs" ADD CONSTRAINT "ForwardingLogs_fromDepartmentId_fkey" FOREIGN KEY ("fromDepartmentId") REFERENCES "public"."Departments"("departmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ForwardingLogs" ADD CONSTRAINT "ForwardingLogs_toDepartmentId_fkey" FOREIGN KEY ("toDepartmentId") REFERENCES "public"."Departments"("departmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ForwardingLogs" ADD CONSTRAINT "ForwardingLogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ForumPosts" ADD CONSTRAINT "ForumPosts_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "public"."Feedbacks"("feedbackId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Votes" ADD CONSTRAINT "Votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Votes" ADD CONSTRAINT "Votes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."ForumPosts"("postId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comments" ADD CONSTRAINT "Comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."ForumPosts"("postId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comments" ADD CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommentReports" ADD CONSTRAINT "CommentReports_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."Comments"("commentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommentReports" ADD CONSTRAINT "CommentReports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClarificationConversations" ADD CONSTRAINT "ClarificationConversations_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "public"."Feedbacks"("feedbackId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClarificationConversations" ADD CONSTRAINT "ClarificationConversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Messages" ADD CONSTRAINT "Messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."ClarificationConversations"("conversationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Messages" ADD CONSTRAINT "Messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FileAttachmentForFeedback" ADD CONSTRAINT "FileAttachmentForFeedback_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "public"."Feedbacks"("feedbackId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FileAttachmentForAnnouncement" ADD CONSTRAINT "FileAttachmentForAnnouncement_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "public"."Announcements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Announcements" ADD CONSTRAINT "Announcements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
