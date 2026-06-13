/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenAI } from '@google/genai';
import { ReportPeriodType } from '@prisma/client';

@Injectable()
export class AiAnalyticsService {
  private readonly logger = new Logger(AiAnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private getGenAIClient(): any {
    const API_KEY = process.env.API_GEMINI_KEY || '';
    if (!API_KEY) {
      throw new Error('Google Gemini API key is not configured.');
    }
    return new GoogleGenAI({ apiKey: API_KEY });
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  async generateWeeklyReport(startDate: Date, endDate: Date) {
    this.logger.log(
      `Starting WEEKLY report generation for ${startDate.toISOString()} to ${endDate.toISOString()}`,
    );

    // Check if report already exists
    const existing = await this.prisma.aiFeedbackSummaries.findFirst({
      where: { periodType: ReportPeriodType.WEEKLY, startDate, endDate },
    });
    if (existing) {
      this.logger.log(
        'Weekly report already exists for this period. Skipping.',
      );
      return existing;
    }

    const feedbacks = await this.prisma.feedbacks.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        id: true,
        subject: true,
        description: true,
      },
    });

    if (feedbacks.length === 0) {
      this.logger.log(
        'No feedbacks found for this week. Skipping report generation.',
      );
      return null;
    }

    const batches = this.chunkArray(feedbacks, 15);
    const partialSummaries: string[] = [];

    const genAI = this.getGenAIClient();

    for (let i = 0; i < batches.length; i++) {
      this.logger.log(`Processing batch ${i + 1}/${batches.length}...`);
      const batch = batches[i];
      let inputData = '';
      for (const fb of batch) {
        inputData += `--- BÀI VIẾT ID: ${fb.id} ---\nTiêu đề: ${fb.subject}\nNội dung: ${fb.description}\n\n`;
      }

      const prompt = `Bạn là một chuyên gia phân tích dữ liệu và tâm lý học hành vi chuyên biệt trong lĩnh vực giáo dục đại học.
      Nhiệm vụ của bạn là đọc các góp ý (feedback) nội bộ của sinh viên gửi cho nhà trường dưới đây.
      Hãy phân tích, trích xuất các vấn đề chính, đánh giá thái độ chung và nhận diện nếu có bất kỳ dấu hiệu khủng hoảng hoặc bức xúc nghiêm trọng nào.
      
      Dữ liệu:
      ${inputData}`;

      try {
        const model = genAI.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        const responseText = (await model).text;
        if (responseText) partialSummaries.push(responseText);
      } catch (err) {
        this.logger.error(`Error processing batch ${i + 1}: ${err.message}`);
      }

      if (i < batches.length - 1) {
        // Sleep to avoid rate limiting
        await new Promise((res) => setTimeout(res, 3000));
      }
    }

    if (partialSummaries.length === 0) {
      this.logger.error('Failed to get any partial summaries from AI.');
      return null;
    }

    this.logger.log(
      'Aggregating partial summaries into final WEEKLY report...',
    );
    const finalPrompt = `Bạn là một chuyên gia phân tích dữ liệu giáo dục và quản lý chất lượng đại học cấp cao. 
    Dưới đây là các bản tóm tắt thành phần từ nhiều lô dữ liệu góp ý (feedback) nội bộ của sinh viên gửi cho nhà trường trong một tuần.
    Nhiệm vụ của bạn là tổng hợp tất cả lại thành một Báo Cáo Tuần duy nhất để trình lên Ban Giám Hiệu, giúp họ nắm bắt tình hình và đưa ra quyết định nhanh chóng.
    
    Yêu cầu định dạng JSON (chỉ trả về JSON, không kèm text markdown nào khác):
    {
      "overallSummary": "Tóm tắt chung về tình hình tuần qua...",
      "sentimentScore": [Điểm từ -1.0 đến 1.0, -1.0 là cực kỳ tiêu cực, 1.0 là cực kỳ tích cực],
      "topIssues": [
        {"issue": "Tên vấn đề", "count": 15, "urgency": "HIGH/MEDIUM/LOW"}
      ],
      "recommendations": ["Đề xuất 1", "Đề xuất 2"]
    }
    
    Dữ liệu tóm tắt thành phần:
    ${partialSummaries.join('\n\n--- BẢN TÓM TẮT THÀNH PHẦN ---\n\n')}`;

    try {
      const finalModel = genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: finalPrompt,
        config: {
          responseMimeType: 'application/json',
        },
      });
      const finalResponseText = (await finalModel).text;
      const cleanJson = finalResponseText
        .replace(/\`\`\`json/g, '')
        .replace(/\`\`\`/g, '')
        .trim();
      const reportData = JSON.parse(cleanJson || '{}');

      const savedReport = await this.prisma.aiFeedbackSummaries.create({
        data: {
          periodType: ReportPeriodType.WEEKLY,
          startDate,
          endDate,
          overallSummary: reportData.overallSummary || '',
          sentimentScore: reportData.sentimentScore || 0,
          topIssues: reportData.topIssues || [],
          recommendations: reportData.recommendations || [],
          totalFeedbacksAnalyzed: feedbacks.length,
        },
      });
      this.logger.log('Successfully saved WEEKLY report.');
      return savedReport;
    } catch (err) {
      this.logger.error(`Error generating final WEEKLY report: ${err.message}`);
      return null;
    }
  }

  async generateMonthlyReport(startDate: Date, endDate: Date) {
    this.logger.log(
      `Starting MONTHLY report generation for ${startDate.toISOString()} to ${endDate.toISOString()}`,
    );

    // Check if report already exists
    const existing = await this.prisma.aiFeedbackSummaries.findFirst({
      where: { periodType: ReportPeriodType.MONTHLY, startDate, endDate },
    });
    if (existing) {
      this.logger.log(
        'Monthly report already exists for this period. Skipping.',
      );
      return existing;
    }

    const weeklyReports = await this.prisma.aiFeedbackSummaries.findMany({
      where: {
        periodType: ReportPeriodType.WEEKLY,
        startDate: { gte: startDate },
        endDate: { lte: endDate },
      },
    });

    if (weeklyReports.length === 0) {
      this.logger.log(
        'No weekly reports found for this month. Skipping MONTHLY report generation.',
      );
      return null;
    }

    const genAI = this.getGenAIClient();
    let inputData = '';
    let totalFeedbacks = 0;

    for (const report of weeklyReports) {
      totalFeedbacks += report.totalFeedbacksAnalyzed;
      inputData += `--- BÁO CÁO TUẦN (${report.startDate.toISOString()} - ${report.endDate.toISOString()}) ---\n`;
      inputData += `Tóm tắt: ${report.overallSummary}\n`;
      inputData += `Điểm cảm xúc: ${report.sentimentScore}\n`;
      inputData += `Vấn đề nổi bật: ${JSON.stringify(report.topIssues)}\n\n`;
    }

    this.logger.log('Aggregating weekly reports into final MONTHLY report...');
    const finalPrompt = `Bạn là một chuyên gia phân tích dữ liệu giáo dục và quản lý chất lượng đại học cấp cao. 
    Dưới đây là các báo cáo tổng kết của các tuần trong một tháng về tình hình góp ý (feedback) của sinh viên.
    Nhiệm vụ của bạn là gộp và tổng hợp tất cả lại thành một Báo Cáo Tháng duy nhất trình lên Ban Giám Hiệu.
    Gộp các vấn đề giống nhau lại, cộng dồn số lượng, đánh giá mức độ nghiêm trọng và tính toán trung bình cảm xúc cho hợp lý.
    
    Yêu cầu định dạng JSON (chỉ trả về JSON, không kèm text markdown nào khác):
    {
      "overallSummary": "Tóm tắt chung về tình hình tháng qua...",
      "sentimentScore": [Điểm từ -1.0 đến 1.0],
      "topIssues": [
        {"issue": "Tên vấn đề", "count": 15, "urgency": "HIGH/MEDIUM/LOW"}
      ],
      "recommendations": ["Đề xuất 1", "Đề xuất 2"]
    }
    
    Dữ liệu các báo cáo tuần:
    ${inputData}`;

    try {
      const finalModel = genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: finalPrompt,
        config: {
          responseMimeType: 'application/json',
        },
      });
      const finalResponseText = (await finalModel).text;
      const cleanJson = finalResponseText
        .replace(/\`\`\`json/g, '')
        .replace(/\`\`\`/g, '')
        .trim();
      const reportData = JSON.parse(cleanJson || '{}');

      const savedReport = await this.prisma.aiFeedbackSummaries.create({
        data: {
          periodType: ReportPeriodType.MONTHLY,
          startDate,
          endDate,
          overallSummary: reportData.overallSummary || '',
          sentimentScore: reportData.sentimentScore || 0,
          topIssues: reportData.topIssues || [],
          recommendations: reportData.recommendations || [],
          totalFeedbacksAnalyzed: totalFeedbacks,
        },
      });
      this.logger.log('Successfully saved MONTHLY report.');
      return savedReport;
    } catch (err) {
      this.logger.error(
        `Error generating final MONTHLY report: ${err.message}`,
      );
      return null;
    }
  }
}
