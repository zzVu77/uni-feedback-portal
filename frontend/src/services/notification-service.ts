import axiosInstance from "@/config/axiosConfig";
import {
  MarkAsReadPayload,
  NotificationDetails,
  PaginatedResponse,
} from "@/types";

const notificationBaseUrl = "/notifications";
export const getAllNotifications = async (): Promise<
  PaginatedResponse<NotificationDetails>
> => {
  const response =
    await axiosInstance.get<PaginatedResponse<NotificationDetails>>(
      notificationBaseUrl,
    );
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
