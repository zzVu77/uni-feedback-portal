# prefect-flow/run_pipeline.py
import os
import subprocess
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

@task(name="1. Crawl Facebook Data", retries=2, retry_delay_seconds=60)
def run_crawler():
    logger.info(f"Running Crawler at: {CRAWLER_DIR}")
    subprocess.run(["node", "crawler.js"], cwd=CRAWLER_DIR, check=True)

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

# ----- Phase: AI processing-----
@task(name="6. AI Sentiment Analysis", retries=3, retry_delay_seconds=120)
def run_ai_processor():
    logger.info("Running AI Sentiment Analysis...")
    subprocess.run(["python", "ai_processing/ai_processor.py"], cwd=ROOT_DIR, check=True)

# ----- Phase: Post-AI Processing -----
@task(name="7. DBT: Staging AI Analysis")
def run_dbt_stg_ai_analysis():
    logger.info("Running DBT: Staging AI Analysis")
    subprocess.run(["dbt", "run", "--select", "stg_ai_post_analysis"], cwd=DBT_DIR, check=True)

@task(name="8. DBT: Final Dashboard")
def run_dbt_mrt_dashboard():
    logger.info("Running DBT: Final Dashboard")
    subprocess.run(["dbt", "run", "--select", "mrt_trending_issues_dashboard"], cwd=DBT_DIR, check=True)


# ==========================================
# 2. Define the main flow that orchestrates all tasks in the correct order
# ==========================================

@flow(name="Uni Feedback Pipeline 🎓", log_prints=True)
def uni_feedback_flow():
    logger.info("🚀 Start the student feedback analysis system!")
    
    run_crawler()
    run_loader()
    
    run_dbt_deps()

    run_dbt_stg_fb_posts()
    run_dbt_mrt_ai_feed()
    
    run_ai_processor()
    
    run_dbt_stg_ai_analysis()
    run_dbt_mrt_dashboard()
    
    logger.info("Pipeline completed successfully! All tasks have been executed.")

if __name__ == "__main__":
    uni_feedback_flow()