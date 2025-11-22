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
  files?: {
    id: string;
    fileName: string;
    fileUrl: string;
  }[];
};
export type AnnouncementListItem = Omit<AnnouncementDetail, "files">;
export type AnnouncementManagementItem = Pick<
  AnnouncementDetail,
  "id" | "title" | "createdAt"
>;
export interface AnnouncementFilter extends BaseFilter {
  departmentId?: string;
}
