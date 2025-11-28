// src/services/report-service.ts
import axiosInstance from "@/config/axiosConfig";
import {
  ReportFilter,
  StatsOverviewDto,
  TopDepartmentStatsDto,
  FeedbackTrendDto,
  TopCategoryDto,
  TopInteractivePostDto,
} from "@/types/report";

const reportBaseUrl = "/admin/reports";

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
