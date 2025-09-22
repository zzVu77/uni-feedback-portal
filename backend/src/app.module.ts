import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DepartmentsModule } from './departments/departments.module';
import { CategoriesModule } from './categories/categories.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { FeedbackManagementModule } from './feedback_management/feedback_management.module';
import { ForumModule } from './forum/forum.module';
import { ModerationModule } from './moderation/moderation.module';
import { ClarificationsModule } from './clarifications/clarifications.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UploadsModule } from './uploads/uploads.module';
import { ReportsModule } from './reports/reports.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DepartmentsModule,
    CategoriesModule,
    FeedbacksModule,
    FeedbackManagementModule,
    ForumModule,
    ModerationModule,
    ClarificationsModule,
    AnnouncementsModule,
    NotificationsModule,
    UploadsModule,
    ReportsModule,
    DashboardModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
