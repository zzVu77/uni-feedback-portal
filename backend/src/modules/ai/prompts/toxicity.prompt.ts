export const toxicityPrompt = (description: string) => `

      Bạn là AI content moderation.
      Hãy phân tích nội dung tiếng Việt bên dưới và trả về JSON hợp lệ.
      Tiêu chí toxic/harmful:
      - Insult
      - Harassment
      - Threat
      - Hate speech
      - Profanity
      - Spam or advertising, including:
            + Product/service promotion
            + Selling, seeding, affiliate or MLM content
            + Call-to-action phrases (buy now, inbox, contact, click link, register…)
            + “Make money online”, “easy job high salary”, investment scams
            + Links, phone numbers, or contact platforms (Zalo, Facebook, Telegram, etc.)
      Yêu cầu OUTPUT (CỰC KỲ QUAN TRỌNG):
      - Chỉ trả về MỘT object JSON hợp lệ
      - KHÔNG markdown
      - KHÔNG giải thích
      - KHÔNG text thừa trước hoặc sau

      Format bắt buộc:
      {"toxic": boolean}
      Lưu ý đặc biệt:
      - Hiểu tiếng lóng, viết tắt, teen code (vd: đm, vcl, vl, óc chó)
      - Hiểu nói mỉa mai, châm biếm
      - Không đánh dấu toxic nếu chỉ trích mang tính xây dựng
      Nội dung:
      """
      ${description}
      """
      
`
export const toxicKeywords =  [
        "ngu", "óc chó", "óc heo", "đần", "dốt",
        "vô học", "mất dạy", "khốn nạn", "rác rưởi",
        "đồ điên", "đồ hãm", "ngu như bò",
        "não phẳng", "đầu đất",

        "không ra gì", "vô dụng", "phế vật",
        "đồ thất bại", "sống làm gì",
        "chẳng ai cần mày",
        "đồ ăn hại", "cặn bã xã hội",

        "ghét bọn", "lũ", "tụi",
        "đồ mọi", "đồ rẻ rách",
        "loại này nên biến đi",
        "không đáng tồn tại",


        "tao giết", "đập chết", "xử mày",
        "đánh cho", "cho mày biến",
        "coi chừng tao",
        "liệu hồn",

        "ám ảnh", "theo dõi",
        "spam tin nhắn", "khủng bố tinh thần",
        "bóc phốt", "bêu xấu",
        "đăng thông tin riêng",


        "vcl", "vkl", "đm", "dm",
        "clgt", "cc",
        "vl", "đcm",


        "mua ngay", "giá sốc", "sale", "giảm giá",
        "khuyến mãi", "ưu đãi", "flash sale",
        "xả hàng", "thanh lý", "rẻ nhất",
        "bán gấp", "order ngay", "chốt đơn",


        "inbox", "ib", "liên hệ ngay",
        "đăng ký ngay", "tham gia ngay",
        "click link", "bấm link", "xem link",


        "kiếm tiền online", "việc nhẹ lương cao",
        "thu nhập thụ động", "làm tại nhà",
        "không cần vốn", "cam kết lợi nhuận",
        "hoàn tiền 100%", "bao đậu",


        "review có tâm", "đảm bảo uy tín",
        "đã dùng và thấy rất tốt",
        "khách đông mỗi ngày",
        "ai cần thì liên hệ",

  
        "đầu tư sinh lời", "lãi ngày",
        "nhân 2 tài khoản", "nhân tiền",
        "chơi là thắng", "cam kết không lỗ",


        "http://", "https://", "www.",
        ".com", ".net", ".vn",
        "zalo.me", "facebook.com", "t.me",


        "spam", "quảng cáo",
        "up bài", "đẩy bài",
];