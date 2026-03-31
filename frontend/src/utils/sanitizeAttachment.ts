import { FileAttachmentDto } from "@/types";

export const sanitizeAttachment = (file: FileAttachmentDto) => ({
  fileName: file.fileName,
  fileKey: file.fileKey,
  fileType: file.fileType,
  fileSize: Number(file.fileSize),
});
