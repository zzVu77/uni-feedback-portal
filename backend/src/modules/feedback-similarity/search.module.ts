import { Module } from '@nestjs/common';
import { CohereClientService } from './cohere-client.service';
import { FeedbackEmbeddingService } from './feedback-embedding.service';
import { FeedbackSimilarityService } from './feedback-similarity.service';
import { SearchController } from './search.controller';

@Module({
  controllers: [SearchController],
  providers: [
    CohereClientService,
    FeedbackEmbeddingService,
    FeedbackSimilarityService,
  ],
  exports: [FeedbackSimilarityService],
})
export class SearchModule {}
