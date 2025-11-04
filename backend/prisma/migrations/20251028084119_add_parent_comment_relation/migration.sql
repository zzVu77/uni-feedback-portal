-- AlterTable
ALTER TABLE "public"."Comments" ADD COLUMN     "parentId" UUID;

-- AddForeignKey
ALTER TABLE "public"."Comments" ADD CONSTRAINT "Comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
