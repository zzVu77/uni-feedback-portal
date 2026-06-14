-- CreateTable
CREATE TABLE "FeedbackRatings" (
    "id" UUID NOT NULL,
    "feedbackId" UUID NOT NULL,
    "ratingScore" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackRatings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackRatings_feedbackId_key" ON "FeedbackRatings"("feedbackId");

-- AddForeignKey
ALTER TABLE "FeedbackRatings" ADD CONSTRAINT "FeedbackRatings_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedbacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
