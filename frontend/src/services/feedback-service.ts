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
export const deleteFeedbackById = async (id: string) => {
  await axiosInstance.delete(`/feedbacks/me/${id}`);
};

// Feedback service functions for staff
export const getAllStaffFeedbacks = async (
  filter: FeedbackFilter,
): Promise<PaginatedResponse<FeedbackDetail>> => {
  const response = await axiosInstance.get<PaginatedResponse<FeedbackDetail>>(
    "/managements/staff/feedbacks",
    {
      params: filter,
    },
  );
  return response;
};
export const getStaffFeedbackById = async (
  id: string,
): Promise<FeedbackDetail> => {
  const response = await axiosInstance.get<FeedbackDetail>(
    `/managements/staff/feedbacks/${id}`,
  );
  return response;
};
export const updateStaffFeedbackStatusById = async (
  id: string,
  status: string,
  note?: string,
) => {
  await axiosInstance.patch(`/managements/staff/feedbacks/${id}/status`, {
    status,
    note,
  });
};
export const forwardStaffFeedbackById = async (
  id: string,
  toDepartmentId: string,
  note?: string,
) => {
  await axiosInstance.post(`/managements/staff/feedbacks/${id}/forwarding`, {
    toDepartmentId,
    note,
  });
};
