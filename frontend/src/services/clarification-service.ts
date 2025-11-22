import axiosInstance from "@/config/axiosConfig";
import {
  ConversationBodyParams,
  ConversationDetail,
  ConversationFilter,
  ConversationSummary,
  MessageBodyParams,
  PaginatedResponse,
} from "@/types";
export const clarificationBaseUrl = "/clarifications";
export const getAllConversationsByFeedbackId = async (
  filter: ConversationFilter,
): Promise<PaginatedResponse<ConversationSummary>> => {
  const response = await axiosInstance.get<
    PaginatedResponse<ConversationSummary>
  >(clarificationBaseUrl, {
    params: filter,
  });
  return response;
};
export const getConversationDetailById = async (
  id: string,
): Promise<ConversationDetail> => {
  const response = await axiosInstance.get<ConversationDetail>(
    `${clarificationBaseUrl}/${id}`,
  );
  return response;
};

export const createNewConversation = async (data: ConversationBodyParams) => {
  await axiosInstance.post(clarificationBaseUrl, {
    ...data,
  });
};

export const closeConversationById = async (id: string) => {
  await axiosInstance.patch(`${clarificationBaseUrl}/${id}`, {
    isClosed: true,
    message: "Vấn đề đã được làm rõ. Đóng cuộc hội thoại này.",
  });
};

export const createMessageInConversation = async (
  conversationId: string,
  data: MessageBodyParams,
) => {
  await axiosInstance.post(
    `${clarificationBaseUrl}/${conversationId}/messages`,
    {
      ...data,
    },
  );
};
