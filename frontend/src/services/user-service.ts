import axiosInstance from "@/config/axiosConfig";
import { UserInfo } from "@/types";

const USERS_URL = "/users";

export const getMe = async (): Promise<UserInfo> => {
  const response = await axiosInstance.get<UserInfo>(`${USERS_URL}/me`);
  return response;
};

export const updateMe = async (data: {
  fullName: string;
}): Promise<UserInfo> => {
  const response = await axiosInstance.patch<UserInfo>(
    `${USERS_URL}/update/me`,
    data,
  );
  return response;
};
