-- Migration script to add dashboard_post_comments and update dashboard_trending_issues
-- Safe execution with IF NOT EXISTS checks

-- 1. AlterTable dashboard_trending_issues
ALTER TABLE "dashboard_trending_issues" 
ADD COLUMN IF NOT EXISTS "is_comments_crawled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "comments_ai_summary" TEXT,
ADD COLUMN IF NOT EXISTS "negative_comments_ratio" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "urgency_level" TEXT DEFAULT 'NORMAL';

-- 2. CreateTable dashboard_post_comments
CREATE TABLE IF NOT EXISTS "dashboard_post_comments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
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

-- 3. Create Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "dashboard_post_comments_comment_id_key" ON "dashboard_post_comments"("comment_id");
CREATE INDEX IF NOT EXISTS "dashboard_post_comments_post_id_idx" ON "dashboard_post_comments"("post_id");
CREATE INDEX IF NOT EXISTS "dashboard_post_comments_sentiment_label_idx" ON "dashboard_post_comments"("sentiment_label");

-- 4. Add ForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'dashboard_post_comments_post_id_fkey'
    ) THEN
        ALTER TABLE "dashboard_post_comments" 
        ADD CONSTRAINT "dashboard_post_comments_post_id_fkey" 
        FOREIGN KEY ("post_id") REFERENCES "dashboard_trending_issues"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
