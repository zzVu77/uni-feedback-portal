import dlt
from sqlalchemy import create_engine, text
from google.cloud import bigquery
import os
import uuid
import logging
from dotenv import load_dotenv
load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def sync_dashboard_data():
    logger.info("Starting Reverse ETL logic (Delta Load + dlt UPSERT)...")
    
    # 1. init BigQuery client and load Postgres URI from environment variables
    bq_client = bigquery.Client()
    pg_uri = os.environ.get("DATABASE_URL")
    
    logger.info(f"PostgreSQL URI loaded: {'YES' if pg_uri else 'NO'}") 
    
    if not pg_uri:
        raise ValueError("DATABASE_URL is not set. Please check your .env file.")
    
    engine = create_engine(pg_uri, pool_pre_ping=True, pool_recycle=300)

    # 2. Find watermarks for incremental loading
    max_crawled_date = None
    max_comment_crawled_date = None
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT MAX(crawled_at) FROM dashboard_trending_issues"))
            max_crawled_date = result.scalar()

            try:
                comment_result = conn.execute(text("SELECT MAX(crawled_at) FROM dashboard_post_comments"))
                max_comment_crawled_date = comment_result.scalar()
            except Exception:
                logger.info("dashboard_post_comments table watermark not found or empty.")
    except Exception as e:
        logger.warning(
            "Could not connect to target Postgres or fetch watermarks. "
            "Please check if your database instance is active. Error: " + str(e)
        )
        raise e

    # 3. Initialize dlt pipeline with Postgres destination
    pipeline = dlt.pipeline(
        pipeline_name='bq_to_postgres_dashboard',
        destination=dlt.destinations.postgres(credentials=pg_uri),
        dataset_name='public' 
    )

    # ==========================================
    # A. Sync Posts (dashboard_trending_issues)
    # ==========================================
    if max_crawled_date:
        logger.info(f"Postgres Posts Watermark: {max_crawled_date}. Fetching new or updated posts...")
        query_posts = f"""
            SELECT * FROM `uni-feedback-data.uni_feedback_data_marts.mrt_trending_issues_dashboard`
            WHERE crawled_at > '{max_crawled_date}' OR is_comments_crawled = TRUE
        """
    else:
        logger.info("First run for posts. Fetching posts from the last 90 days...")
        query_posts = """
            SELECT * FROM `uni-feedback-data.uni_feedback_data_marts.mrt_trending_issues_dashboard`
            WHERE posted_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 90 DAY)
        """
        
    logger.info("Fetching posts from BigQuery...")
    posts_job = bq_client.query(query_posts)
    post_records = [dict(row) for row in posts_job.result()]

    if post_records:
        logger.info(f"Pushing {len(post_records)} posts to PostgreSQL using dlt...")
        posts_load_info = pipeline.run(
            data=post_records,
            table_name='dashboard_trending_issues',
            write_disposition='merge', 
            primary_key='post_id'
        )
        logger.info(f"Posts Sync completed! DLT Load Info:\n{posts_load_info}")
    else:
        logger.info("No new posts to sync.")

    # ==========================================
    # B. Sync Comments (dashboard_post_comments)
    # ==========================================
    try:
        if max_comment_crawled_date:
            logger.info(f"Postgres Comments Watermark: {max_comment_crawled_date}. Fetching new comments...")
            query_comments = f"""
                SELECT * FROM `uni-feedback-data.uni_feedback_data_marts.mrt_post_comments_detail`
                WHERE crawled_at > '{max_comment_crawled_date}'
            """
        else:
            logger.info("First run for comments. Fetching comments from the last 90 days...")
            query_comments = """
                SELECT * FROM `uni-feedback-data.uni_feedback_data_marts.mrt_post_comments_detail`
                WHERE commented_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 90 DAY)
            """

        logger.info("Fetching comments from BigQuery...")
        comments_job = bq_client.query(query_comments)
        comment_records = [dict(row) for row in comments_job.result()]

        if comment_records:
            # Ensure each comment record has an id (UUID) to satisfy Prisma / Postgres primary key constraint
            for r in comment_records:
                if not r.get("id"):
                    r["id"] = str(uuid.uuid4())

            logger.info(f"Pushing {len(comment_records)} comments to PostgreSQL using dlt...")
            comments_load_info = pipeline.run(
                data=comment_records,
                table_name='dashboard_post_comments',
                write_disposition='merge', 
                primary_key='comment_id'
            )
            logger.info(f"Comments Sync completed! DLT Load Info:\n{comments_load_info}")
        else:
            logger.info("No new comments to sync.")

    except Exception as e:
        logger.warning(f"⚠️ Comments sync skipped or encountered warning (mrt table might be empty): {e}")

    logger.info("✅ All Reverse ETL sync tasks completed successfully!")

if __name__ == "__main__":
    sync_dashboard_data()