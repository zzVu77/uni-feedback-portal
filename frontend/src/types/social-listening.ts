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
