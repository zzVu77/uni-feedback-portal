import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { ForumModule } from '../forum/forum.module';

@Module({
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
  imports: [ForumModule],
})
export class FeedbacksModule {}
