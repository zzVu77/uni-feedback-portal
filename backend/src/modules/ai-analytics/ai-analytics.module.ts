import { Module } from '@nestjs/common';
import { AiAnalyticsController } from './ai-analytics.controller';
import { AiAnalyticsService } from './ai-analytics.service';
import { AiAnalyticsCronService } from './ai-analytics.cron.service';
import { PrismaModule } from '../prisma/prisma.module';

import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [AiAnalyticsController],
  providers: [AiAnalyticsService, AiAnalyticsCronService],
})
export class AiAnalyticsModule {}
