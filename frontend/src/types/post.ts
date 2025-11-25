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
  };
  user: {
    id: string;
    fullName: string;
    email: string;
  };
};

export type ForumPostListItem = Omit<ForumPostDetail, "fileAttachments">;
