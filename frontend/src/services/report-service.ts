// src/services/report-service.ts
import axiosInstance from "@/config/axiosConfig";
import {
  ReportFilter,
  StatsOverviewDto,
  TopDepartmentStatsDto,
  FeedbackTrendDto,
  TopCategoryDto,
  TopInteractivePostDto,
  RadarStatsDto,
} from "@/types/report";

const reportBaseUrl = "/reports/admin";
const staffReportUrl = "/reports/staff";
export const getStatsOverview = async (
  filter: ReportFilter,
): Promise<StatsOverviewDto> => {
  const response = await axiosInstance.get<StatsOverviewDto>(
    `${reportBaseUrl}/overview`,
    {
      params: filter,
    },
  );
  return response;
};

export const getDepartmentStats = async (
  filter: ReportFilter,
): Promise<TopDepartmentStatsDto[]> => {
  const response = await axiosInstance.get<TopDepartmentStatsDto[]>(
    `${reportBaseUrl}/departments`,
    {
      params: filter,
    },
  );
  return response;
};

export const getFeedbackTrends = async (
  filter: ReportFilter,
): Promise<FeedbackTrendDto[]> => {
  const response = await axiosInstance.get<FeedbackTrendDto[]>(
    `${reportBaseUrl}/trends`,
    {
      params: filter,
    },
  );
  return response;
};

export const getTopCategories = async (
  filter: ReportFilter,
): Promise<TopCategoryDto[]> => {
  const response = await axiosInstance.get<TopCategoryDto[]>(
    `${reportBaseUrl}/categories`,
    {
      params: filter,
    },
  );
  return response;
};
export const getTopInteractivePosts = async (
  filter: ReportFilter,
): Promise<TopInteractivePostDto[]> => {
  const response = await axiosInstance.get<TopInteractivePostDto[]>(
    `${reportBaseUrl}/top-interactive-posts`,
    {
      params: filter,
    },
  );
  return response;
};
export const getStaffStatsOverview = async (
  filter: ReportFilter,
): Promise<StatsOverviewDto> => {
  const response = await axiosInstance.get<StatsOverviewDto>(
    `${staffReportUrl}/overview`,
    { params: filter },
  );
  return response;
};

export const getStaffTopCategories = async (
  filter: ReportFilter,
): Promise<TopCategoryDto[]> => {
  const response = await axiosInstance.get<TopCategoryDto[]>(
    `${staffReportUrl}/categories`,
    { params: filter },
  );
  return response;
};

export const getStaffFeedbackTrends = async (
  filter: ReportFilter,
): Promise<FeedbackTrendDto[]> => {
  const response = await axiosInstance.get<FeedbackTrendDto[]>(
    `${staffReportUrl}/trends`,
    { params: filter },
  );
  return response;
};

export const getStaffPerformance = async (
  filter: ReportFilter,
): Promise<TopDepartmentStatsDto> => {
  // Lưu ý: Backend trả về 1 Object (TopDepartmentStatsDto), không phải Array
  const response = await axiosInstance.get<TopDepartmentStatsDto>(
    `${staffReportUrl}/performance`,
    { params: filter },
  );
  return response;
};
export const getStaffRadarChart = async (
  filter: ReportFilter,
): Promise<RadarStatsDto[]> => {
  const response = await axiosInstance.get<RadarStatsDto[]>(
    `${staffReportUrl}/radar-chart`,
    {
      params: filter,
    },
  );
  return response;
};
