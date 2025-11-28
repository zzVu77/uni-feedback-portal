import axiosInstance from "@/config/axiosConfig";
import {
  PaginatedResponse,
  ReportCommentDetail,
  ReportCommentFilter,
  UpdateReportCommentPayload,
} from "@/types";

export const reportCommentBaseUrl = "/moderation/reports";
export const getAllReportComments = async (
  filter: ReportCommentFilter,
): Promise<PaginatedResponse<ReportCommentDetail>> => {
  const response = await axiosInstance.get<
    PaginatedResponse<ReportCommentDetail>
  >(reportCommentBaseUrl, {
    params: filter,
  });
  return response;
};
export const updateReportComment = async (
  reportCommentId: string,
  payload: UpdateReportCommentPayload,
) => {
  await axiosInstance.patch(`${reportCommentBaseUrl}/${reportCommentId}`, {
    ...payload,
  });
};
