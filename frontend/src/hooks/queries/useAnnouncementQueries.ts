/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getAllAnnouncements,
  getAnnouncementById,
} from "@/services/announcement-service";
import {
  PaginatedResponse,
  AnnouncementListItem,
  AnnouncementFilter,
} from "@/types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const ANNOUNCEMENT_QUERY_KEYS = "announcements";

export const useGetAllAnnouncement = (
  filters: AnnouncementFilter,
  options?: UseQueryOptions<PaginatedResponse<AnnouncementListItem>>,
) => {
  return useQuery({
    queryKey: [ANNOUNCEMENT_QUERY_KEYS, filters],
    queryFn: () => getAllAnnouncements(filters),
    retry: false,
    placeholderData: (previousData) => previousData,
    ...options,
  });
};
export const useGetAnnouncementById = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [ANNOUNCEMENT_QUERY_KEYS, id],
    queryFn: () => getAnnouncementById(id),
    retry: false,
    placeholderData: (previousData) => previousData,
    ...options,
  });
};
