/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  closeConversationById,
  createNewConversation,
  getAllConversationsByFeedbackId,
  getConversationDetailById,
} from "@/services/clarification-service";
import { ConversationBodyParams, ConversationFilter } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

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
export const useCreateNewConversation = () => {
  return useMutation({
    mutationFn: (data: ConversationBodyParams) => createNewConversation(data),
    retry: false,
    onSuccess: () => {
      toast.success("Thao tác thành công!");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    },
  });
};
export const useCloseConversationById = () => {
  return useMutation({
    mutationFn: (id: string) => closeConversationById(id),
    retry: false,
    onSuccess: () => {
      toast.success("Thao tác thành công!");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    },
  });
};
