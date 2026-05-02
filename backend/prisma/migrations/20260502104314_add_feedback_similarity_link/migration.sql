-- CreateTable
CREATE TABLE "FeedbackSimilarityLink" (
    "id" UUID NOT NULL,
    "sourceFeedbackId" UUID NOT NULL,
    "targetFeedbackId" UUID NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "FeedbackSimilarityLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FeedbackSimilarityLink_sourceFeedbackId_idx" ON "FeedbackSimilarityLink"("sourceFeedbackId");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackSimilarityLink_sourceFeedbackId_targetFeedbackId_key" ON "FeedbackSimilarityLink"("sourceFeedbackId", "targetFeedbackId");

-- AddForeignKey
ALTER TABLE "FeedbackSimilarityLink" ADD CONSTRAINT "FeedbackSimilarityLink_sourceFeedbackId_fkey" FOREIGN KEY ("sourceFeedbackId") REFERENCES "Feedbacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackSimilarityLink" ADD CONSTRAINT "FeedbackSimilarityLink_targetFeedbackId_fkey" FOREIGN KEY ("targetFeedbackId") REFERENCES "Feedbacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
