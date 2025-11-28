import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { FeedbacksModule } from './modules/feedbacks/feedbacks.module';
import { FeedbackManagementModule } from './modules/feedback_management/feedback_management.module';
import { ForumModule } from './modules/forum/forum.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import { ClarificationsModule } from './modules/clarifications/clarifications.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { ReportsModule } from './modules/reports/reports.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CommentModule } from './modules/comment/comment.module';
import { MailModule } from './modules/mail/mail.module';
import { RedisModule } from './modules/redis/redis.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
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
    CommentModule,
    MailModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
