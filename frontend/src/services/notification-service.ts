import axiosInstance from "@/config/axiosConfig";
import { NotificationDetails, PaginatedResponse } from "@/types";

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
