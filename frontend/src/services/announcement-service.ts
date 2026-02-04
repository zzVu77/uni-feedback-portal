import axiosInstance from "@/config/axiosConfig";
import {
  AnnouncementDetailType,
  AnnouncementFilter,
  AnnouncementListItem,
  CreateAnnouncementPayload,
  PaginatedResponse,
} from "@/types";

const announcementBaseUrl = "/announcement";
const announcementStaffBaseUrl = "/announcement/staff";
//  Announcement service functions for authenticated users
export const getAllAnnouncementsForAuthenticatedUsers = async (
  filter: AnnouncementFilter,
): Promise<PaginatedResponse<AnnouncementListItem>> => {
  const response = await axiosInstance.get<
    PaginatedResponse<AnnouncementListItem>
  >(announcementBaseUrl, {
    params: filter,
  });
  return response;
};
export const getAnnouncementByIdForAuthenticatedUsers = async (
  id: string,
): Promise<AnnouncementDetailType> => {
  const response = await axiosInstance.get<AnnouncementDetailType>(
    `${announcementBaseUrl}/${id}`,
  );
  return response;
};
// Announcement service functions for staff users
export const getAllAnnouncementsForStaff = async (
  filter: AnnouncementFilter,
): Promise<PaginatedResponse<AnnouncementListItem>> => {
  const response = await axiosInstance.get<
    PaginatedResponse<AnnouncementListItem>
  >(announcementStaffBaseUrl, {
    params: filter,
  });
  return response;
};
export const getAnnouncementByIdForStaff = async (
  id: string,
): Promise<AnnouncementDetailType> => {
  const response = await axiosInstance.get<AnnouncementDetailType>(
    `${announcementStaffBaseUrl}/${id}`,
  );
  return response;
};
export const createAnnouncement = async (
  payload: CreateAnnouncementPayload,
) => {
  await axiosInstance.post(announcementStaffBaseUrl, {
    ...payload,
  });
};
export const updateAnnouncementById = async (
  id: string,
  payload: CreateAnnouncementPayload,
) => {
  await axiosInstance.patch(`${announcementStaffBaseUrl}/${id}`, {
    ...payload,
  });
};
export const deleteAnnouncementById = async (id: string) => {
  await axiosInstance.delete(`${announcementStaffBaseUrl}/${id}`);
};
