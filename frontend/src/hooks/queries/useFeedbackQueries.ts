/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllFeedbacks } from "@/services/feedback-service";
import { FeedbackFilter } from "@/types";
import { useQuery } from "@tanstack/react-query";

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
