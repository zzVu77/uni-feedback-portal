/** New feedback: embed + outgoing links only. */
export const FEEDBACK_SIMILARITY_JOB_ON_CREATED =
  'similarityOnFeedbackCreated' as const;

/** After student edit (post-invalidate): embed + outgoing + refresh incoming *→target. */
export const FEEDBACK_SIMILARITY_JOB_ON_UPDATED =
  'similarityOnFeedbackUpdated' as const;

export type FeedbackSimilarityJobCreatedPayload = {
  feedbackId: string;
};

export type FeedbackSimilarityJobUpdatedPayload = {
  feedbackId: string;
  priorIncomingSourceIds: string[];
};
