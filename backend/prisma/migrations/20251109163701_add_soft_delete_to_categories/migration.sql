/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Categories` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Categories" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "public"."Categories"("name");

-- CreateIndex
CREATE INDEX "Categories_isActive_idx" ON "public"."Categories"("isActive");
