-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_departmentId_fkey";

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "departmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
