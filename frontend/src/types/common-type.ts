export interface PaginatedResponse<TData> {
  results: TData[];
  total: number;
}
export interface BaseFilter {
  page: number;
  pageSize: number;
  limit?: number;
  q?: string;
}
export type OptionType = {
  label: string;
  value: string;
};
export type PresignedUrlResponse = {
  uploadUrl: string;
  fileKey: string;
};

export type FileAttachmentDto = {
  fileName: string;
  fileUrl?: string;
  fileKey: string;
  fileType: string;
  fileSize: number;
};
export type FileAttachment = Omit<
  FileAttachmentDto,
  "fileType" | "fileSize" | "fileKey"
>;
