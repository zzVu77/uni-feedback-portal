/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getAllNotifications,
  markNotificationsAsRead,
} from "@/services/notification-service";
import { MarkAsReadPayload } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const NOTIFICATION_QUERY_KEYS = "notifications";

export const useGetAllNotifications = () => {
  return useQuery({
    queryKey: [NOTIFICATION_QUERY_KEYS],
    queryFn: () => getAllNotifications(),
    placeholderData: (previousData) => previousData,
  });
};

export const useMarkNotificationAsRead = () => {
  return useMutation({
    mutationFn: (payload: MarkAsReadPayload) =>
      markNotificationsAsRead(payload),
  });
};
