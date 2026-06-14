/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GoogleGenAI } from '@google/genai';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ReportPeriodType } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiAnalyticsService {
  private readonly logger = new Logger(AiAnalyticsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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

  private async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 2000,
  ): Promise<T> {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        return await operation();
      } catch (error: any) {
        attempt++;
        if (attempt >= maxRetries) {
          throw error;
        }
        const delay = baseDelay * Math.pow(2, attempt - 1);
        this.logger.warn(
          `AI Operation failed. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries}). Error: ${error.message}`,
        );
        await new Promise((res) => setTimeout(res, delay));
      }
    }
    throw new Error('Unreachable');
  }

  async generateWeeklyReport(startDate: Date, endDate: Date, userId?: string) {
    this.logger.log(
      `Starting WEEKLY report generation for ${startDate.toISOString()} to ${endDate.toISOString()}`,
    );

    try {
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
          category: {
            select: { id: true, name: true },
          },
        },
      });

      if (feedbacks.length === 0) {
        this.logger.log(
          'No feedbacks found for this week. Creating an empty report record.',
        );
        const emptyReport = await this.prisma.aiFeedbackSummaries.create({
          data: {
            periodType: ReportPeriodType.WEEKLY,
            startDate,
            endDate,
            overallSummary:
              'Trong khoảng thời gian này, hệ thống không ghi nhận bất kỳ phản hồi (feedback) nào từ sinh viên.',
            sentimentScore: 0,
            frequentCategories: [],
            totalFeedbacksAnalyzed: 0,
          },
        });
        return emptyReport;
      }

      const batches = this.chunkArray(feedbacks, 15);
      const partialSummaries: string[] = [];

      const genAI = this.getGenAIClient();

      for (let i = 0; i < batches.length; i++) {
        this.logger.log(`Processing batch ${i + 1}/${batches.length}...`);
        const batch = batches[i];
        let inputData = '';
        for (const fb of batch) {
          inputData += `--- BÀI VIẾT ID: ${fb.id} ---\nDanh mục: ${fb.category?.name || 'Không xác định'} (ID: ${fb.category?.id || 'Unknown'})\nTiêu đề: ${fb.subject}\nNội dung: ${fb.description}\n\n`;
        }

        const prompt = `Bạn là một chuyên gia phân tích dữ liệu và tâm lý học hành vi chuyên biệt trong lĩnh vực giáo dục đại học.
      Nhiệm vụ của bạn là đọc các góp ý (feedback) nội bộ của sinh viên gửi cho nhà trường dưới đây.
      Hãy phân tích, trích xuất các vấn đề chính, đánh giá thái độ chung và nhận diện nếu có bất kỳ dấu hiệu khủng hoảng hoặc bức xúc nghiêm trọng nào.
      
      Dữ liệu:
      ${inputData}`;

        try {
          const responseText = await this.withRetry(async () => {
            const model = genAI.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
            });
            const res = await model;
            if (!res.text) throw new Error('Empty response from AI');
            return res.text;
          });
          if (responseText) partialSummaries.push(responseText);
        } catch (err: any) {
          this.logger.error(`Error processing batch ${i + 1}: ${err.message}`);
        }

        if (i < batches.length - 1) {
          // Sleep to avoid rate limiting
          await new Promise((res) => setTimeout(res, 3000));
        }
      }

      if (partialSummaries.length === 0) {
        throw new Error(
          'Tất cả các lô dữ liệu đều thất bại khi gửi tới AI. Vui lòng kiểm tra lại cấu hình.',
        );
      }

      const categories = await this.prisma.categories.findMany({
        select: { id: true, name: true },
      });
      const categoriesList = categories
        .map((c) => `- ${c.name} (ID: ${c.id})`)
        .join('\n');

      this.logger.log(
        'Aggregating partial summaries into final WEEKLY report...',
      );
      const finalPrompt = `Bạn là một chuyên gia phân tích dữ liệu giáo dục và quản lý chất lượng đại học cấp cao. 
    Dưới đây là các bản tóm tắt thành phần từ nhiều lô dữ liệu góp ý (feedback) nội bộ của sinh viên gửi cho nhà trường trong một tuần.
    Nhiệm vụ của bạn là tổng hợp tất cả lại thành một Báo Cáo Tuần duy nhất để trình lên Ban Giám Hiệu, giúp họ nắm bắt tình hình và đưa ra quyết định nhanh chóng.
    
    DANH SÁCH CÁC DANH MỤC HỢP LỆ VÀ ID TƯƠNG ỨNG (BẮT BUỘC SỬ DỤNG ID TỪ DANH SÁCH NÀY NẾU TRÙNG TÊN DANH MỤC):
    ${categoriesList}

    Yêu cầu định dạng JSON (chỉ trả về JSON, không kèm text markdown nào khác):
    {
      "overallSummary": "Tóm tắt chung về tình hình tuần qua...",
      "sentimentScore": [Điểm từ -1.0 đến 1.0, -1.0 là cực kỳ tiêu cực, 1.0 là cực kỳ tích cực],
      "frequentCategories": [
        {
          "categoryId": "UUID của danh mục (Lấy chính xác từ ID trong dữ liệu đầu vào)",
          "categoryName": "Tên danh mục",
          "count": 15,
          "commonIssues": ["Vấn đề 1", "Vấn đề 2"]
        }
      ]
    }
    
    Dữ liệu tóm tắt thành phần:
    ${partialSummaries.join('\n\n--- BẢN TÓM TẮT THÀNH PHẦN ---\n\n')}`;

      const finalResponseText = await this.withRetry(async () => {
        const finalModel = genAI.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: finalPrompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        const res = await finalModel;
        if (!res.text) throw new Error('Empty response from AI');
        return res.text;
      });
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
          frequentCategories: reportData.frequentCategories || [],
          totalFeedbacksAnalyzed: feedbacks.length,
        },
      });
      this.logger.log('Successfully saved WEEKLY report.');
      return savedReport;
    } catch (err: any) {
      this.logger.error(`Error generating final WEEKLY report: ${err.message}`);
      if (userId) {
        this.eventEmitter.emit('ai_analytics.report_failed', {
          userId,
          periodType: ReportPeriodType.WEEKLY,
          error: err.message,
        });
      }
      return null;
    }
  }

  async generateMonthlyReport(startDate: Date, endDate: Date, userId?: string) {
    this.logger.log(
      `Starting MONTHLY report generation for ${startDate.toISOString()} to ${endDate.toISOString()}`,
    );

    try {
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
          'No weekly reports found for this month. Creating an empty monthly report record.',
        );
        const emptyReport = await this.prisma.aiFeedbackSummaries.create({
          data: {
            periodType: ReportPeriodType.MONTHLY,
            startDate,
            endDate,
            overallSummary:
              'Trong tháng này, hệ thống không ghi nhận bất kỳ phản hồi (feedback) nào từ sinh viên.',
            sentimentScore: 0,
            frequentCategories: [],
            totalFeedbacksAnalyzed: 0,
          },
        });
        return emptyReport;
      }

      const genAI = this.getGenAIClient();
      let inputData = '';
      let totalFeedbacks = 0;

      for (const report of weeklyReports) {
        totalFeedbacks += report.totalFeedbacksAnalyzed;
        inputData += `--- BÁO CÁO TUẦN (${report.startDate.toISOString()} - ${report.endDate.toISOString()}) ---\n`;
        inputData += `Tóm tắt: ${report.overallSummary}\n`;
        inputData += `Điểm cảm xúc: ${report.sentimentScore}\n`;
        inputData += `Các danh mục nổi bật: ${JSON.stringify((report as any).frequentCategories || report.frequentCategories)}\n\n`;
      }

      const categories = await this.prisma.categories.findMany({
        select: { id: true, name: true },
      });
      const categoriesList = categories
        .map((c) => `- ${c.name} (ID: ${c.id})`)
        .join('\n');

      this.logger.log(
        'Aggregating weekly reports into final MONTHLY report...',
      );
      const finalPrompt = `Bạn là một chuyên gia phân tích dữ liệu giáo dục và quản lý chất lượng đại học cấp cao. 
      Dưới đây là các báo cáo tổng kết của các tuần trong một tháng về tình hình góp ý (feedback) của sinh viên.
      Nhiệm vụ của bạn là gộp và tổng hợp tất cả lại thành một Báo Cáo Tháng duy nhất trình lên Ban Giám Hiệu.
      Gộp các vấn đề giống nhau trong cùng một danh mục lại, cộng dồn số lượng, và tính toán trung bình cảm xúc cho hợp lý.
      
      DANH SÁCH CÁC DANH MỤC HỢP LỆ VÀ ID TƯƠNG ỨNG (BẮT BUỘC SỬ DỤNG ID TỪ DANH SÁCH NÀY NẾU TRÙNG TÊN DANH MỤC):
      ${categoriesList}

      Yêu cầu định dạng JSON (chỉ trả về JSON, không kèm text markdown nào khác):
      {
        "overallSummary": "Tóm tắt chung về tình hình tháng qua...",
        "sentimentScore": [Điểm từ -1.0 đến 1.0],
        "frequentCategories": [
          {
            "categoryId": "UUID của danh mục",
            "categoryName": "Tên danh mục",
            "count": 15,
            "commonIssues": ["Vấn đề 1", "Vấn đề 2"]
          }
        ]
      }
      
      Dữ liệu các báo cáo tuần:
      ${inputData}`;

      const finalResponseText = await this.withRetry(async () => {
        const finalModel = genAI.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: finalPrompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        const res = await finalModel;
        if (!res.text) throw new Error('Empty response from AI');
        return res.text;
      });
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
          frequentCategories: reportData.frequentCategories || [],
          totalFeedbacksAnalyzed: totalFeedbacks,
        },
      });
      this.logger.log('Successfully saved MONTHLY report.');
      return savedReport;
    } catch (err: any) {
      this.logger.error(
        `Error generating final MONTHLY report: ${err.message}`,
      );
      if (userId) {
        this.eventEmitter.emit('ai_analytics.report_failed', {
          userId,
          periodType: ReportPeriodType.MONTHLY,
          error: err.message,
        });
      }
      return null;
    }
  }
}
