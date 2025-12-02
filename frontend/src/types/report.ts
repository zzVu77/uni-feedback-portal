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
  departmentId: string;
  departmentName: string;
  feedbackCount: number;
  resolvedCount: number;
  unresolvedCount: number;
  avgResolutionTimeHours: number;
};

// 3. Feedback Trends
export type FeedbackTrendDto = {
  date: string; // YYYY-MM-DD
  count: number;
};

// 4. Top Categories
export type TopCategoryDto = {
  categoryId: string;
  categoryName: string;
  count: number;
};
// 5. Top Interactive Posts
export type TopInteractivePostDto = {
  forumPostId: string;
  title: string;
  voteCount: number;
  commentCount: number;
  totalInteractions: number;
};
