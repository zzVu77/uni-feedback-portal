/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createAnnouncement,
  deleteAnnouncementById,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncementById,
} from "@/services/announcement-service";
import {
  AnnouncementFilter,
  AnnouncementListItem,
  CreateAnnouncementPayload,
  PaginatedResponse,
} from "@/types";
import {
  useInfiniteQuery, // Changed from useQuery
  useMutation,
  useQuery,
  useQueryClient, // Added queryClient
} from "@tanstack/react-query";
import { toast } from "sonner";

export const ANNOUNCEMENT_QUERY_KEYS = {
  all: "announcements",
  detail: "announcement-detail",
};

// Refactored to Infinite Query
export const useGetInfiniteAnnouncements = (filters: AnnouncementFilter) => {
  return useInfiniteQuery<PaginatedResponse<AnnouncementListItem>>({
    queryKey: [ANNOUNCEMENT_QUERY_KEYS.all, filters],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      // Merge pageParam with existing filters
      return await getAllAnnouncements({
        ...filters,
        page: pageParam as number,
        pageSize: 10,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      // Calculate loaded items count
      const loadedItems = allPages.flatMap((page) => page.results).length;

      // Check if there are more items to load
      if (loadedItems < lastPage.total) {
        return allPages.length + 1;
      }
      return undefined;
    },
    retry: false,
    placeholderData: (previousData) => previousData,
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
  const queryClient = useQueryClient(); // Need to invalidate queries
  return useMutation({
    mutationFn: (data: CreateAnnouncementPayload) => createAnnouncement(data),
    onSuccess: () => {
      toast.success("Tạo thông báo thành công!");
      // Invalidate to refresh the list
      queryClient.invalidateQueries({
        queryKey: [ANNOUNCEMENT_QUERY_KEYS.all],
      });
    },
    onError: () => {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại!");
    },
  });
};

export const useUpdateAnnouncementById = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAnnouncementPayload) =>
      updateAnnouncementById(id, data),
    onSuccess: () => {
      toast.success("Cập nhật thông báo thành công!");
      queryClient.invalidateQueries({
        queryKey: [ANNOUNCEMENT_QUERY_KEYS.all],
      });
      queryClient.invalidateQueries({
        queryKey: [ANNOUNCEMENT_QUERY_KEYS.detail, id],
      });
    },
    onError: () => {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại!");
    },
  });
};

export const useDeleteAnnouncementById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAnnouncementById(id),
    onSuccess: () => {
      toast.success("Xoá thông báo thành công!");
      queryClient.invalidateQueries({
        queryKey: [ANNOUNCEMENT_QUERY_KEYS.all],
      });
    },
    onError: () => {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại!");
    },
  });
};
