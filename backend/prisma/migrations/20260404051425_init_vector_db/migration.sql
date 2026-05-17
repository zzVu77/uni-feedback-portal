CREATE EXTENSION IF NOT EXISTS vector;
-- CreateTable
CREATE TABLE "FeedbackEmbeddings" (
    "id" UUID NOT NULL,
    "feedbackId" UUID NOT NULL,
    "embedding" vector (1024) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FeedbackEmbeddings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackEmbeddings_feedbackId_key" ON "FeedbackEmbeddings" ("feedbackId");

-- AddForeignKey
ALTER TABLE "FeedbackEmbeddings"
ADD CONSTRAINT "FeedbackEmbeddings_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedbacks" ("id") ON DELETE CASCADE ON UPDATE CASCADE;