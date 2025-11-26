// Filter cho báo cáo (Date Range)
export interface ReportFilter {
  from?: string;
  to?: string;
}

// 1. Overview Stats
export type StatsOverviewDto = {
  totalFeedbacks: number;
  pendingCount: number;
  inProgressCount: number;
  resolvedCount: number;
  rejectedCount: number;
};

// 2. Top Department Stats
export type TopDepartmentStatsDto = {
  departmentName: string;
  feedbackCount: number;
  avgResolutionTimeHours: number;
};

// 3. Feedback Trends
export type FeedbackTrendDto = {
  date: string; // YYYY-MM-DD
  count: number;
};

// 4. Top Categories
export type TopCategoryDto = {
  categoryName: string;
  count: number;
};
