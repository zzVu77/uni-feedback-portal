import { Controller, Get, Body, Param } from '@nestjs/common';
import { FeedbackSimilarityService } from './feedback-similarity.service';
// import { Public } from '../auth/decorators/public.decorator';

@Controller('feedback-similarity-search')
export class FeedbackSimilarityController {
  constructor(private readonly feedbackSimilarity: FeedbackSimilarityService) {}

  /** Read-only: embed from DB text + vector + rerank (does not persist links). */
  @Get(':id/similarity')
  async findSimilarity(@Param('id') feedbackId: string) {
    return this.feedbackSimilarity.findSimilarity(feedbackId);
  }

  /** Debug endpoint: cosine similarity with all feedbacks in same department. */
  @Get(':id/cosine-all')
  async findDepartmentCosineSimilarity(@Param('id') feedbackId: string) {
    return this.feedbackSimilarity.findDepartmentCosineSimilarity(feedbackId);
  }

  /** Debug endpoint: rerank pending feedbacks in same department. */
  @Get(':id/rerank-test')
  async findDepartmentRerankTest(@Param('id') feedbackId: string) {
    return this.feedbackSimilarity.findDepartmentRerankTest(feedbackId);
  }
}
