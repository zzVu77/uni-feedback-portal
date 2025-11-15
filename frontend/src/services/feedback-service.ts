import axiosInstance from "@/config/axiosConfig";
import {
  FeedbackFilter,
  FeedbackParams,
  MyFeedbackHistoryItem,
  PaginatedResponse,
} from "@/types";

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
export const createNewFeedback = async (data: FeedbackParams) => {
  await axiosInstance.post("/feedbacks", {
    ...data,
  });
};
