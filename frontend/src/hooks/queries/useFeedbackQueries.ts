/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createNewFeedback,
  getAllFeedbacks,
  getMyFeedbackById,
} from "@/services/feedback-service";
import { FeedbackFilter, FeedbackParams } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const FEEDBACK_QUERY_KEYS = {
  student: {
    MY_FEEDBACKS: "my-feedbacks",
    MY_FEEDBACK_DETAIL: "my-feedback-detail",
  },
};
export const useGetFeedbacks = (filters: FeedbackFilter) => {
  return useQuery({
    queryKey: [FEEDBACK_QUERY_KEYS.student.MY_FEEDBACKS, filters],
    queryFn: () => getAllFeedbacks(filters),
    retry: false,
    placeholderData: (previousData) => previousData,
  });
};
// Get feedback detail by id for the logged-in student
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
    mutationFn: (data: FeedbackParams) => createNewFeedback(data),
    retry: false,
    onSuccess: () => {
      toast.success("Gửi góp ý thành công!");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    },
  });
};
