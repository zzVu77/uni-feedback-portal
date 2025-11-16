import axiosInstance from "@/config/axiosConfig";
import {
  FeedbackDetail,
  FeedbackFilter,
  FeedbackBodyParams,
  MyFeedbackHistoryItem,
  PaginatedResponse,
} from "@/types";
// Feedback service functions for student
export const getAllFeedbacks = async (
  filter: FeedbackFilter,
): Promise<PaginatedResponse<MyFeedbackHistoryItem>> => {
  const response = await axiosInstance.get<
    PaginatedResponse<MyFeedbackHistoryItem>
  >("/feedbacks", {
    params: filter,
  });
  return response;
};
export const getMyFeedbackById = async (
  id: string,
): Promise<FeedbackDetail> => {
  const response = await axiosInstance.get<FeedbackDetail>(
    `/feedbacks/me/${id}`,
  );
  return response;
};
export const updateFeedbackById = async (
  id: string,
  data: FeedbackBodyParams,
) => {
  await axiosInstance.patch(`/feedbacks/me/${id}`, {
    ...data,
  });
};
export const createNewFeedback = async (data: FeedbackBodyParams) => {
  await axiosInstance.post("/feedbacks", {
    ...data,
  });
};
