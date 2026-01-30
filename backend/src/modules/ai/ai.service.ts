import { Injectable } from '@nestjs/common';
import { boolean } from 'zod';
import is from 'zod/v4/locales/is.js';
import { GoogleGenAI } from "@google/genai";

@Injectable()
export class AiService {
  // create(createAiDto: CreateAiDto) {
  //   return 'This action adds a new ai';
  // }

  findAll() {
    return `This action returns all ai`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ai`;
  }

  // update(id: number, updateAiDto: UpdateAiDto) {
  //   return `This action updates a #${id} ai`;
  // }

  remove(id: number) {
    return `This action removes a #${id} ai`;
  }
  async checkToxicity(content: string) {
    // check keywords for toxicity
    const toxicKeywords = [
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
    const contentLower = content.toLowerCase();
    for (const keyword of toxicKeywords) {
      if (contentLower.includes(keyword)) {
        return { isToxic: true };
      }
    }

    const API_KEY = process.env.API_GEMINI_KEY || '';
    const genAI = new GoogleGenAI({apiKey: API_KEY});
    const prompt = `
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
    ${content}
    """
    `;
    const model = genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
   
    const responseText = (await model).text;
    const result = JSON.parse(responseText||'{"toxic": false}');
    return result;
  }

}
