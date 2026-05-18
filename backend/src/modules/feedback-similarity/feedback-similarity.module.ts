import { Module } from '@nestjs/common';
import { CohereClientService } from './cohere-client.service';
import { FeedbackEmbeddingService } from './feedback-embedding.service';
import { FeedbackSimilarityService } from './feedback-similarity.service';
import { FeedbackSimilarityController } from './feedback-similarity.controller';

@Module({
  controllers: [FeedbackSimilarityController],
  providers: [
    CohereClientService,
    FeedbackEmbeddingService,
    FeedbackSimilarityService,
  ],
  exports: [FeedbackSimilarityService],
})
export class FeedbackSimilarityModule {}
