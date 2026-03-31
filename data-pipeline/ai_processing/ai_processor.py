import os
import json
import time
from dotenv import load_dotenv
from google.cloud import bigquery
from google import genai

load_dotenv()

PROJECT_ID = "uni-feedback-data" 

DATASET_MARTS = "uni_feedback_data_marts" 

DATASET_RAW = "ai_raw"

bq_client = bigquery.Client(project=PROJECT_ID)
ai_client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

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
    print(f"⏳ Fetching unprocessed posts from BigQuery...")
    return list(bq_client.query(query).result())

def chunk_list(lst, n):
    """Helper function: Split a large list into smaller arrays (batches) of size n."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

def analyze_batch_with_gemini(batch_posts):
    """Send a batch (multiple posts) to Gemini and request a JSON array as output."""
    
    # 1. Group 5 posts into a single prompt 
    input_data = ""
    for post in batch_posts:
        input_data += f'--- BÀI VIẾT ID: {post.post_id} ---\nNội dung: "{post.content}"\n\n'

    # 2. Instruct Gemini to return a JSON array with the required structure
    prompt = f"""
    Bạn là một chuyên gia Lắng nghe Mạng xã hội (Social Listening) cấp cao, chuyên phân tích dữ liệu và tâm lý học hành vi của sinh viên đại học tại Việt Nam.
    Nhiệm vụ của bạn là đọc các bài đăng từ diễn đàn sinh viên, nhận diện chính xác các vấn đề nhức nhối, lời khen, hoặc các câu hỏi thường ngày để báo cáo cho Ban giám hiệu.

    ĐẶC BIỆT LƯU Ý VỀ NGỮ CẢNH VÀ CẢM XÚC:
    1. Nhận diện châm biếm (Sarcasm): Sinh viên thường dùng lời lẽ khen ngợi giả tạo để mỉa mai khi bức xúc (Ví dụ: "Trường xịn quá, cứ tới giờ đăng ký môn là sập mạng", "Giảng viên dạy có tâm ghê, hỏi không bao giờ trả lời" -> Đây là cảm xúc RẤT TIÊU CỰC).
    2. Các điểm nóng thường gặp: Thái độ giảng viên, chất lượng phòng học/máy móc thực hành, bãi giữ xe, học phí, thủ tục hành chính lề mề, hệ thống đăng ký tín chỉ/học vụ.
    3. Phân biệt câu hỏi và phàn nàn: "Cho em hỏi đóng học phí ở đâu?" là Trung lập (0.0). "Trường làm ăn kiểu gì mà đóng học phí lỗi hoài?" là Tiêu cực.

    Hãy phân tích danh sách bài viết dưới đây và trả về KẾT QUẢ ĐỊNH DẠNG JSON LÀ MỘT MẢNG (ARRAY).
    Tuyệt đối không sử dụng markdown code block (như ```json). Chỉ trả về chuỗi văn bản thuần túy bắt đầu bằng [ và kết thúc bằng ].

    Yêu cầu mỗi object trong mảng phải có cấu trúc chính xác như sau:
    - "post_id": Giữ nguyên ID của bài viết tương ứng (Bắt buộc phải có).
    - "topic": Phân loại chủ đề sát với thực tế đại học. Chỉ chọn 1 trong các nhóm sau: "Học vụ & Đăng ký môn", "Cơ sở vật chất & Bãi xe", "Giảng viên & Đào tạo", "Học phí & Hành chính", "Đời sống sinh viên", hoặc "Khác".
    - "sentiment_score": Điểm số đánh giá cảm xúc từ -1.0 đến 1.0. Sử dụng thang đo khắt khe sau:
        * -1.0 đến -0.6: Bức xúc gay gắt, châm biếm sâu cay, thất vọng lớn về trường/giảng viên.
        * -0.5 đến -0.1: Phàn nàn nhẹ, chê bai, không hài lòng, góp ý tiêu cực.
        * 0.0: Trung lập, câu hỏi nhờ tư vấn, tìm đồ rơi, thông báo bình thường.
        * 0.1 đến 0.5: Hài lòng cơ bản, khen ngợi nhẹ nhàng.
        * 0.6 đến 1.0: Rất tự hào, biết ơn, khen ngợi nhiệt tình chất lượng trường học/thầy cô.
    - "ai_summary": Tóm tắt nội dung tối đa 100 chữ. Bắt buộc phải tóm tắt thẳng vào "Nỗi đau" (Pain point) hoặc "Lợi ích" mà sinh viên đang đề cập để nhà trường xử lý ngay.

    Danh sách bài viết cần phân tích:
    {input_data}
    """
    
    try:
        response = ai_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        
        if not response.text:
            print("⚠️ Gemini returned an empty response since it contains some content that violates the policy. Skipping this batch.")
            return None
            
        # 3. Clean the response to ensure it's a valid JSON array string
        clean_json = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_json)
        # --------------------------------

    except Exception as e:
        print(f"⚠️ Error when calling Gemini for batch: {e}")
        return None

def write_back_to_bigquery(results):
    """Write the AI analysis results back to BigQuery."""
    table_id = f"{PROJECT_ID}.{DATASET_RAW}.post_analysis"
    
    print(f"🚀 Pushing {len(results)} AI analysis results to BigQuery...")
    errors = bq_client.insert_rows_json(table_id, results)
    
    if not errors:
        print("✅ Success! AI data has been pushed to BigQuery.")
    else:
        print(f"❌ There was an error inserting into BigQuery: {errors}")

def main():
    try:
        posts = fetch_unprocessed_posts()
    except Exception as e:
        print(f"❌ Error querying data. Please check the DATASET_MARTS name. Details: {e}")
        return
    
    if not posts:
        print("✅ There are no new posts to analyze.")
        return

    # Split the posts into batches of 5 to comply with Gemini's rate limits and to optimize API calls
    batch_size = 5
    batches = list(chunk_list(posts, batch_size))
    ai_results = []
    
    print(f"🤖 Splitting {len(posts)} posts into {len(batches)} batches ( {batch_size} posts each)...")
    
    for index, batch in enumerate(batches):
        print(f"[{index + 1}/{len(batches)}] Processing batch {index + 1}...")
        
        # Call API for each batch and get the analysis array
        analysis_array = analyze_batch_with_gemini(batch)
        
        # If we got a valid array back, extend our results list. Otherwise, log the failure.
        if analysis_array and isinstance(analysis_array, list):
            ai_results.extend(analysis_array)
            print(f"  -> Success! Analyzed {len(analysis_array)} posts.")
        else:
            print(f"  -> ❌ Batch {index + 1} failed or returned invalid JSON.")
            
        # To avoid hitting Gemini's rate limits, we will pause for 15 seconds after each batch except the last one
        if index < len(batches) - 1:
            print("  💤 Sleeping for 15 seconds to respect API rate limits...")
            time.sleep(15)
            
    # After processing all batches, if we have any results, write them back to BigQuery
    if ai_results:
        write_back_to_bigquery(ai_results)

if __name__ == "__main__":
    main()