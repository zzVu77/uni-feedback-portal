-- Script to create social_raw.comments table in Google BigQuery
-- Run this in BigQuery Console or via bq CLI

CREATE TABLE IF NOT EXISTS `uni-feedback-data.social_raw.comments` (
    comment_id STRING NOT NULL OPTIONS(description="Unique Facebook comment ID or MD5 hash"),
    post_id STRING NOT NULL OPTIONS(description="Parent post ID referencing social_raw.posts"),
    parent_comment_id STRING OPTIONS(description="Parent comment ID if this is a reply, NULL otherwise"),
    author STRING OPTIONS(description="Comment author name or Anonymous"),
    content STRING NOT NULL OPTIONS(description="Full text of the comment"),
    reaction_count INT64 OPTIONS(description="Total reactions on the comment"),
    commented_at TIMESTAMP OPTIONS(description="Timestamp when comment was published"),
    crawled_at TIMESTAMP NOT NULL OPTIONS(description="Timestamp when comment was crawled")
)
PARTITION BY DATE(crawled_at)
CLUSTER BY post_id, comment_id
OPTIONS (
    description = "Raw Facebook comments scraped for high-risk and negative posts"
);

-- AI Raw tables for Comments Analysis and Summary
CREATE TABLE IF NOT EXISTS `uni-feedback-data.ai_raw.comment_analysis` (
    comment_id STRING NOT NULL OPTIONS(description="Reference to comment_id"),
    post_id STRING NOT NULL OPTIONS(description="Reference to post_id"),
    sentiment_label STRING NOT NULL OPTIONS(description="Tiêu cực, Tích cực, Trung lập, Bức xúc"),
    sentiment_score FLOAT64 NOT NULL OPTIONS(description="Sentiment score ranging from -1.0 to 1.0"),
    is_top_concern BOOL NOT NULL OPTIONS(description="True if comment mentions evidence/specific complaint"),
    analyzed_at TIMESTAMP NOT NULL OPTIONS(description="Timestamp when AI analysis was performed")
)
PARTITION BY DATE(analyzed_at)
CLUSTER BY post_id, comment_id;

CREATE TABLE IF NOT EXISTS `uni-feedback-data.ai_raw.post_comments_summary` (
    post_id STRING NOT NULL OPTIONS(description="Reference to post_id"),
    comments_summary STRING NOT NULL OPTIONS(description="AI synthesized crowd opinion summary"),
    urgency_level STRING NOT NULL OPTIONS(description="NORMAL, WARNING, CRITICAL"),
    negative_comments_ratio FLOAT64 OPTIONS(description="Percentage ratio of negative comments"),
    analyzed_at TIMESTAMP NOT NULL OPTIONS(description="Timestamp when AI synthesis was performed")
)
PARTITION BY DATE(analyzed_at)
CLUSTER BY post_id;
