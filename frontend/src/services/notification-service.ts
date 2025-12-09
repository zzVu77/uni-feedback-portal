import axiosInstance from "@/config/axiosConfig";
import {
  MarkAsReadPayload,
  NotificationDetails,
  NotificationFilter,
  PaginatedResponse,
  UnreadNotificationCount,
} from "@/types";

const notificationBaseUrl = "/notifications";

export const getAllNotifications = async (
  filter: NotificationFilter,
): Promise<PaginatedResponse<NotificationDetails>> => {
  const response = await axiosInstance.get<
    PaginatedResponse<NotificationDetails>
  >(notificationBaseUrl, {
    params: filter,
  });
  return response;
};

export const markNotificationsAsRead = async (
  payload: MarkAsReadPayload,
): Promise<NotificationDetails[]> => {
  const response = await axiosInstance.patch<NotificationDetails[]>(
    `${notificationBaseUrl}/read`,
    payload,
  );
  return response;
};
export const getUnreadNotificationCount =
  async (): Promise<UnreadNotificationCount> => {
    const response = await axiosInstance.get<UnreadNotificationCount>(
      `${notificationBaseUrl}/unread-count`,
    );
    return response;
  };
