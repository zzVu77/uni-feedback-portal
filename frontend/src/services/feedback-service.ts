import axiosInstance from "@/config/axiosConfig";
import {
  FeedbackFilter,
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
