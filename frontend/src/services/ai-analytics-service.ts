import axiosInstance from "@/config/axiosConfig";
import {
  AiFeedbackSummary,
  GetReportsParams,
  TriggerReportPayload,
  TriggerReportResponse,
} from "@/types/ai-analytics";

const aiAnalyticsBaseUrl = "/ai-analytics";

export const triggerAiReport = async (
  payload: TriggerReportPayload,
): Promise<TriggerReportResponse> => {
  const response = await axiosInstance.post<TriggerReportResponse>(
    `${aiAnalyticsBaseUrl}/trigger`,
    payload,
  );
  return response; // Axios interceptor usually returns response.data
};

export const getAiReports = async (
  params?: GetReportsParams,
): Promise<AiFeedbackSummary[]> => {
  const response = await axiosInstance.get<AiFeedbackSummary[]>(
    `${aiAnalyticsBaseUrl}/reports`,
    { params },
  );
  return response;
};

export const getAiReportDetail = async (
  id: string,
): Promise<AiFeedbackSummary> => {
  const response = await axiosInstance.get<AiFeedbackSummary>(
    `${aiAnalyticsBaseUrl}/reports/${id}`,
  );
  return response;
};
