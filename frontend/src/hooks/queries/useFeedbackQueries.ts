/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createNewFeedback,
  deleteFeedbackById,
  getAllFeedbacks,
  getAllStaffFeedbacks,
  getMyFeedbackById,
  getStaffFeedbackById,
  updateFeedbackById,
} from "@/services/feedback-service";
import { FeedbackFilter, FeedbackBodyParams } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const FEEDBACK_QUERY_KEYS = {
  student: {
    MY_FEEDBACKS: "my-feedbacks",
    MY_FEEDBACK_DETAIL: "my-feedback-detail",
  },
  staff: {
    STAFF_FEEDBACKS: "staff-feedbacks",
    STAFF_FEEDBACK_DETAIL: "staff-feedback-detail",
  },
};
type FeedbackUpdateParams = {
  id: string;
  data: FeedbackBodyParams;
};
// Hooks for student feedback queries
export const useGetFeedbacks = (filters: FeedbackFilter) => {
  return useQuery({
    queryKey: [FEEDBACK_QUERY_KEYS.student.MY_FEEDBACKS, filters],
    queryFn: () => getAllFeedbacks(filters),
    retry: false,
    placeholderData: (previousData) => previousData,
  });
};
export const useGetMyFeedbackById = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [FEEDBACK_QUERY_KEYS.student.MY_FEEDBACK_DETAIL, id],
    queryFn: () => getMyFeedbackById(id),
    retry: false,
    placeholderData: (previousData) => previousData,
    ...options,
  });
};
export const useCreateFeedback = () => {
  return useMutation({
    mutationFn: (data: FeedbackBodyParams) => createNewFeedback(data),
    retry: false,
    onSuccess: () => {
      toast.success("Gửi góp ý thành công!");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    },
  });
};
export const useUpdateFeedbackById = () => {
  return useMutation({
    mutationFn: (params: FeedbackUpdateParams) =>
      updateFeedbackById(params.id, params.data),
    retry: false,
    onSuccess: () => {
      toast.success("Cập nhật góp ý thành công!");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    },
  });
};
export const useDeleteFeedbackById = () => {
  return useMutation({
    mutationFn: (id: string) => deleteFeedbackById(id),
    retry: false,
    onSuccess: () => {
      toast.success("Xoá góp ý thành công!");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    },
  });
};
// Hooks for staff feedback queries
export const useGetStaffFeedbacks = (filters: FeedbackFilter) => {
  return useQuery({
    queryKey: [FEEDBACK_QUERY_KEYS.staff.STAFF_FEEDBACKS, filters],
    queryFn: () => getAllStaffFeedbacks(filters),
    retry: false,
    placeholderData: (previousData) => previousData,
  });
};
export const useGetStaffFeedbackById = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [FEEDBACK_QUERY_KEYS.staff.STAFF_FEEDBACK_DETAIL, id],
    queryFn: () => getStaffFeedbackById(id),
    retry: false,
    placeholderData: (previousData) => previousData,
    ...options,
  });
};
