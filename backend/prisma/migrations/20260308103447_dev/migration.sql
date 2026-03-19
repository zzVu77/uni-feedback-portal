/*
  Warnings:

  - The values [TOXIC] on the enum `FeedbackStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isToxic` on the `Feedbacks` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FeedbackStatus_new" AS ENUM ('AI_REVIEWING', 'VIOLATED_CONTENT', 'AI_REVIEW_FAILED', 'PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED');
ALTER TABLE "public"."Feedbacks" ALTER COLUMN "currentStatus" DROP DEFAULT;
ALTER TABLE "Feedbacks" ALTER COLUMN "currentStatus" TYPE "FeedbackStatus_new" USING ("currentStatus"::text::"FeedbackStatus_new");
ALTER TABLE "FeedbackStatusHistory" ALTER COLUMN "status" TYPE "FeedbackStatus_new" USING ("status"::text::"FeedbackStatus_new");
ALTER TYPE "FeedbackStatus" RENAME TO "FeedbackStatus_old";
ALTER TYPE "FeedbackStatus_new" RENAME TO "FeedbackStatus";
DROP TYPE "public"."FeedbackStatus_old";
ALTER TABLE "Feedbacks" ALTER COLUMN "currentStatus" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Feedbacks" DROP COLUMN "isToxic";
