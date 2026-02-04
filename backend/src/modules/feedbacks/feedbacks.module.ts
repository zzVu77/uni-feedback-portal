import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { ForumModule } from '../forum/forum.module';
import { UploadsModule } from '../uploads/uploads.module';
import { AiModule } from '../ai/ai.module';
import { BullModule } from '@nestjs/bullmq';
import { FeedbackToxicProcessor } from './feedbacks.processor';

@Module({
  imports: [UploadsModule, ForumModule, AiModule,
    BullModule.registerQueue({
      name: 'feedback-toxic',
    })
  ],
  controllers: [FeedbacksController],
  providers: [FeedbacksService, FeedbackToxicProcessor],
})
export class FeedbacksModule {}
