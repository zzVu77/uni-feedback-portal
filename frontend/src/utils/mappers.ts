import {
  CreateFeedbackPayload,
  FeedbackDetail,
  FeedbackHeaderType,
} from "@/types/feedback";

export const mapFeedbackDetailToHeader = (
  feedbackDetail: FeedbackDetail,
): FeedbackHeaderType => {
  return {
    id: feedbackDetail.id,
    subject: feedbackDetail.subject,
    description: feedbackDetail.description,
    location: feedbackDetail.location,
    currentStatus: feedbackDetail.currentStatus,
    isPrivate: feedbackDetail.isPrivate,
    createdAt: feedbackDetail.createdAt,
    category: feedbackDetail.category,
    department: feedbackDetail.department,
    student: feedbackDetail.student,
  };
};

export const mapFeedbackDetailToBodyParams = (
  feedbackDetail: FeedbackDetail,
): CreateFeedbackPayload => {
  return {
    isAnonymous: feedbackDetail.isPrivate,
    subject: feedbackDetail.subject,
    description: feedbackDetail.description,
    departmentId: feedbackDetail.department.id,
    categoryId: feedbackDetail.category.id,
    location: feedbackDetail.location,
    //TODO: isPublic field is just temporarily added here, need to check and remove if not necessary
    isPublic: feedbackDetail.isPublic,
    // attachments: feedbackDetail.fileAttachments?.map((file) => file.id) || [],
  };
};
