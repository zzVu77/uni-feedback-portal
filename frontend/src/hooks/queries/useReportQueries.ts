// src/hooks/useReportQueries.ts
import { useQuery } from "@tanstack/react-query";
import {
  getStatsOverview,
  getDepartmentStats,
  getFeedbackTrends,
  getTopCategories,
  getTopInteractivePosts,
  getStaffFeedbackTrends,
  getStaffPerformance,
  getStaffTopCategories,
  getStaffStatsOverview,
  getStaffRadarChart,
} from "@/services/report-service";
import { ReportFilter } from "@/types/report";

export const REPORT_QUERY_KEYS = {
  overview: "report-overview",
  departments: "report-departments",
  trends: "report-trends",
  categories: "report-categories",
  interactivePosts: "report-interactive-posts",

  staffOverview: "staff-report-overview",
  staffCategories: "staff-report-categories",
  staffTrends: "staff-report-trends",
  staffPerformance: "staff-report-performance",
  staffRadar: "staff-report-radar",
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

export const useGetTopInteractivePosts = (filter: ReportFilter) => {
  return useQuery({
    queryKey: [REPORT_QUERY_KEYS.interactivePosts, filter],
    queryFn: () => getTopInteractivePosts(filter),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetStaffStatsOverview = (filter: ReportFilter) => {
  return useQuery({
    queryKey: [REPORT_QUERY_KEYS.staffOverview, filter],
    queryFn: () => getStaffStatsOverview(filter),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetStaffTopCategories = (filter: ReportFilter) => {
  return useQuery({
    queryKey: [REPORT_QUERY_KEYS.staffCategories, filter],
    queryFn: () => getStaffTopCategories(filter),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetStaffFeedbackTrends = (filter: ReportFilter) => {
  return useQuery({
    queryKey: [REPORT_QUERY_KEYS.staffTrends, filter],
    queryFn: () => getStaffFeedbackTrends(filter),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetStaffPerformance = (filter: ReportFilter) => {
  return useQuery({
    queryKey: [REPORT_QUERY_KEYS.staffPerformance, filter],
    queryFn: () => getStaffPerformance(filter),
    placeholderData: (previousData) => previousData,
  });
};
export const useGetStaffRadarChart = (filter: ReportFilter) => {
  return useQuery({
    queryKey: [REPORT_QUERY_KEYS.staffRadar, filter],
    queryFn: () => getStaffRadarChart(filter),
    placeholderData: (previousData) => previousData, // Giữ data cũ khi đổi năm để tránh layout shift
  });
};
