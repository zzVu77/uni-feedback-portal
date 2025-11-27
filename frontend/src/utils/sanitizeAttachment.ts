import { FileAttachmentDto } from "@/types";

export const sanitizeAttachment = (file: FileAttachmentDto) => ({
  fileName: file.fileName,
  fileUrl: encodeURI(file.fileUrl.trim()), // FIX: Mã hóa URL
  fileType: file.fileType,
  fileSize: Number(file.fileSize),
});
