/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createNewFeedback,
  getAllFeedbacks,
} from "@/services/feedback-service";
import { FeedbackFilter, FeedbackParams } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const FEEDBACK_QUERY_KEYS = {
  FEEDBACKS: "feedbacks",
};
export const useGetFeedbacks = (filters: FeedbackFilter) => {
  return useQuery({
    queryKey: [FEEDBACK_QUERY_KEYS.FEEDBACKS, filters],
    queryFn: () => getAllFeedbacks(filters),
    retry: false,
    placeholderData: (previousData) => previousData,
  });
};
export const useCreateFeedback = () => {
  return useMutation({
    mutationFn: (data: FeedbackParams) => createNewFeedback(data),
    retry: false,
  });
};
