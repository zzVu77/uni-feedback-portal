export type SentimentLabel =
  | "Tiêu cực"
  | "Trung lập"
  | "Tích cực"
  | "Chưa có dữ liệu";

export interface FeedbackPost {
  postId: string;
  author: string;
  content: string;
  postLink: string | null;
  postedAt: string; // ISO string from backend
  reactionCount: number;
  commentCount: number;
  engagementScore: number;
  topic: string;
  sentimentScore: number;
  aiSummary: string;
  sentimentLabel: SentimentLabel;
  analyzedAt: string; // ISO string from backend
}

export interface SocialListeningFilter {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  topic?: string;
  sentimentLabel?: SentimentLabel;
}

export interface SocialListeningResponse {
  results: FeedbackPost[];
  total: number;
}

export interface KPIOverviewData {
  totalPosts: number;
  totalReactions: number;
  totalComments: number;
  negativePostsCount: number;
  dominantSentiment: string;
  sentimentTrendText: string;
}

export interface SentimentTrendItem {
  dateStr: string;
  displayDate: string;
  positive: number;
  negative: number;
  neutral: number;
}

export interface TopicDistributionItem {
  topic: string;
  count: number;
}
