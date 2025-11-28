/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getAllNotifications,
  markNotificationsAsRead,
} from "@/services/notification-service";
import { MarkAsReadPayload, NotificationFilter } from "@/types"; // Import type
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";

export const NOTIFICATION_QUERY_KEYS = "notifications";

export const useGetInfiniteNotifications = (filters: NotificationFilter) => {
  return useInfiniteQuery({
    queryKey: [NOTIFICATION_QUERY_KEYS, filters],
    queryFn: ({ pageParam = 1 }) =>
      getAllNotifications({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.results.length > 0 ? nextPage : undefined;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useMarkNotificationAsRead = () => {
  return useMutation({
    mutationFn: (payload: MarkAsReadPayload) =>
      markNotificationsAsRead(payload),
  });
};
