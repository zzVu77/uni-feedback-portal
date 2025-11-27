// types.ts (Update CreateAnnouncementPayload)

import { BaseFilter, FileAttachmentDto } from "./common-type";

export type AnnouncementDetailType = {
  id: string;
  title: string;
  department: {
    id: string;
    name: string;
  };
  createdAt: string;
  content: string;
  // Optional file attachments
  files?: {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType?: string;
    fileSize?: number;
  }[];
};

export type AnnouncementListItem = Omit<AnnouncementDetailType, "files">;

export type AnnouncementManagementItem = Pick<
  AnnouncementDetailType,
  "id" | "title" | "createdAt" | "content"
>;

export interface AnnouncementFilter extends BaseFilter {
  departmentId?: string;
}

export type CreateAnnouncementPayload = Pick<
  AnnouncementDetailType,
  "title" | "content"
> & {
  // Update: Add files field matching backend DTO expectation for creation/update
  files?: FileAttachmentDto[];
};
