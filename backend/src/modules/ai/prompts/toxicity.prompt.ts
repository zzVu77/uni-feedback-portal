export const toxicityPrompt = (description: string) => `

      Bạn là AI content moderation.
      Hãy phân tích nội dung tiếng Việt bên dưới và trả về JSON hợp lệ.
      Tiêu chí toxic/harmful:
      - Insult
      - Harassment
      - Threat
      - Hate speech
      - Profanity
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
        "vl", "đcm"
];