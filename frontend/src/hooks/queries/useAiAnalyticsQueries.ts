/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  triggerAiReport,
  getAiReports,
  getAiReportDetail,
} from "@/services/ai-analytics-service";
import { GetReportsParams, TriggerReportPayload } from "@/types/ai-analytics";
import { toast } from "sonner";

export const AI_ANALYTICS_KEYS = {
  all: ["ai-analytics"] as const,
  lists: () => [...AI_ANALYTICS_KEYS.all, "reports"] as const,
  list: (params?: GetReportsParams) =>
    [...AI_ANALYTICS_KEYS.lists(), params] as const,
  details: () => [...AI_ANALYTICS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...AI_ANALYTICS_KEYS.details(), id] as const,
};

export const useGetAiReports = (params?: GetReportsParams) => {
  return useQuery({
    queryKey: AI_ANALYTICS_KEYS.list(params),
    queryFn: () => getAiReports(params),
  });
};

export const useGetAiReportDetail = (id: string) => {
  return useQuery({
    queryKey: AI_ANALYTICS_KEYS.detail(id),
    queryFn: () => getAiReportDetail(id),
    enabled: !!id,
  });
};

export const useTriggerAiReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TriggerReportPayload) => triggerAiReport(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Đã yêu cầu tạo báo cáo thành công.");
      // Invalidate to refresh the list if needed,
      // though the generation is async so it might not appear immediately
      queryClient.invalidateQueries({
        queryKey: AI_ANALYTICS_KEYS.lists(),
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Có lỗi xảy ra khi yêu cầu tạo báo cáo.",
      );
    },
  });
};
