// services/upload-service.ts
import axiosInstance from "@/config/axiosConfig";
import axios from "axios";
import { PresignedUrlResponse, FileAttachmentDto } from "@/types";
export const uploadBaseUrl = "/uploads";
const getPresignedUrl = async (
  fileName: string,
  fileType: string,
): Promise<PresignedUrlResponse> => {
  const response = await axiosInstance.post<PresignedUrlResponse>(
    `${uploadBaseUrl}/presigned-url`,
    {
      fileName,
      fileType,
    },
  );
  return response;
};

export const uploadFileToCloud = async (
  file: File,
): Promise<FileAttachmentDto> => {
  try {
    const { uploadUrl, fileUrl } = await getPresignedUrl(file.name, file.type);
    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    return {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileUrl: fileUrl,
    };
  } catch (error) {
    console.error(`Upload failed for file ${file.name}:`, error);
    throw error;
  }
};
