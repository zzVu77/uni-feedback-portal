import { BaseFilter } from "./common-type";

export type AnnouncementDetail = {
  id: string;
  title: string;
  department: {
    id: string;
    name: string;
  };
  createdAt: string;
  content: string;
  // Optional file attachments
  fileAttachments?: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
  }>;
};
export type AnnouncementListItem = Omit<AnnouncementDetail, "fileAttachments">;
export type AnnouncementManagementItem = Pick<
  AnnouncementDetail,
  "id" | "title" | "createdAt"
>;
export interface AnnouncementFilter extends BaseFilter {
  departmentId?: string;
}
