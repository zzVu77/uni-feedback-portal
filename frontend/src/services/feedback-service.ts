import axiosInstance from "@/config/axiosConfig";
import {
  FeedbackDetail,
  FeedbackFilter,
  FeedbackBodyParams,
  MyFeedbackHistoryItem,
  PaginatedResponse,
} from "@/types";
const studentFeedbackBaseUrl = "/feedbacks";
const staffFeedbackBaseUrl = "/managements/staff/feedbacks";
// Feedback service functions for student
export const getAllFeedbacks = async (
  filter: FeedbackFilter,
): Promise<PaginatedResponse<MyFeedbackHistoryItem>> => {
  const response = await axiosInstance.get<
    PaginatedResponse<MyFeedbackHistoryItem>
  >(studentFeedbackBaseUrl, {
    params: filter,
  });
  return response;
};
export const getMyFeedbackById = async (
  id: string,
): Promise<FeedbackDetail> => {
  const response = await axiosInstance.get<FeedbackDetail>(
    `${studentFeedbackBaseUrl}/me/${id}`,
  );
  return response;
};
export const updateFeedbackById = async (
  id: string,
  data: FeedbackBodyParams,
) => {
  await axiosInstance.patch(`${studentFeedbackBaseUrl}/me/${id}`, {
    ...data,
  });
};
export const createNewFeedback = async (data: FeedbackBodyParams) => {
  await axiosInstance.post(studentFeedbackBaseUrl, {
    ...data,
  });
};
export const deleteFeedbackById = async (id: string) => {
  await axiosInstance.delete(`${studentFeedbackBaseUrl}/me/${id}`);
};

// Feedback service functions for staff
export const getAllStaffFeedbacks = async (
  filter: FeedbackFilter,
): Promise<PaginatedResponse<FeedbackDetail>> => {
  const response = await axiosInstance.get<PaginatedResponse<FeedbackDetail>>(
    staffFeedbackBaseUrl,
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
    `${staffFeedbackBaseUrl}/${id}`,
  );
  return response;
};
export const updateStaffFeedbackStatusById = async (
  id: string,
  status: string,
  note?: string,
) => {
  await axiosInstance.patch(`${staffFeedbackBaseUrl}/${id}/status`, {
    status,
    note,
  });
};
export const forwardStaffFeedbackById = async (
  id: string,
  toDepartmentId: string,
  note?: string,
) => {
  await axiosInstance.post(`${staffFeedbackBaseUrl}/${id}/forwarding`, {
    toDepartmentId,
    note,
  });
};
