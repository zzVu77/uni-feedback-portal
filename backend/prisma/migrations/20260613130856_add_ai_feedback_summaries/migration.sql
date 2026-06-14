-- CreateEnum
CREATE TYPE "ReportPeriodType" AS ENUM ('WEEKLY', 'MONTHLY');

-- CreateTable
CREATE TABLE "AiFeedbackSummaries" (
    "id" UUID NOT NULL,
    "periodType" "ReportPeriodType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "topIssues" JSONB NOT NULL,
    "sentimentScore" DOUBLE PRECISION NOT NULL,
    "overallSummary" TEXT NOT NULL,
    "recommendations" JSONB NOT NULL,
    "totalFeedbacksAnalyzed" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiFeedbackSummaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiFeedbackSummaries_startDate_endDate_idx" ON "AiFeedbackSummaries"("startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "AiFeedbackSummaries_periodType_startDate_endDate_key" ON "AiFeedbackSummaries"("periodType", "startDate", "endDate");
