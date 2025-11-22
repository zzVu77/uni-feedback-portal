import axiosInstance from "@/config/axiosConfig";
import {
  AnnouncementFilter,
  AnnouncementListItem,
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
