import dlt
from sqlalchemy import create_engine, text
from google.cloud import bigquery
import os
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
    
    engine = create_engine(pg_uri)

    # 2. Find the most recent crawled_at timestamp in the target Postgres table to use as a watermark for incremental loading
    max_crawled_date = None
    with engine.connect() as conn:
        try:
            result = conn.execute(text("SELECT MAX(crawled_at) FROM dashboard_trending_issues"))
            max_crawled_date = result.scalar()
        except Exception as e:
            logger.warning("Could not fetch max crawled_at from Postgres. Assuming first run. Error: " + str(e))

    # 3. Hit BigQuery with an incremental query to get only new or updated posts since the last run, based on either the post's crawl time or the AI analysis time.
    if max_crawled_date:
        logger.info(f"Postgres: {max_crawled_date}. Fetching new posts ...")
        query = f"""
            SELECT * FROM `uni-feedback-data.uni_feedback_data_marts.mrt_trending_issues_dashboard`
            WHERE crawled_at > '{max_crawled_date}'
        """
    else:
        logger.info("First run. Fetching all posts about the last 90 days...")
        query = """
            SELECT * FROM `uni-feedback-data.uni_feedback_data_marts.mrt_trending_issues_dashboard`
            WHERE posted_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 90 DAY)
        """
        
    logger.info("Fetching data from BigQuery...")
    query_job = bq_client.query(query)
    results = query_job.result()

    # 4. Convert BigQuery results to list of dicts for dlt
    records = [dict(row) for row in results]
    if not records:
        logger.info("No new records to sync. Exiting.")
        return
        
    logger.info(f"Push {len(records)} rows to PostgreSQL using dlt...")

    # 5. Initialize dlt pipeline with Postgres destination and dataset/schema name
    pipeline = dlt.pipeline(
        pipeline_name='bq_to_postgres_dashboard',
        destination=dlt.destinations.postgres(credentials=pg_uri),
        dataset_name='public' 
    )

    # Execute the pipeline run, pushing data to Postgres with UPSERT logic based on the post_id primary key
    load_info = pipeline.run(
        data=records,
        table_name='dashboard_trending_issues',
        write_disposition='merge', 
        primary_key='post_id'
    )
    
    logger.info("Sync completed successfully!")
    logger.info(f"DLT Load Info:\n{load_info}") 

if __name__ == "__main__":
    sync_dashboard_data()