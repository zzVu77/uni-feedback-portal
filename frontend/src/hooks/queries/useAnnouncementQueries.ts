/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllAnnouncements } from "@/services/announcement-service";
import {
  PaginatedResponse,
  AnnouncementListItem,
  AnnouncementFilter,
} from "@/types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const ANNOUNCEMENT_QUERY_KEYS = {
  all: "announcements",
};

export const useGetAllAnnouncement = (
  filters: AnnouncementFilter,
  options?: UseQueryOptions<PaginatedResponse<AnnouncementListItem>>,
) => {
  return useQuery({
    queryKey: [ANNOUNCEMENT_QUERY_KEYS.all, filters],
    queryFn: () => getAllAnnouncements(filters),
    retry: false,
    placeholderData: (previousData) => previousData,
    ...options,
  });
};
