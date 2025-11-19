import axiosInstance from "@/config/axiosConfig";
import {
  ConversationDetail,
  ConversationFilter,
  ConversationSummary,
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

// export const getMyFeedbackById = async (
//   id: string,
// ): Promise<FeedbackDetail> => {
//   const response = await axiosInstance.get<FeedbackDetail>(
//     `${clarificationBaseUrl}/me/${id}`,
//   );
//   return response;
// };

// export const createNewFeedback = async (data: FeedbackBodyParams) => {
//   await axiosInstance.post(clarificationBaseUrl, {
//     ...data,
//   });
// };
