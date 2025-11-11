/*
  Warnings:

  - You are about to drop the column `postId` on the `Comments` table. All the data in the column will be lost.
  - Added the required column `targetId` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetType` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."CommentTargetType" AS ENUM ('FORUM_POST', 'ANNOUNCEMENT');

-- AlterEnum
ALTER TYPE "public"."NotificationType" ADD VALUE 'ANNOUNCEMENT_NOTIFICATION';

-- DropForeignKey
ALTER TABLE "public"."Comments" DROP CONSTRAINT "Comments_postId_fkey";

-- AlterTable
ALTER TABLE "public"."Comments" DROP COLUMN "postId",
ADD COLUMN     "targetId" UUID NOT NULL,
ADD COLUMN     "targetType" "public"."CommentTargetType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Notifications" ADD COLUMN     "relatedEntityId" UUID;

-- CreateTable
CREATE TABLE "public"."RefreshTokens" (
    "token" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshTokens_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshTokens_token_key" ON "public"."RefreshTokens"("token");

-- AddForeignKey
ALTER TABLE "public"."RefreshTokens" ADD CONSTRAINT "RefreshTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
