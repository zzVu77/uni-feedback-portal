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
export type AnnouncementManagementItem = Pick<
  AnnouncementDetail,
  "id" | "title" | "createdAt"
>;
