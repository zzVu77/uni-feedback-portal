export type SentimentLabel =
  | "Tiêu cực"
  | "Trung lập"
  | "Tích cực"
  | "Stress lo âu"
  | "Chưa có dữ liệu";

export enum FeedbackTopic {
  ACADEMIC_REGISTRATION = "Học vụ & Đăng ký môn",
  STUDENT_LIFE = "Đời sống sinh viên",
  TUITION_ADMIN = "Học phí & Hành chính",
  FACILITY_PARKING = "Cơ sở vật chất & Bãi xe",
  FACULTY_TRAINING = "Giảng viên & Đào tạo",
  OTHER = "Khác",
}

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
  stressAnxiety: number;
}

export interface TopicDistributionItem {
  topic: string;
  count: number;
}

export interface ClassificationSentimentData {
  sentimentLabel: SentimentLabel;
  count: number;
}

export interface PostCountByDateItem {
  dateStr: string;
  displayDate: string;
  totalPosts: number;
}
