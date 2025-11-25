import { BaseFilter } from "./common-type";

export type ReportCommentDetail = {
  id: string;
  reason: string;
  status: "PENDING" | "RESOLVED";
  adminResponse?: string;
  createdAt: string;
  reportedBy: {
    id: string;
    fullName: string;
  };
  comment: {
    id: string;
    content: string;
    createdAt: string;
    deletedAt?: string | null;
    user: {
      id: string;
      fullName: string;
    };
  };
  target: {
    targetType: "FORUM_POST" | "ANNOUNCEMENT";
    targetInfo: {
      id: string;
      title: string;
      content: string;
    };
  };
};
export type ReportCommentStatus = "PENDING" | "RESOLVED";
export interface ReportCommentFilter extends BaseFilter {
  status?: ReportCommentStatus;
}
