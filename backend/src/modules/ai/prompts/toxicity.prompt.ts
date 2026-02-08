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

        "ghét bọn",
        "đồ mọi", "đồ rẻ rách",
        "loại này nên biến đi",
        "không đáng tồn tại",


        "tao giết", "đập chết", "xử mày",
        "đánh cho", "cho mày biến",
        "coi chừng tao",
        "liệu hồn",

        "ám ảnh", 
        "spam tin nhắn", "khủng bố tinh thần",
        "bóc phốt", "bêu xấu",


        "vcl", "vkl", "đm",
        "clgt",
        "vl", "đcm",


        "mua ngay", "giá sốc", "sale", "giảm giá",
        "khuyến mãi", "ưu đãi", "flash sale",
        "xả hàng", "thanh lý", "rẻ nhất",
        "bán gấp", "order ngay", "chốt đơn",


        "kiếm tiền online", "việc nhẹ lương cao",
        "thu nhập thụ động", "làm tại nhà",
        "không cần vốn", "cam kết lợi nhuận",
        "hoàn tiền 100%",


  
        "đầu tư sinh lời", "lãi ngày","nhân tiền",
        "chơi là thắng", "cam kết không lỗ",


        "https://shopee.vn/", "https://tiki.vn/",
        "https://lazada.vn/", "https://fahasa.com/",
        "https://thegioididong.com/", "https://cellphones.com.vn/",


        "spam", "quảng cáo",
        "up bài", "đẩy bài",


        "stupid", "idiot", "dumb", "moron", "loser",
        "trash", "scumbag", "worthless", "pathetic",
        "piece of shit", "piece of crap",
        "brain dead", "low iq",


        "no one needs you",
        "you are nothing",
        "you are useless",
        "waste of space",
        "you don't matter",

        
        "i hate these people",
        "those people are",
        "you people are",
        "disgusting group",


        "i will kill you",
        "i'll beat you",
        "i'll destroy you",
        "watch your back",
        "you better be careful",
        "i'm coming for you",


        "i will track you",
        "i'm watching you",
        "spam messages",
        "mental harassment",
        "public shaming",
        "leak your information",
        "post your private info",


         "fuck", "fucking",
         "shit", "bullshit",
         "asshole", "bitch",
         "motherfucker",
         "wtf", "omfg",


         "buy now",
         "limited offer",
         "best price",
         "huge discount",
         "flash sale",
         "order now",
         "click here",
         "contact us",
         "inbox me",


         "make money online",
         "easy money",
         "work from home",
         "passive income",
         "no investment needed",
         "guaranteed profit",
         "100% refund",
         "risk free",
         "double your money",

         
         "advertisement",
         "promoted post",
         "boost post",
];