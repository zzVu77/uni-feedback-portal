// src/hooks/useReportQueries.ts
import { useQuery } from "@tanstack/react-query";
import {
  getStatsOverview,
  getDepartmentStats,
  getFeedbackTrends,
  getTopCategories,
} from "@/services/report-service";
import { ReportFilter } from "@/types/report";

export const REPORT_QUERY_KEYS = {
  overview: "report-overview",
  departments: "report-departments",
  trends: "report-trends",
  categories: "report-categories",
};

export const useGetStatsOverview = (filter: ReportFilter) => {
  return useQuery({
    queryKey: [REPORT_QUERY_KEYS.overview, filter],
    queryFn: () => getStatsOverview(filter),
    placeholderData: (previousData) => previousData, // Giữ data cũ khi đổi filter date để tránh flick
  });
};

export const useGetDepartmentStats = (filter: ReportFilter) => {
  return useQuery({
    queryKey: [REPORT_QUERY_KEYS.departments, filter],
    queryFn: () => getDepartmentStats(filter),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetFeedbackTrends = (filter: ReportFilter) => {
  return useQuery({
    queryKey: [REPORT_QUERY_KEYS.trends, filter],
    queryFn: () => getFeedbackTrends(filter),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetTopCategories = (filter: ReportFilter) => {
  return useQuery({
    queryKey: [REPORT_QUERY_KEYS.categories, filter],
    queryFn: () => getTopCategories(filter),
    placeholderData: (previousData) => previousData,
  });
};
