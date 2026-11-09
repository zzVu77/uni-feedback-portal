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
  isCommentsCrawled?: boolean;
  commentsAiSummary?: string | null;
  negativeCommentsRatio?: number | null;
  urgencyLevel?: string | null;
}

export interface PostCommentItem {
  id: string;
  commentId: string;
  postId: string;
  parentCommentId: string | null;
  replyToAuthor?: string | null;
  author: string;
  content: string;
  reactionCount: number;
  commentedAt: string;
  sentimentLabel: string;
  sentimentScore: number;
  isTopConcern: boolean;
  crawledAt?: string;
  replies?: PostCommentItem[];
}

export interface PostCommentsSentimentStats {
  negative: number;
  stressAnxiety: number;
  neutral: number;
  positive: number;
  negativeRatio: number;
}

export interface PostCommentsOverviewInfo {
  postLink?: string | null;
  isCommentsCrawled?: boolean;
  commentsAiSummary?: string | null;
  negativeCommentsRatio?: number | null;
  urgencyLevel?: string | null;
}

export interface PostCommentsResponse {
  postId: string;
  postInfo?: PostCommentsOverviewInfo;
  totalComments: number;
  filteredComments?: number;
  sentimentStats: PostCommentsSentimentStats;
  comments: PostCommentItem[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalRecords?: number;
  };
}

export interface GetPostCommentsParams {
  page?: number;
  limit?: number;
  sentimentLabel?: string;
  isTopConcern?: boolean;
  sortBy?: "reactions" | "date";
}

export interface SocialListeningFilter {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  topic?: string;
  sentimentLabel?: SentimentLabel;
  groupUrl?: string;
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
