/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getAllReportComments,
  updateReportComment,
} from "@/services/report-comment-service";
import { ReportCommentFilter, UpdateReportCommentPayload } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const REPORT_COMMENT_QUERY_KEYS = "report-comment";
export const useGetAllReportComments = (filters: ReportCommentFilter) => {
  return useQuery({
    queryKey: [REPORT_COMMENT_QUERY_KEYS, filters],
    queryFn: () => getAllReportComments(filters),
    retry: false,
    placeholderData: (previousData) => previousData,
  });
};
export const useUpdateReportComment = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateReportCommentPayload) =>
      updateReportComment(id, payload),
    retry: false,
    onSuccess: () => {
      toast.success("Thao tác thành công!");
      queryClient.invalidateQueries({
        queryKey: [REPORT_COMMENT_QUERY_KEYS],
      });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    },
  });
};
