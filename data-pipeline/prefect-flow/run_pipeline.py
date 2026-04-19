# prefect-flow/run_pipeline.py
import os
import subprocess
from prefect import task, flow

# ==========================================
# CẤU HÌNH ĐƯỜNG DẪN ĐỘNG
# ==========================================
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
DBT_DIR = os.path.join(ROOT_DIR, "dbt_transformation")

# ==========================================
# 1. ĐỊNH NGHĨA 7 CÔNG ĐOẠN (TASKS) CHUẨN XÁC
# ==========================================

@task(name="1. Crawl Facebook Data", retries=2, retry_delay_seconds=60)
def run_crawler():
    print(f"📍 Đang chạy Crawler tại: {ROOT_DIR}")
    subprocess.run(["node", "crawler/crawler.js"], cwd=ROOT_DIR, check=True)

@task(name="2. Load Raw to BigQuery", retries=2, retry_delay_seconds=60)
def run_loader():
    print(f"📍 Đang đẩy data lên BQ tại: {ROOT_DIR}")
    subprocess.run(["node", "crawler/loader.js"], cwd=ROOT_DIR, check=True)

# ----- PHA TIỀN XỬ LÝ (PRE-AI) -----
@task(name="3. DBT: Staging FB Posts")
def run_dbt_stg_fb_posts():
    print("📍 Đang làm sạch bài viết gốc (stg_fb_posts)...")
    subprocess.run(["dbt", "run", "--select", "stg_fb_posts"], cwd=DBT_DIR, check=True)

@task(name="4. DBT: Marts AI Feed")
def run_dbt_mrt_ai_feed():
    print("📍 Đang chuẩn bị khay thức ăn cho AI (mrt_posts_for_ai_feed)...")
    subprocess.run(["dbt", "run", "--select", "mrt_posts_for_ai_feed"], cwd=DBT_DIR, check=True)

# ----- PHA AI XỬ LÝ -----
@task(name="5. AI Sentiment Analysis", retries=3, retry_delay_seconds=120)
def run_ai_processor():
    print(f"📍 Đang gọi Gemini AI phân tích cảm xúc...")
    subprocess.run(["python", "ai_processing/ai_processor.py"], cwd=ROOT_DIR, check=True)

# ----- PHA HẬU XỬ LÝ (POST-AI) -----
@task(name="6. DBT: Staging AI Analysis")
def run_dbt_stg_ai_analysis():
    print("📍 Đang làm sạch kết quả từ AI (stg_ai_post_analysis)...")
    subprocess.run(["dbt", "run", "--select", "stg_ai_post_analysis"], cwd=DBT_DIR, check=True)

@task(name="7. DBT: Final Dashboard")
def run_dbt_mrt_dashboard():
    print("📍 Đang ráp mảnh ghép cuối cùng cho Dashboard (mrt_trending_issues_dashboard)...")
    subprocess.run(["dbt", "run", "--select", "mrt_trending_issues_dashboard"], cwd=DBT_DIR, check=True)


# ==========================================
# 2. ĐỊNH NGHĨA LUỒNG CHẠY (FLOW)
# ==========================================

@flow(name="Uni Feedback Pipeline 🎓", log_prints=True)
def uni_feedback_flow():
    print("🚀 Khởi động hệ thống phân tích phản hồi sinh viên!")
    
    # Thứ tự chạy được sắp xếp chặt chẽ theo Dependency Graph
    run_crawler()
    run_loader()
    
    run_dbt_stg_fb_posts()
    run_dbt_mrt_ai_feed()
    
    run_ai_processor()
    
    run_dbt_stg_ai_analysis()
    run_dbt_mrt_dashboard()
    
    print("✅ Pipeline đã hoàn thành xuất sắc! Dữ liệu đã sẵn sàng.")

if __name__ == "__main__":
    uni_feedback_flow()