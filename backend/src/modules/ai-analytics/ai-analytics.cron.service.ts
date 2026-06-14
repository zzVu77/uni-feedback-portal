import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AiAnalyticsService } from './ai-analytics.service';

@Injectable()
export class AiAnalyticsCronService {
  private readonly logger = new Logger(AiAnalyticsCronService.name);

  constructor(private readonly aiAnalyticsService: AiAnalyticsService) {}

  // Run at 2 AM every Monday
  @Cron('0 2 * * 1')
  async handleWeeklyCron() {
    this.logger.log('Triggering WEEKLY AI Analytics Cron Job');

    const now = new Date();
    // Go back 7 days to get a date in the previous week
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Calculate start (Monday) and end (Sunday) of that week
    const dayOfWeek = lastWeek.getDay(); // 0 is Sunday, 1 is Monday
    const diffToMonday =
      lastWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

    const startDate = new Date(lastWeek.setDate(diffToMonday));
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    await this.aiAnalyticsService.generateWeeklyReport(startDate, endDate);
    this.logger.log('WEEKLY AI Analytics Cron Job finished');
  }

  // Run at 3 AM on the 1st of every month
  @Cron('0 3 1 * *')
  async handleMonthlyCron() {
    this.logger.log('Triggering MONTHLY AI Analytics Cron Job');

    const now = new Date();
    // Previous month
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const startDate = new Date(
      previousMonth.getFullYear(),
      previousMonth.getMonth(),
      1,
    );
    startDate.setHours(0, 0, 0, 0);

    // End of previous month
    const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
    endDate.setHours(23, 59, 59, 999);

    await this.aiAnalyticsService.generateMonthlyReport(startDate, endDate);
    this.logger.log('MONTHLY AI Analytics Cron Job finished');
  }
}
