/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getAllConversationsByFeedbackId,
  getConversationDetailById,
} from "@/services/clarification-service";
import { ConversationFilter } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const CLARIFICATION_QUERY_KEYS = "clarification";

export const useGetAllClarificationsByFeedbackId = (
  filters: ConversationFilter,
) => {
  return useQuery({
    queryKey: [CLARIFICATION_QUERY_KEYS, filters],
    queryFn: () => getAllConversationsByFeedbackId(filters),
    retry: false,
    placeholderData: (previousData) => previousData,
  });
};
export const useGetClarificationsDetailById = (id: string) => {
  return useQuery({
    queryKey: [CLARIFICATION_QUERY_KEYS, id],
    queryFn: () => getConversationDetailById(id),
    retry: false,
    placeholderData: (previousData) => previousData,
  });
};

// export const useGetFeedbacks = (filters: FeedbackFilter) => {
//   return useQuery({
//     queryKey: [FEEDBACK_QUERY_KEYS.student.MY_FEEDBACKS, filters],
//     queryFn: () => getAllFeedbacks(filters),
//     retry: false,
//     placeholderData: (previousData) => previousData,
//   });
// };
// export const useGetMyFeedbackById = (
//   id: string,
//   options?: { enabled?: boolean },
// ) => {
//   return useQuery({
//     queryKey: [FEEDBACK_QUERY_KEYS.student.MY_FEEDBACK_DETAIL, id],
//     queryFn: () => getMyFeedbackById(id),
//     retry: false,
//     placeholderData: (previousData) => previousData,
//     ...options,
//   });
// };
// export const useCreateFeedback = () => {
//   return useMutation({
//     mutationFn: (data: FeedbackBodyParams) => createNewFeedback(data),
//     retry: false,
//     onSuccess: () => {
//       toast.success("Gửi góp ý thành công!");
//     },
//     onError: () => {
//       toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
//     },
//   });
// };
// export const useUpdateFeedbackById = () => {
//   return useMutation({
//     mutationFn: (params: FeedbackUpdateParams) =>
//       updateFeedbackById(params.id, params.data),
//     retry: false,
//     onSuccess: () => {
//       toast.success("Cập nhật góp ý thành công!");
//     },
//     onError: () => {
//       toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
//     },
//   });
// };
// export const useDeleteFeedbackById = () => {
//   return useMutation({
//     mutationFn: (id: string) => deleteFeedbackById(id),
//     retry: false,
//     onSuccess: () => {
//       toast.success("Xoá góp ý thành công!");
//     },
//     onError: () => {
//       toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
//     },
//   });
// };
