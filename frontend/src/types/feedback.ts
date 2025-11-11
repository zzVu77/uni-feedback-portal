export type FeedbackStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "REJECTED";
export type FeedbackDetail = {
  id: string;
  subject: string;
  location?: string | null;
  currentStatus: FeedbackStatus;
  isPrivate: boolean;
  department: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
  createdAt: string;
  description: string;
  statusHistory: Array<{
    status: string;
    message: string;
    note: string | null;
    createdAt: string;
  }>;
  forwardingLogs: Array<{
    id: string;
    fromDepartment: { id: string; name: string };
    toDepartment: { id: string; name: string };
    message: string | null;
    createdAt: string;
  }>;
  fileAttachments: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
  }>;
};
export type MyFeedbackHistoryItem = Pick<
  FeedbackDetail,
  "id" | "subject" | "currentStatus" | "createdAt" | "category" | "department"
>;
