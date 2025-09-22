import { Module } from '@nestjs/common';
import { FeedbackManagementService } from './feedback_management.service';
import { FeedbackManagementController } from './feedback_management.controller';

@Module({
  controllers: [FeedbackManagementController],
  providers: [FeedbackManagementService],
})
export class FeedbackManagementModule {}
