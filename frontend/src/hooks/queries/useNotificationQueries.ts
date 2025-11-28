/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllNotifications } from "@/services/notification-service";
import { useQuery } from "@tanstack/react-query";

export const NOTIFICATION_QUERY_KEYS = "notifications";

// Updated to accept filters
export const useGetAllNotifications = () => {
  return useQuery({
    queryKey: [NOTIFICATION_QUERY_KEYS],
    queryFn: () => getAllNotifications(),
    placeholderData: (previousData) => previousData,
  });
};
