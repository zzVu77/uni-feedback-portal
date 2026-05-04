import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { ForumModule } from '../forum/forum.module';
import { UploadsModule } from '../uploads/uploads.module';
import { AiModule } from '../ai/ai.module';
import { BullModule } from '@nestjs/bullmq';
import { FeedbackToxicProcessor } from './feedbacks.processor';
import { FeedbackSimilarityProcessor } from './feedback-similarity.processor';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [
    UploadsModule,
    ForumModule,
    AiModule,
    SearchModule,
    BullModule.registerQueue({
      name: 'feedback-toxic',
    }),
    BullModule.registerQueue({
      name: 'feedback-similarity',
    }),
  ],
  controllers: [FeedbacksController],
  providers: [
    FeedbacksService,
    FeedbackToxicProcessor,
    FeedbackSimilarityProcessor,
  ],
})
export class FeedbacksModule {}
