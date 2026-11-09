# prefect-flow/run_pipeline.py
import os
import subprocess
import requests
from prefect import task, flow
import logging
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
DBT_DIR = os.path.join(ROOT_DIR, "dbt_transformation")
CRAWLER_DIR = os.path.join(ROOT_DIR, "crawler")

logging.basicConfig(level=logging.INFO, format="%(levelname)s - %(message)s")
logger=logging.getLogger(__name__)
# ==========================================
# 1. Define Tasks (Each task corresponds to a step in the pipeline)
# ==========================================

@task(name="0. Get Active URLs", retries=2, retry_delay_seconds=30)
def get_active_urls():
    logger.info("Fetching active URLs from backend...")
    try:
        response = requests.get("https://api.uniportal.giahuynguyen28.id.vn/social-data-source/active-urls")
        response.raise_for_status()
        urls = response.json()
        if not urls:
            logger.warning("No active URLs found from backend!")
        logger.info(f"Active URLs fetched: {urls}")
        return urls
    except Exception as e:
        logger.error(f"Failed to fetch active URLs: {e}")
        return []

@task(name="1. Crawl Facebook Data", retries=2, retry_delay_seconds=60)
def run_crawler(urls):
    logger.info(f"Running Crawler at: {CRAWLER_DIR}")
    command = ["node", "crawler.js"]
    if urls:
        command.extend(urls)
    subprocess.run(command, cwd=CRAWLER_DIR, check=True)

@task(name="2. Load Raw to BigQuery", retries=2, retry_delay_seconds=60)
def run_loader():
    logger.info(f"Loading raw data to BigQuery at: {CRAWLER_DIR}")
    subprocess.run(["node", "loader.js"], cwd=CRAWLER_DIR, check=True)

# ----- Phase: Pre-AI Processing -----
@task(name="3. DBT: Install Dependencies", retries=2, retry_delay_seconds=30)
def run_dbt_deps():
    logger.info("Installing DBT dependencies...")
    subprocess.run(["dbt", "deps"], cwd=DBT_DIR, check=True)

@task(name="4. DBT: Staging FB Posts")
def run_dbt_stg_fb_posts():
    logger.info("Running DBT: Staging FB Posts")
    subprocess.run(["dbt", "run", "--select", "stg_fb_posts"], cwd=DBT_DIR, check=True)

@task(name="5. DBT: Marts AI Feed")
def run_dbt_mrt_ai_feed():
    logger.info("Running DBT: Marts AI Feed")
    subprocess.run(["dbt", "run", "--select", "mrt_posts_for_ai_feed"], cwd=DBT_DIR, check=True)

# ----- Phase: Targeted Comments Crawling & Processing -----
@task(name="5.1. Crawl Targeted Comments", retries=2, retry_delay_seconds=60)
def run_crawler_comments():
    logger.info(f"Running Targeted Comments Crawler at: {CRAWLER_DIR}")
    try:
        subprocess.run(["node", "crawler_comments.js"], cwd=CRAWLER_DIR, check=True)
    except Exception as e:
        logger.warning(f"⚠️ Comments crawler skipped or encountered warning: {e}")

@task(name="5.2. Load Comments to BigQuery", retries=2, retry_delay_seconds=60)
def run_loader_comments():
    logger.info(f"Loading comments to BigQuery at: {CRAWLER_DIR}")
    try:
        subprocess.run(["node", "loader_comments.js"], cwd=CRAWLER_DIR, check=True)
    except Exception as e:
        logger.warning(f"⚠️ Comments loader skipped or encountered warning: {e}")

@task(name="5.3. DBT: Staging Comments")
def run_dbt_stg_comments():
    logger.info("Running DBT: Staging Comments")
    try:
        subprocess.run(["dbt", "run", "--select", "stg_fb_comments"], cwd=DBT_DIR, check=True)
    except Exception as e:
        logger.warning(f"⚠️ DBT Staging Comments warning: {e}")

# ----- Phase: AI processing-----
@task(name="6. AI Sentiment Analysis", retries=3, retry_delay_seconds=120)
def run_ai_processor():
    logger.info("Running AI Sentiment Analysis...")
    subprocess.run(["python", "ai_processing/ai_processor.py"], cwd=ROOT_DIR, check=True)

@task(name="6.1. AI Comments Analysis & Synthesis", retries=2, retry_delay_seconds=120)
def run_ai_processor_comments():
    logger.info("Running AI Comments Analysis & Synthesis...")
    try:
        subprocess.run(["python", "ai_processing/ai_processor_comments.py"], cwd=ROOT_DIR, check=True)
    except Exception as e:
        logger.warning(f"⚠️ AI Comments processor skipped or encountered warning: {e}")

# ----- Phase: Post-AI Processing -----
@task(name="7. DBT: Staging AI Analysis")
def run_dbt_stg_ai_analysis():
    logger.info("Running DBT: Staging AI Analysis")
    subprocess.run(["dbt", "run", "--select", "stg_ai_post_analysis"], cwd=DBT_DIR, check=True)

@task(name="7.1. DBT: Comments Marts")
def run_dbt_mrt_comments():
    logger.info("Running DBT: Comments Marts")
    try:
        subprocess.run(["dbt", "run", "--select", "stg_ai_comment_analysis mrt_post_comments_detail"], cwd=DBT_DIR, check=True)
    except Exception as e:
        logger.warning(f"⚠️ DBT Comments Marts warning: {e}")

@task(name="8. DBT: Final Dashboard")
def run_dbt_mrt_dashboard():
    logger.info("Running DBT: Final Dashboard")
    subprocess.run(["dbt", "run", "--select", "mrt_trending_issues_dashboard"], cwd=DBT_DIR, check=True)

@task(name="9. Reverse ETL to Postgres", retries=2, retry_delay_seconds=60)
def run_reverse_etl():
     logger.info("Running Reverse ETL to sync data back to PostgreSQL...")
     subprocess.run(["python", "services/reverse_etl.py"], cwd=ROOT_DIR, check=True)




# ==========================================
# 2. Define the main flow that orchestrates all tasks in the correct order
# ==========================================

@flow(name="Uni Feedback Pipeline 🎓", log_prints=True)
def uni_feedback_flow():
    logger.info("🚀 Start the student feedback analysis system!")
    
    urls = get_active_urls()
    
    # Phase 1: Posts Ingestion
    run_crawler(urls)
    run_loader()
    
    run_dbt_deps()

    run_dbt_stg_fb_posts()
    run_dbt_mrt_ai_feed()
    
    # Phase 2: Posts AI Sentiment
    run_ai_processor()
    run_dbt_stg_ai_analysis()
    
    # Phase 3: Targeted Comments Crawling & Processing
    run_crawler_comments()
    run_loader_comments()
    run_dbt_stg_comments()
    run_ai_processor_comments()
    run_dbt_mrt_comments()

    # Phase 4: Final Dashboard Mart & Reverse ETL
    run_dbt_mrt_dashboard()
    run_reverse_etl()
    
    logger.info("Pipeline completed successfully! All tasks have been executed.")

if __name__ == "__main__":
    uni_feedback_flow()