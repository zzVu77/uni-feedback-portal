/*
  Warnings:

  - Made the column `message` on table `ForwardingLogs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."ForwardingLogs" ADD COLUMN     "note" TEXT,
ALTER COLUMN "message" SET NOT NULL;
