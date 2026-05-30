import os
import json
import time
import argparse
from dotenv import load_dotenv
from google.cloud import bigquery
from google import genai
from google.genai import types
import sys
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format="%(levelname)s - %(message)s")
logger=logging.getLogger(__name__)

load_dotenv()

PROJECT_ID = "uni-feedback-data" 
DATASET_MARTS = "uni_feedback_data_marts" 
DATASET_RAW = "ai_raw"

bq_client = bigquery.Client(project=PROJECT_ID)
ai_client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

# Re-analysis mode: Fetch posts within a date range, regardless of previous analysis status
def fetch_posts_for_reanalysis(start_date, end_date):
    """Fetch posts within a specific date range for RE-ANALYSIS, regardless of whether they were analyzed before."""
    query = f"""
        SELECT post_id, content 
        FROM `{PROJECT_ID}.{DATASET_MARTS}.mrt_posts_for_ai_feed`
        WHERE DATE(posted_at) BETWEEN @start_date AND @end_date
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("start_date", "DATE", start_date),
            bigquery.ScalarQueryParameter("end_date", "DATE", end_date),
        ]
    )
    logger.info(f"Fetching posts for RE-ANALYSIS from {start_date} to {end_date}...")
    return list(bq_client.query(query, job_config=job_config).result())

# Run with unprocessed posts (INCREMENTAL MODE)
def fetch_unprocessed_posts():
    """Get up to 50 posts that haven't been analyzed yet from BigQuery."""
    query = f"""
        SELECT post_id, content 
        FROM `{PROJECT_ID}.{DATASET_MARTS}.mrt_posts_for_ai_feed`
        WHERE post_id NOT IN (
            SELECT post_id FROM `{PROJECT_ID}.{DATASET_RAW}.post_analysis`
        )
        LIMIT 50 
    """
    logger.info("Fetching unprocessed posts from BigQuery...")
    return list(bq_client.query(query).result())

def chunk_list(lst, n):
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

def analyze_batch_with_gemini(batch_posts):
    input_data = ""
    for post in batch_posts:
        input_data += f'--- BÀI VIẾT ID: {post.post_id} ---\nNội dung: "{post.content}"\n\n'

    prompt = f"""
    Bạn là một chuyên gia Lắng nghe Mạng xã hội (Social Listening) cấp cao, chuyên phân tích dữ liệu và tâm lý học hành vi của sinh viên đại học tại Việt Nam.
    Nhiệm vụ của bạn là đọc các bài đăng từ diễn đàn sinh viên, nhận diện chính xác các vấn đề nhức nhối, lời khen, hoặc các câu hỏi thường ngày, đặc biệt là phát hiện sớm các khủng hoảng tâm lý để báo cáo cho Ban giám hiệu.

    ĐẶC BIỆT LƯU Ý VỀ NGỮ CẢNH VÀ PHÂN LOẠI CẢM XÚC:
    1. Nhận diện châm biếm (Sarcasm): Sinh viên thường dùng lời lẽ khen ngợi giả tạo để mỉa mai khi bức xúc (Ví dụ: "Trường xịn quá, cứ tới giờ đăng ký môn là sập mạng" -> Đây là cảm xúc RẤT TIÊU CỰC).
    2. Phân biệt câu hỏi và phàn nàn: "Cho em hỏi đóng học phí ở đâu?" là Trung lập (0.0). "Trường làm ăn kiểu gì mà đóng học phí lỗi hoài?" là Tiêu cực.
    3. NHÓM ĐẶC BIỆT (STRESS & LO ÂU - ĐIỂM -2.0): Bất kỳ bài viết nào thể hiện sự lo âu, căng thẳng, trầm cảm, áp lực học tập/gia đình, hoặc các bất ổn tâm lý, BẮT BUỘC gán `sentiment_score` là -2.0 và `topic` BẮT BUỘC là "Đời sống sinh viên". 

    QUY TẮC ĐÁNH DẤU TỪ KHÓA "NGHIÊM TRỌNG" TRONG AI_SUMMARY:
    Bạn phải chèn thêm từ khóa "(nghiêm trọng)" vào cuối nội dung của trường `ai_summary` NẾU bài viết thỏa mãn 1 trong 2 điều kiện sau:
    - Điều kiện A (Khủng hoảng truyền thông): Điểm `sentiment_score` từ -1.0 đến -0.7 VÀ bài viết có lượt tương tác cao (`engagement_score` >= 50, hoặc tổng like/comment lớn).
    - Điều kiện B (Khủng hoảng tâm lý - Điểm -2.0): Phải xét kỹ mức độ lo âu. 
    + CÓ THÊM "nghiêm trọng": Sinh viên bế tắc, nợ môn quá nhiều dẫn đến hoang mang tột độ, áp lực tài chính nặng nề, có dấu hiệu trầm cảm, buông xuôi, hối hận cực độ, có ý định nghỉ học hoặc tự tử.
    + KHÔNG THÊM "nghiêm trọng": Lo âu ngắn hạn, áp lực thông thường (Ví dụ: "Mai thi mà chưa học chữ nào stress quá", "Sợ rớt môn này ghê", "Làm tiểu luận đuối quá").

    VÍ DỤ VỀ CÁC TRƯỜNG HỢP CỤ THỂ (EDGE CASES):
    - Ví dụ 1 (Bức xúc + Tương tác cao): Content: "Nhà trường làm ăn chán thật, bãi xe khu A ngập lụt hỏng hết xe sinh viên mà không ai giải quyết, tiền thì vẫn thu đều!". Engagement_score: 150. -> sentiment_score: -0.9. ai_summary: "Sinh viên bức xúc tột độ vì bãi xe khu A ngập nước làm hỏng xe nhưng ban quản lý không giải quyết (nghiêm trọng)."
    - Ví dụ 2 (Lo âu thông thường): Content: "Trời ơi mai thi Kỹ thuật lập trình rồi mà chưa chữ nào vào đầu, stress rớt môn quá ae ơi." -> sentiment_score: -2.0. topic: "Đời sống sinh viên". ai_summary: "Sinh viên lo lắng và áp lực vì chưa ôn bài kịp cho kỳ thi sắp tới." (KHÔNG có chữ nghiêm trọng).
    - Ví dụ 3 (Lo âu bế tắc): Content: "Mình năm nhất mà nợ 15 tín chỉ rồi, học phí thì không đóng nổi, mình thấy thật sự bế tắc và hận bản thân, không thiết sống nữa." -> sentiment_score: -2.0. topic: "Đời sống sinh viên". ai_summary: "Sinh viên rơi vào trạng thái bế tắc, trầm cảm và có dấu hiệu buông xuôi do nợ môn và áp lực tài chính (nghiêm trọng)."

    Hãy phân tích danh sách bài viết dưới đây và trả về KẾT QUẢ ĐỊNH DẠNG JSON LÀ MỘT MẢNG (ARRAY).
    Tuyệt đối không sử dụng markdown code block (như ```json). Chỉ trả về chuỗi văn bản thuần túy bắt đầu bằng [ và kết thúc bằng ].

    Yêu cầu mỗi object trong mảng phải có cấu trúc chính xác như sau:
    - "post_id": Giữ nguyên ID của bài viết tương ứng (Bắt buộc phải có).
    - "topic": Chỉ chọn 1 trong các nhóm sau: "Học vụ & Đăng ký môn", "Cơ sở vật chất & Bãi xe", "Giảng viên & Đào tạo", "Học phí & Hành chính", "Đời sống sinh viên", hoặc "Khác". (Lưu ý: Nếu sentiment_score là -2.0, topic BẮT BUỘC là "Đời sống sinh viên").
    - "sentiment_score": Điểm số đánh giá cảm xúc (Float). Sử dụng thang đo khắt khe sau:
        * -2.0: Sinh viên gặp tình trạng stress, lo âu, áp lực tâm lý, trầm cảm (Từ nhẹ đến nặng).
        * -1.0 đến -0.6: Bức xúc gay gắt, châm biếm sâu cay, phẫn nộ về trường/giảng viên.
        * -0.5 đến -0.1: Phàn nàn nhẹ, chê bai, không hài lòng, góp ý tiêu cực.
        * 0.0: Trung lập, câu hỏi nhờ tư vấn, tìm đồ rơi, thông báo bình thường.
        * 0.1 đến 0.5: Hài lòng cơ bản, khen ngợi nhẹ nhàng.
        * 0.6 đến 1.0: Rất tự hào, biết ơn, khen ngợi nhiệt tình.
    - "ai_summary": Tóm tắt nội dung tối đa 100 chữ. Bắt buộc xoáy vào "Nỗi đau" (Pain point) hoặc "Lợi ích". (TUYỆT ĐỐI KHÔNG dùng dấu ngoặc kép (") bên trong câu tóm tắt). CHÚ Ý CHÈN TỪ KHÓA "(nghiêm trọng)" NẾU THỎA MÃN ĐIỀU KIỆN ĐÃ NÊU BÊN TRÊN.
    - "is_relevant": (Boolean). Trả về true nếu bài viết nói về các vấn đề liên quan đến nhà trường/học tập/tâm lý sinh viên. Trả về false nếu là spam, mua bán, rủ chơi game không liên quan.

    Danh sách bài viết cần phân tích:
    {input_data}
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
            logger.warning("Gemini returned an empty response. Skipping this batch.")
            return None
            
        clean_json = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_json, strict=False)

    except Exception as e:
        logger.error(f"Error when calling Gemini for batch: {e}")
        return None

def write_back_to_bigquery(results):
    table_id = f"{PROJECT_ID}.{DATASET_RAW}.post_analysis"
    logger.info(f"Pushing {len(results)} AI analysis results to BigQuery...")
    errors = bq_client.insert_rows_json(table_id, results)
    
    if not errors:
        logger.info("Success! AI data has been pushed to BigQuery.")
    else:
        logger.error(f"There was an error inserting into BigQuery: {errors}")

def main():
    # 1. Get arguments from command line to determine if we are doing a re-analysis or normal incremental job
    parser = argparse.ArgumentParser(description="Process social media posts with Gemini AI.")
    parser.add_argument("--start-date", type=str, help="Start date for re-analysis (Format: YYYY-MM-DD)")
    parser.add_argument("--end-date", type=str, help="End date for re-analysis (Format: YYYY-MM-DD)")
    args = parser.parse_args()

    try:
        # 2. Branch logic: If dates are provided, run re-analysis; otherwise, run incremental job
        if args.start_date and args.end_date:
            logger.info("=== STARTING RE-ANALYSIS MODE ===")
            posts = fetch_posts_for_reanalysis(args.start_date, args.end_date)
        else:
            logger.info("=== STARTING NORMAL INCREMENTAL MODE ===")
            posts = fetch_unprocessed_posts()
            
    except Exception as e:
        logger.error(f"Error querying data. Details: {e}")
        sys.exit(1)
        
    if not posts:
        logger.info("There are no posts to analyze.")
        return

    batch_size = 5
    batches = list(chunk_list(posts, batch_size))
    ai_results = []
    failed_batches = 0
    
    logger.info(f"Splitting {len(posts)} posts into {len(batches)} batches...")
    for index, batch in enumerate(batches):
        logger.info(f"[{index + 1}/{len(batches)}] Processing batch {index + 1}...")
        
        analysis_array = analyze_batch_with_gemini(batch)
        
        if analysis_array and isinstance(analysis_array, list):
            ai_results.extend(analysis_array)
            logger.info(f"  -> Success! Analyzed {len(analysis_array)} posts.")
        else:
            logger.error(f"  -> ❌ Batch {index + 1} failed or returned invalid JSON.")
            failed_batches += 1
            
        if index < len(batches) - 1:
            logger.info("Sleeping for 15 seconds to respect API rate limits...")
            time.sleep(5)
            
    if ai_results:
        write_back_to_bigquery(ai_results)

    if failed_batches > 0:
        logger.warning(f"Have {failed_batches} batches that failed. Marking as FAILED for Prefect to retry...")
        sys.exit(1)

if __name__ == "__main__":
    main()