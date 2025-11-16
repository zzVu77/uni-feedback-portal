import axiosInstance from "@/config/axiosConfig";
import {
  FeedbackDetail,
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
// Get feedback detail by id for the logged-in student
export const getMyFeedbackById = async (
  id: string,
): Promise<FeedbackDetail> => {
  const response = await axiosInstance.get<FeedbackDetail>(
    `/feedbacks/me/${id}`,
  );
  return response;
};
export const createNewFeedback = async (data: FeedbackParams) => {
  await axiosInstance.post("/feedbacks", {
    ...data,
  });
};
