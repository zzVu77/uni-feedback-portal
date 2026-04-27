export type SentimentLabel =
  | "Tiêu cực"
  | "Trung lập"
  | "Tích cực"
  | "Chưa có dữ liệu";

export interface FeedbackPost {
  post_id: string;
  author: string;
  content: string;
  post_link: string;
  posted_at: Date;
  reaction_count: number;
  comment_count: number;
  engagement_score: number;
  topic: string;
  sentiment_score: number;
  ai_summary: string;
  sentiment_label: SentimentLabel;
  analyzed_at: Date;
}
