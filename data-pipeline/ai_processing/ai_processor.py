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
    """Lấy danh sách các bài post chưa được AI phân tích."""
    query = f"""
        SELECT post_id, content 
        FROM `{PROJECT_ID}.{DATASET_MARTS}.mrt_posts_for_ai_feed`
        WHERE post_id NOT IN (
            SELECT post_id FROM `{PROJECT_ID}.{DATASET_RAW}.post_analysis`
        )
        LIMIT 50 
    """
    print(f"⏳ Đang kéo tối đa 50 bài viết mới từ BigQuery...")
    return list(bq_client.query(query).result())

def chunk_list(lst, n):
    """Hàm hỗ trợ: Chia danh sách lớn thành các mảng nhỏ (batch) có kích thước n."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

def analyze_batch_with_gemini(batch_posts):
    """Gửi 1 batch (nhiều bài) cho Gemini và yêu cầu trả về MẢNG JSON."""
    
    # 1. Gom nội dung của 5 bài viết lại thành 1 chuỗi văn bản dài
    input_data = ""
    for post in batch_posts:
        input_data += f'--- BÀI VIẾT ID: {post.post_id} ---\nNội dung: "{post.content}"\n\n'

    # 2. Ép Gemini trả về dạng Mảng (Array) JSON
    prompt = f"""
    Bạn là một chuyên gia phân tích dữ liệu phản hồi của sinh viên.
    Hãy phân tích danh sách các bài viết dưới đây và trả về KẾT QUẢ ĐỊNH DẠNG JSON LÀ MỘT MẢNG (ARRAY).
    Không sử dụng markdown code block (như ```json). Chỉ trả về chuỗi JSON bắt đầu bằng [ và kết thúc bằng ].

    Yêu cầu mỗi object trong mảng phải có cấu trúc chính xác như sau:
    - "post_id": Giữ nguyên ID của bài viết tương ứng (Bắt buộc phải có).
    - "topic": Phân loại chủ đề ("Học phí", "Cơ sở vật chất", "Giảng viên", "Học thuật", "Khác"). Chỉ chọn 1.
    - "sentiment_score": Điểm số từ -1.0 (Rất tiêu cực) đến 1.0 (Rất tích cực).
    - "ai_summary": Tóm tắt nội dung tối đa 15 chữ.

    Danh sách bài viết cần phân tích:
    {input_data}
    """
    
    try:
        response = ai_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        
        # --- ĐÃ THÊM LỚP BẢO VỆ Ở ĐÂY ---
        if not response.text:
            print("⚠️ Gemini trả về kết quả rỗng (Có thể do bộ lọc từ ngữ nhạy cảm).")
            return None
            
        # Làm sạch JSON (Cắt bỏ râu ria nếu AI lỡ sinh ra)
        clean_json = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_json)
        # --------------------------------

    except Exception as e:
        print(f"⚠️ Lỗi khi gọi Gemini cho batch: {e}")
        return None

def write_back_to_bigquery(results):
    """Ghi mảng kết quả lên bảng ai_raw.post_analysis."""
    table_id = f"{PROJECT_ID}.{DATASET_RAW}.post_analysis"
    
    print(f"🚀 Đang đẩy {len(results)} dòng kết quả AI lên BigQuery...")
    errors = bq_client.insert_rows_json(table_id, results)
    
    if not errors:
        print("✅ Thành công! Dữ liệu AI đã nằm trên BigQuery.")
    else:
        print(f"❌ Có lỗi khi insert vào BigQuery: {errors}")

def main():
    try:
        posts = fetch_unprocessed_posts()
    except Exception as e:
        print(f"❌ Lỗi truy vấn dữ liệu. Hãy kiểm tra lại tên DATASET_MARTS. Chi tiết: {e}")
        return
    
    if not posts:
        print("✅ Không có bài đăng nào mới cần phân tích.")
        return

    # Chia 50 bài thành các cụm nhỏ, mỗi cụm 5 bài
    batch_size = 5
    batches = list(chunk_list(posts, batch_size))
    ai_results = []
    
    print(f"🤖 Đang chia {len(posts)} bài thành {len(batches)} đợt (mỗi đợt {batch_size} bài)...")
    
    for index, batch in enumerate(batches):
        print(f"[{index + 1}/{len(batches)}] Đang xử lý đợt {index + 1}...")
        
        # Gọi AI cho 5 bài cùng lúc
        analysis_array = analyze_batch_with_gemini(batch)
        
        # Nếu AI trả về đúng định dạng mảng, ta gộp nó vào list tổng
        if analysis_array and isinstance(analysis_array, list):
            ai_results.extend(analysis_array)
            print(f"  -> Phân tích thành công {len(analysis_array)} bài.")
        else:
            print(f"  -> ❌ Đợt {index + 1} thất bại hoặc JSON không hợp lệ.")
            
        # Cho code nghỉ ngơi để không bị Google phạt (Vượt quá 5 request/phút)
        if index < len(batches) - 1:
            print("  💤 Nghỉ 15 giây để hồi chiêu API...")
            time.sleep(15)
            
    # Sau khi chạy xong tất cả các đợt, đẩy 1 cục lên BigQuery
    if ai_results:
        write_back_to_bigquery(ai_results)

if __name__ == "__main__":
    main()