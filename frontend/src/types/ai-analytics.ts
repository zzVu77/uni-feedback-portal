export enum ReportPeriodType {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}

export interface FrequentCategory {
  categoryId?: string;
  categoryName: string;
  count: number;
  commonIssues: string[];
}

export interface AiFeedbackSummary {
  id: string;
  periodType: ReportPeriodType;
  startDate: string;
  endDate: string;
  sentimentScore: number;
  totalFeedbacksAnalyzed: number;
  createdAt: string;
  overallSummary?: string;
  frequentCategories?: FrequentCategory[];
}

export interface TriggerReportPayload {
  periodType: ReportPeriodType;
  startDate: string;
  endDate: string;
}

export interface GetReportsParams {
  periodType?: ReportPeriodType;
  limit?: string;
}

export interface TriggerReportResponse {
  message: string;
  status: string;
}
