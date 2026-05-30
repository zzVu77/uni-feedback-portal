-- CreateTable
CREATE TABLE "dashboard_trending_issues" (
    "post_id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "post_link" TEXT,
    "posted_at" TIMESTAMP(3) NOT NULL,
    "reaction_count" INTEGER NOT NULL,
    "comment_count" INTEGER NOT NULL,
    "engagement_score" INTEGER NOT NULL,
    "topic" TEXT NOT NULL,
    "sentiment_score" DOUBLE PRECISION NOT NULL,
    "ai_summary" TEXT NOT NULL,
    "sentiment_label" TEXT NOT NULL,
    "analyzed_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dashboard_trending_issues_pkey" PRIMARY KEY ("post_id")
);
