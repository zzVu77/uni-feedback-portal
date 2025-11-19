import { BaseFilter } from "./common-type";

export type Message = {
  id: string;
  content: string;
  user: {
    id: string;
    fullName: string;
    role: "STUDENT" | "DEPARTMENT_STAFF";
  };
  createdAt: string;
  //   attachments?: {
  //     id: string;
  //     messageId: string;
  //     fileName: string;
  //     fileUrl: string;
  //   }[];
};
export type ConversationDetail = {
  id: string;
  subject: string;
  isClosed: boolean;
  createdAt: string;
  messages: Message[];
};
export type ConversationSummary = Omit<ConversationDetail, "messages">;
export type ConversationFilter = Omit<BaseFilter, "limit" | "q"> & {
  feedbackId?: string;
  isClosed?: boolean;
};
