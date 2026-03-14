// services/upload-service.ts
import axiosInstance from "@/config/axiosConfig";
import axios from "axios";
import { PresignedUrlResponse, FileAttachmentDto } from "@/types";
export const uploadBaseUrl = "/uploads";
const getPresignedUrl = async (
  fileName: string,
  fileType: string,
  fileSize: number,
  targetType: string,
): Promise<PresignedUrlResponse> => {
  const response = await axiosInstance.post<PresignedUrlResponse>(
    `${uploadBaseUrl}/presigned-url`,
    {
      fileName,
      fileType,
      fileSize,
      targetType,
    },
  );
  return response;
};

export const uploadFileToCloud = async (
  file: File,
  targetType: string,
): Promise<FileAttachmentDto> => {
  try {
    const { uploadUrl, fileKey } = await getPresignedUrl(
      file.name,
      file.type,
      file.size,
      targetType,
    );
    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
        "Content-Length": file.size.toString(),
      },
    });

    return {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileKey: fileKey,
    };
  } catch (error) {
    console.error(`Upload failed for file ${file.name}:`, error);
    throw error;
  }
};
