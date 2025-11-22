/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
} from "@/services/announcement-service";
import {
  AnnouncementFilter,
  AnnouncementListItem,
  CreateAnnouncementPayload,
  PaginatedResponse,
} from "@/types";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export const ANNOUNCEMENT_QUERY_KEYS = {
  all: "announcements",
  detail: "announcement-detail",
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
export const useGetAnnouncementById = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [ANNOUNCEMENT_QUERY_KEYS.detail, id],
    queryFn: () => getAnnouncementById(id),
    retry: false,
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

export const useCreateAnnouncement = () => {
  return useMutation({
    mutationFn: (data: CreateAnnouncementPayload) => createAnnouncement(data),
    onSuccess: () => {
      toast.success("Tạo thông báo thành công!");
    },
    onError: () => {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại!");
    },
  });
};
