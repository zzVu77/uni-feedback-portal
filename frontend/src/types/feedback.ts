import { BaseFilter } from "./common-type";

export type FeedbackStatus =
  | ""
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
  statusHistory: {
    status: FeedbackStatus;
    message: string;
    note: string | null;
    createdAt: string;
  }[];
  // Optional forwarding logs
  forwardingLogs?: {
    id: string;
    fromDepartment: { id: string; name: string };
    toDepartment: { id: string; name: string };
    message: string | null;
    createdAt: string;
  }[];
  // Optional file attachments
  fileAttachments?: {
    id: string;
    fileName: string;
    fileUrl: string;
  }[];
  // For staff feedback view and can be null for private feedbacks
  student?: {
    id: string;
    fullName: string;
    email: string;
  };
};
export type MyFeedbackHistoryItem = Pick<
  FeedbackDetail,
  "id" | "subject" | "currentStatus" | "createdAt" | "category" | "department"
>;
export type StaffFeedbackItem = Pick<
  FeedbackDetail,
  "id" | "subject" | "currentStatus" | "createdAt" | "category" | "student"
>;
export interface FeedbackFilter extends BaseFilter {
  status?: FeedbackStatus;
  categoryId?: string;
  departmentId?: string;
  from?: string;
  to?: string;
}
export type CreateFeedbackPayload = {
  isPrivate: boolean;
  subject: string;
  location?: string | null;
  departmentId: string;
  categoryId: string;
  description: string;
  // attachments: string[];
};
export type UpdateFeedbackStatusParams = {
  id: string;
  status: FeedbackStatus;
  note?: string;
};
export type ForwardFeedbackParams = {
  id: string;
  toDepartmentId: string;
  note?: string;
};
export type FeedbackHeaderType = Pick<
  FeedbackDetail,
  | "id"
  | "subject"
  | "description"
  | "location"
  | "currentStatus"
  | "isPrivate"
  | "createdAt"
  | "category"
  | "department"
  | "student"
>;
