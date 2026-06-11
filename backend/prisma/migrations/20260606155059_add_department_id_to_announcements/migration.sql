-- AlterTable
ALTER TABLE "Announcements" ADD COLUMN     "departmentId" UUID;

-- AddForeignKey
ALTER TABLE "Announcements" ADD CONSTRAINT "Announcements_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
