import { FeedbackStatus } from '@prisma/client';

export const HIDDEN_FORUM_FEEDBACK_STATUSES: FeedbackStatus[] = [
  FeedbackStatus.VIOLATED_CONTENT,
  FeedbackStatus.AI_REVIEW_FAILED,
];
export function isHiddenForumFeedbackStatus(status: FeedbackStatus): boolean {
  return HIDDEN_FORUM_FEEDBACK_STATUSES.includes(status);
}
