import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, UnrecoverableError } from 'bullmq';
import { FeedbackSimilarityService } from '../feedback-similarity/feedback-similarity.service';
import {
  FEEDBACK_SIMILARITY_JOB_ON_CREATED,
  FEEDBACK_SIMILARITY_JOB_ON_UPDATED,
  FeedbackSimilarityJobCreatedPayload,
  FeedbackSimilarityJobUpdatedPayload,
} from './feedback-similarity-job.constants';

@Processor('feedback-similarity')
export class FeedbackSimilarityProcessor extends WorkerHost {
  constructor(private readonly feedbackSimilarity: FeedbackSimilarityService) {
    super();
  }

  async process(
    job: Job<
      FeedbackSimilarityJobCreatedPayload | FeedbackSimilarityJobUpdatedPayload
    >,
  ): Promise<void> {
    switch (job.name) {
      case FEEDBACK_SIMILARITY_JOB_ON_CREATED: {
        const { feedbackId } = job.data as FeedbackSimilarityJobCreatedPayload;
        await this.feedbackSimilarity.handleSimilarityAfterFeedbackCreated(
          feedbackId,
        );
        return;
      }
      case FEEDBACK_SIMILARITY_JOB_ON_UPDATED: {
        const { feedbackId, priorIncomingSourceIds } =
          job.data as FeedbackSimilarityJobUpdatedPayload;
        await this.feedbackSimilarity.handleSimilarityAfterFeedbackUpdated(
          feedbackId,
          priorIncomingSourceIds,
        );
        return;
      }
      default:
        throw new UnrecoverableError(
          `Unknown feedback-similarity job name: ${job.name}`,
        );
    }
  }
}
