# ai_processing/ai_processor_comments.py
import os
import json
import time
import argparse
import sys
import logging
from datetime import datetime
from dotenv import load_dotenv
from google.cloud import bigquery
from google import genai
from google.genai import types

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

PROJECT_ID = os.environ.get("GOOGLE_CLOUD_PROJECT", "uni-feedback-data")
DATASET_RAW = "ai_raw"
DATASET_MARTS = "uni_feedback_data_marts"
DATASET_STAGING = "uni_feedback_data_staging"

def get_clients():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logger.error("❌ GEMINI_API_KEY is not configured in environment variables.")
        sys.exit(1)

    ai_client = genai.Client(api_key=api_key)
    
    key_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    bq_client = None
    if key_path and os.path.exists(key_path):
        bq_client = bigquery.Client(project=PROJECT_ID)
    else:
        try:
            bq_client = bigquery.Client(project=PROJECT_ID)
        except Exception:
            logger.warning("⚠️ BigQuery client initialized without explicit credentials.")

    return ai_client, bq_client

def chunk_list(lst, n):
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

def build_conversation_threads(comments):
    """
    Constructs a readable threaded ASCII tree of comments from flat comments
    using parent_comment_id to provide full contextual awareness for Gemini.
    """
    id_to_comment = {c["comment_id"]: c for c in comments}
    children_map = {}
    root_comments = []

    for c in comments:
        pid = c.get("parent_comment_id")
        if pid and pid in id_to_comment and pid != c["comment_id"]:
            children_map.setdefault(pid, []).append(c)
        else:
            root_comments.append(c)

    # Sort roots chronologically
    root_comments.sort(key=lambda x: str(x.get("commented_at", "")))

    output_lines = []

    def print_node(comment, level=0):
        indent = "   " * level
        arrow = "↳ " if level > 0 else "💬 "
        author = comment.get("author", "Sinh viên ẩn danh")
        reactions = comment.get("reaction_count", 0)
        content = comment.get("content", "").replace("\n", " ")
        output_lines.append(f"{indent}{arrow}[{author}] ({reactions} likes): \"{content}\"")

        children = children_map.get(comment["comment_id"], [])
        children.sort(key=lambda x: str(x.get("commented_at", "")))
        for child in children:
            print_node(child, level + 1)

    for root in root_comments:
        print_node(root, level=0)

    return "\n".join(output_lines)

def analyze_comments_batch(ai_client, batch_comments):
    """
    Analyzes sentiment of individual comments in a batch using Gemini 2.5 Flash.
    """
    input_text = ""
    for c in batch_comments:
        input_text += f"ID: {c['comment_id']}\nTác giả: {c.get('author', 'Ẩn danh')}\nNội dung: \"{c.get('content', '')}\"\n---\n"

    prompt = f"""
    Bạn là chuyên gia phân tích tâm lý học đường và lắng nghe mạng xã hội sinh viên.
    Nhiệm vụ của bạn là phân tích cảm xúc của từng bình luận sinh viên dưới đây.

    LƯU Ý QUAN TRỌNG:
    1. Nhận diện châm biếm, mỉa mai (Sarcasm): Các câu nói mỉa mai về trường lớp hoặc hệ thống phải được đánh giá là "Bức xúc" hoặc "Tiêu cực".
    2. Đánh dấu is_top_concern (True/False):
       - Gán True NẾU bình luận cung cấp bằng chứng cụ thể (ví dụ: phòng học A203, cơ sở 2, mã môn học, tên giảng viên, mã lỗi 504 Gateway, kêu gọi viết đơn kiến nghị, hoặc nêu tình huống nghiêm trọng).
       - Gán False nếu là bình luận cảm thán thông thường, đùa giỡn, hoặc chỉ tag tên bạn bè.
    3. Thang điểm sentiment_score từ -1.0 (cực kỳ bức xúc, phẫn nộ) đến 1.0 (rất tích cực, khen ngợi).

    Trả về kết quả ĐỊNH DẠNG JSON MẢNG (ARRAY OF OBJECTS).
    Cấu trúc từng phần tử:
    - "comment_id": giữ nguyên ID từ input.
    - "sentiment_label": chỉ chọn 1 trong: "Tiêu cực", "Bức xúc", "Trung lập", "Tích cực".
    - "sentiment_score": float (-1.0 đến 1.0).
    - "is_top_concern": boolean (true/false).

    Danh sách bình luận cần phân tích:
    {input_text}
    """

    try:
        response = ai_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        if not response.text:
            return []
        data = json.loads(response.text.strip(), strict=False)
        analyzed_at = datetime.utcnow().isoformat()
        
        # Build mapping of comment_id -> post_id from the batch
        comment_to_post = {
            str(c["comment_id"]): str(c.get("post_id", ""))
            for c in batch_comments
        }
        fallback_post_id = (
            str(batch_comments[0].get("post_id", ""))
            if batch_comments
            else ""
        )

        # Attach analyzed_at timestamp and required post_id
        for item in data:
            item["analyzed_at"] = analyzed_at
            cid = str(item.get("comment_id", ""))
            item["post_id"] = comment_to_post.get(cid) or fallback_post_id
            
        return data
    except Exception as e:
        logger.error(f"Error calling Gemini for comments batch: {e}")
        return []

def synthesize_post_comments(ai_client, post_id, post_content, comments):
    """
    Synthesizes crowd sentiment from the entire threaded conversation of a post.
    """
    if not comments:
        return None

    threaded_text = build_conversation_threads(comments)

    prompt = f"""
    Bạn là một chuyên gia Tham mưu Quản lý Khủng hoảng Truyền thông và Tâm lý Sinh viên cho Ban Giám hiệu trường Đại học.
    Dưới đây là một bài đăng trên diễn đàn sinh viên cùng toàn bộ CÂY HỘI THOẠI CÁC BÌNH LUẬN phân cấp (Replies lồng nhau).

    --- BÀI VIẾT GỐC (Post ID: {post_id}) ---
    Nội dung: "{post_content}"

    --- TOÀN BỘ CÂY BÌNH LUẬN & THẢO LUẬN CỦA SINH VIÊN ---
    {threaded_text}

    Dựa trên toàn bộ mạch tranh luận và các ý kiến phản hồi qua lại của sinh viên, hãy phân tích và trả về JSON DUY NHẤT một object có các trường sau:
    1. "comments_summary": Tóm tắt tối đa 120 chữ về dư luận sinh viên. Nêu rõ: Đa số sinh viên đồng tình hay phản đối? Họ đang bức xúc hoặc tranh cãi về vấn đề gì nhất? Các địa điểm/bằng chứng cụ thể nào được nhắc tới nhiều nhất?
    2. "urgency_level": Mức độ khẩn cấp cần can thiệp của Nhà trường:
       - "CRITICAL": Sinh viên kêu gọi gửi đơn tập thể, tẩy chay, có dấu hiệu khủng hoảng truyền thông lớn hoặc liên quan đến an toàn/tâm lý trầm trọng.
       - "WARNING": Nhiều sinh viên cùng xác nhận sự cố kỹ thuật/học vụ gây ảnh hưởng diện rộng, bức xúc gia tăng nhưng chưa bùng nổ tiêu cực cực đoan.
       - "NORMAL": Thảo luận, hỏi đáp thông thường, không có dấu hiệu khủng hoảng.
    3. "negative_comments_ratio": Ước tính tỷ lệ bình luận có thái độ tiêu cực/bức xúc (từ 0.0 đến 1.0, ví dụ 0.75 nghĩa là 75%).

    Chỉ trả về JSON object thuần túy.
    """

    try:
        response = ai_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        if not response.text:
            return None
        res_data = json.loads(response.text.strip(), strict=False)
        res_data["post_id"] = str(post_id)
        res_data["analyzed_at"] = datetime.utcnow().isoformat()
        return res_data
    except Exception as e:
        logger.error(f"Error synthesizing comments for post {post_id}: {e}")
        return None

def fetch_unprocessed_comments(bq_client, limit=500):
    """
    Fetches comments from BigQuery stg_fb_comments that haven't been analyzed yet.
    """
    query = f"""
        SELECT c.comment_id, c.post_id, c.parent_comment_id, c.author, c.content, c.reaction_count, c.commented_at
        FROM `{PROJECT_ID}.{DATASET_STAGING}.stg_fb_comments` c
        WHERE c.comment_id NOT IN (
            SELECT comment_id FROM `{PROJECT_ID}.{DATASET_RAW}.comment_analysis`
        )
        LIMIT {limit}
    """
    logger.info(f"Fetching up to {limit} unprocessed comments from BigQuery...")
    return [dict(row) for row in bq_client.query(query).result()]

def fetch_post_content(bq_client, post_id):
    query = f"""
        SELECT content FROM `{PROJECT_ID}.{DATASET_STAGING}.stg_fb_posts`
        WHERE post_id = '{post_id}'
        LIMIT 1
    """
    results = list(bq_client.query(query).result())
    return results[0].content if results else ""

def write_to_bigquery(bq_client, table_name, rows):
    table_id = f"{PROJECT_ID}.{DATASET_RAW}.{table_name}"
    logger.info(f"Pushing {len(rows)} rows to BigQuery table [{table_id}]...")
    errors = bq_client.insert_rows_json(table_id, rows)
    if not errors:
        logger.info(f"✅ Success! Data pushed to {table_name}.")
    else:
        logger.error(f"❌ Error inserting into {table_name}: {errors}")

def main():
    parser = argparse.ArgumentParser(description="Analyze Facebook comments with Gemini 2.5 Flash.")
    parser.add_argument("--test-file", type=str, help="Path to local comments JSON file to test without BigQuery.")
    parser.add_argument("--limit", type=int, default=500, help="Maximum number of unprocessed comments to analyze (default: 500).")
    args = parser.parse_args()

    ai_client, bq_client = get_clients()

    # --- Mode 1: Local Test Mode from Scraped JSON File ---
    if args.test_file:
        logger.info(f"🧪 Running in LOCAL TEST MODE with file: {args.test_file}")
        if not os.path.exists(args.test_file):
            logger.error(f"File not found: {args.test_file}")
            sys.exit(1)

        with open(args.test_file, "r", encoding="utf-8") as f:
            comments = json.load(f)

        logger.info(f"Loaded {len(comments)} comments from test file.")
        
        # Test 1: Batch Sentiment Analysis (First 10 comments)
        sample_batch = comments[:10]
        logger.info("1️⃣ Testing Gemini Batch Sentiment Analysis (10 comments)...")
        sentiment_results = analyze_comments_batch(ai_client, sample_batch)
        print("\n--- SAMPLE COMMENT SENTIMENT RESULTS ---")
        print(json.dumps(sentiment_results[:3], indent=2, ensure_ascii=False))

        # Test 2: Comments Synthesis
        post_id = comments[0].get("post_id", "test_post")
        logger.info(f"\n2️⃣ Testing Gemini Comments Synthesis for post {post_id}...")
        sample_post_content = "Sinh viên thắc mắc về hạn nộp học phí và hiệu lực thẻ xe buýt..."
        synthesis_result = synthesize_post_comments(ai_client, post_id, sample_post_content, comments)
        print("\n--- COMMENTS SYNTHESIS RESULT ---")
        print(json.dumps(synthesis_result, indent=2, ensure_ascii=False))

        logger.info("\n✅ Local test finished successfully!")
        return

    # --- Mode 2: BigQuery Production Pipeline Mode ---
    if not bq_client:
        logger.error("BigQuery client not available. Provide service account credentials or use --test-file.")
        sys.exit(1)

    comments = fetch_unprocessed_comments(bq_client, limit=args.limit)
    if not comments:
        logger.info("No unprocessed comments to analyze. Exiting.")
        return

    # 1. Individual Sentiment Analysis
    batches = list(chunk_list(comments, 15))
    all_sentiment_results = []
    logger.info(f"Processing {len(comments)} comments in {len(batches)} batches...")

    for i, batch in enumerate(batches):
        logger.info(f"[{i+1}/{len(batches)}] Analyzing comment batch {i+1}...")
        res = analyze_comments_batch(ai_client, batch)
        if res:
            all_sentiment_results.extend(res)
        time.sleep(3)

    if all_sentiment_results:
        write_to_bigquery(bq_client, "comment_analysis", all_sentiment_results)

    # 2. Per-Post Comments Synthesis
    posts_map = {}
    for c in comments:
        posts_map.setdefault(c["post_id"], []).append(c)

    all_synthesis_results = []
    logger.info(f"Synthesizing crowd comments for {len(posts_map)} post(s)...")

    for pid, post_cmts in posts_map.items():
        post_content = fetch_post_content(bq_client, pid)
        synth = synthesize_post_comments(ai_client, pid, post_content, post_cmts)
        if synth:
            all_synthesis_results.append(synth)
        time.sleep(3)

    if all_synthesis_results:
        write_to_bigquery(bq_client, "post_comments_summary", all_synthesis_results)

    logger.info("🎉 AI Comments Processing finished successfully!")

if __name__ == "__main__":
    main()
