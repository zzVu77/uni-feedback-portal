/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllReportComments } from "@/services/report-comment-service";
import { ReportCommentFilter } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const REPORT_COMMENT_QUERY_KEYS = "report-comment";
export const useGetAllReportComments = (filters: ReportCommentFilter) => {
  return useQuery({
    queryKey: [REPORT_COMMENT_QUERY_KEYS, filters],
    queryFn: () => getAllReportComments(filters),
    retry: false,
    placeholderData: (previousData) => previousData,
  });
};
