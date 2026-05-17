import { FeedbackStatus } from '@prisma/client';

export type FeedbackSimilarityTarget = {
  targetFeedbackId: string;
  score: number;
};

export type FeedbackSimilaritySource = {
  sourceFeedbackId: string;
  score: number;
};

export type FeedbackVectorCandidate = {
  feedbackId: string;
  subject: string | null;
  description: string | null;
  vectorSimilarity: number;
};

export type FeedbackSimilarityRerankCandidate = {
  feedbackId: string;
  subject?: string | null;
  description?: string | null;
};

export type FeedbackDepartmentCosineRow = {
  feedbackId: string;
  subject: string | null;
  description: string | null;
  currentStatus: FeedbackStatus;
  similarity: number | null;
};

export type FeedbackDepartmentRerankRow = {
  targetFeedbackId: string;
  score: number;
};
