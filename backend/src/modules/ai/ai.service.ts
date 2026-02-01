import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from "@google/genai";
import { toxicityPrompt,toxicKeywords } from './prompts/toxicity.prompt';
@Injectable()
export class AiService {
  async checkToxicity(description: string): Promise<boolean> {
    if(description){
      // check keywords for toxicity
      const toxicKeywordsList = toxicKeywords;
      const contentLower = description.toLowerCase();
      for (const keyword of toxicKeywordsList) {
        if (contentLower.includes(keyword)) {
          return true;
        }
      }
      const API_KEY = process.env.API_GEMINI_KEY || '';
      if(!API_KEY) return false;
      const genAI = new GoogleGenAI({apiKey: API_KEY});
      const prompt = toxicityPrompt(description);
      const model = genAI.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt
      });
      try{
          const responseText = (await model).text;
          const parsed = JSON.parse(responseText||'{"toxic": false}') as {toxic: boolean};
          const isToxicAI = parsed.toxic;
          if (isToxicAI) {
            return true;
          }
      } catch{
          return false;
      }
    }
    return false;
  }
}
