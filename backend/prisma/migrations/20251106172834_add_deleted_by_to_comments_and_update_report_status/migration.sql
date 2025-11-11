/*
  Warnings:

  - The values [REJECTED] on the enum `ReportStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ReportStatus_new" AS ENUM ('RESOLVED', 'PENDING');
ALTER TABLE "public"."CommentReports" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."CommentReports" ALTER COLUMN "status" TYPE "public"."ReportStatus_new" USING ("status"::text::"public"."ReportStatus_new");
ALTER TYPE "public"."ReportStatus" RENAME TO "ReportStatus_old";
ALTER TYPE "public"."ReportStatus_new" RENAME TO "ReportStatus";
DROP TYPE "public"."ReportStatus_old";
ALTER TABLE "public"."CommentReports" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Comments" ADD COLUMN     "deletedBy" UUID;

-- AddForeignKey
ALTER TABLE "public"."Comments" ADD CONSTRAINT "Comments_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "public"."Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
