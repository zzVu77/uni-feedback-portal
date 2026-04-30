export type SentimentLabel =
  | "Tiêu cực"
  | "Trung lập"
  | "Tích cực"
  | "Chưa có dữ liệu";

export interface FeedbackPost {
  postId: string;
  author: string;
  content: string;
  postLink: string;
  postedAt: Date;
  reactionCount: number;
  commentCount: number;
  engagementScore: number;
  topic: string;
  sentimentScore: number;
  aiSummary: string;
  sentimentLabel: SentimentLabel;
  analyzedAt: Date;
}
