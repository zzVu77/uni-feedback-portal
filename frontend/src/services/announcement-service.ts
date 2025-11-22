import axiosInstance from "@/config/axiosConfig";
import {
  AnnouncementDetailType,
  AnnouncementFilter,
  AnnouncementListItem,
  CreateAnnouncementPayload,
  PaginatedResponse,
} from "@/types";

const announcementBaseUrl = "/announcement";
export const getAllAnnouncements = async (
  filter: AnnouncementFilter,
): Promise<PaginatedResponse<AnnouncementListItem>> => {
  const response = await axiosInstance.get<
    PaginatedResponse<AnnouncementListItem>
  >(announcementBaseUrl, {
    params: filter,
  });
  return response;
};
export const getAnnouncementById = async (
  id: string,
): Promise<AnnouncementDetailType> => {
  const response = await axiosInstance.get<AnnouncementDetailType>(
    `${announcementBaseUrl}/${id}`,
  );
  return response;
};

export const createAnnouncement = async (
  payload: CreateAnnouncementPayload,
) => {
  await axiosInstance.post(announcementBaseUrl, {
    ...payload,
  });
};
