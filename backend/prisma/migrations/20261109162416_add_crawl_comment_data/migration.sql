-- AlterTable
ALTER TABLE "dashboard_trending_issues" ADD COLUMN     "comments_ai_summary" TEXT,
ADD COLUMN     "is_comments_crawled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "negative_comments_ratio" DOUBLE PRECISION,
ADD COLUMN     "urgency_level" TEXT DEFAULT 'NORMAL';

-- CreateTable
CREATE TABLE "dashboard_post_comments" (
    "id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "parent_comment_id" TEXT,
    "author" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "reaction_count" INTEGER NOT NULL DEFAULT 0,
    "commented_at" TIMESTAMP(3) NOT NULL,
    "sentiment_label" TEXT NOT NULL,
    "sentiment_score" DOUBLE PRECISION NOT NULL,
    "is_top_concern" BOOLEAN NOT NULL DEFAULT false,
    "crawled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dashboard_post_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_post_comments_comment_id_key" ON "dashboard_post_comments"("comment_id");

-- CreateIndex
CREATE INDEX "dashboard_post_comments_post_id_idx" ON "dashboard_post_comments"("post_id");

-- CreateIndex
CREATE INDEX "dashboard_post_comments_sentiment_label_idx" ON "dashboard_post_comments"("sentiment_label");

-- AddForeignKey
ALTER TABLE "dashboard_post_comments" ADD CONSTRAINT "dashboard_post_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "dashboard_trending_issues"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;
