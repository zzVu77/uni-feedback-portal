type ReportStatus = "PENDING" | "RESOLVED" | "REJECTED";

interface UserInfo {
  id: string;
  fullName: string;
}

export type ReportedComment = {
  id: string;
  reason: string;
  status: ReportStatus;
  adminResponse: string | null;
  createdAt: string;
  reportedBy: UserInfo;
  comment: {
    id: string;
    content: string;
    createdAt: string;
    deletedAt: string | null;
    user: UserInfo;
  };
  post: {
    id: string;
    subject: string;
    description: string;
  };
};
