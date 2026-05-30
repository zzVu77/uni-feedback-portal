/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `FileAttachments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileKey]` on the table `FileAttachments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileKey` to the `FileAttachments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FileAttachments" DROP COLUMN "fileUrl",
ADD COLUMN     "fileKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FileAttachments_fileKey_key" ON "FileAttachments"("fileKey");
