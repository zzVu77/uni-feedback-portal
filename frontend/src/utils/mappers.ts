import { FeedbackDetail, FeedbackHeaderType } from "@/types/feedback";

export const mapFeedbackDetailToHeader = (
  feedbackDetail: FeedbackDetail,
): FeedbackHeaderType => {
  return {
    id: feedbackDetail.id,
    subject: feedbackDetail.subject,
    description: feedbackDetail.description,
    location: feedbackDetail.location,
    currentStatus: feedbackDetail.currentStatus,
    createdAt: feedbackDetail.createdAt,
    category: feedbackDetail.category,
    department: feedbackDetail.department,
  };
};
