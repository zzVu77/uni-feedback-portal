import { BaseFilter } from "./common-type";
import { FeedbackStatus } from "./feedback";

export type ForumPostDetail = {
  id: string;
  createdAt: string;
  votes: number;
  hasVoted: boolean;
  feedback: {
    id: string;
    subject: string;
    description: string;
    isPrivate: boolean;
    location?: string;
    category: {
      id: string;
      name: string;
    };
    department: {
      id: string;
      name: string;
    };
    currentStatus: FeedbackStatus;
    fileAttachments: [
      {
        id: string;
        fileName: string;
        fileUrl: string;
      },
    ];
    officeResponse?: "Oke đã giải quyết";
  };
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  commentsCount: number;
};

export type ForumPostListItem = Omit<ForumPostDetail, "fileAttachments">;
export interface ForumPostFilter extends BaseFilter {
  categoryId?: string;
  departmentId?: string;
  sortBy?: "top" | "new";
  from?: string;
  to?: string;
}
