/*
  Warnings:

  - A unique constraint covering the columns `[_dlt_id]` on the table `dashboard_trending_issues` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `_dlt_id` to the `dashboard_trending_issues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `_dlt_load_id` to the `dashboard_trending_issues` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('FACEBOOK');

-- CreateEnum
CREATE TYPE "DataSourceStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "dashboard_trending_issues" ADD COLUMN     "_dlt_id" VARCHAR NOT NULL,
ADD COLUMN     "_dlt_load_id" VARCHAR NOT NULL,
ADD COLUMN     "crawled_at" TIMESTAMPTZ(6);

-- CreateTable
CREATE TABLE "_dlt_loads" (
    "load_id" VARCHAR(64) NOT NULL,
    "schema_name" VARCHAR,
    "status" BIGINT NOT NULL,
    "inserted_at" TIMESTAMPTZ(6) NOT NULL,
    "schema_version_hash" VARCHAR
);

-- CreateTable
CREATE TABLE "_dlt_pipeline_state" (
    "version" BIGINT NOT NULL,
    "engine_version" BIGINT NOT NULL,
    "pipeline_name" VARCHAR NOT NULL,
    "state" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "version_hash" VARCHAR,
    "_dlt_load_id" VARCHAR(64) NOT NULL,
    "_dlt_id" VARCHAR NOT NULL
);

-- CreateTable
CREATE TABLE "_dlt_version" (
    "version" BIGINT NOT NULL,
    "engine_version" BIGINT NOT NULL,
    "inserted_at" TIMESTAMPTZ(6) NOT NULL,
    "schema_name" VARCHAR NOT NULL,
    "version_hash" VARCHAR NOT NULL,
    "schema" VARCHAR NOT NULL
);

-- CreateTable
CREATE TABLE "DataSources" (
    "id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "description" TEXT,
    "status" "DataSourceStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataSources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "_dlt_pipeline_state__dlt_id_key" ON "_dlt_pipeline_state"("_dlt_id");

-- CreateIndex
CREATE UNIQUE INDEX "DataSources_url_key" ON "DataSources"("url");

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_trending_issues__dlt_id_key" ON "dashboard_trending_issues"("_dlt_id");
