import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { ForumModule } from '../forum/forum.module';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [UploadsModule, ForumModule],
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
})
export class FeedbacksModule {}
