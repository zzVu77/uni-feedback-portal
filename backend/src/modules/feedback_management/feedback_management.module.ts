import { Module } from '@nestjs/common';
import { FeedbackManagementService } from './feedback_management.service';
import { FeedbackManagementController } from './feedback_management.controller';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [UploadsModule],
  controllers: [FeedbackManagementController],
  providers: [FeedbackManagementService],
})
export class FeedbackManagementModule {}
