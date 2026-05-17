import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { FeedbackManagementService } from './feedback_management.service';
import { FeedbackManagementController } from './feedback_management.controller';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [
    UploadsModule,
    BullModule.registerQueue({
      name: 'feedback-similarity',
    }),
  ],
  controllers: [FeedbackManagementController],
  providers: [FeedbackManagementService],
})
export class FeedbackManagementModule {}
