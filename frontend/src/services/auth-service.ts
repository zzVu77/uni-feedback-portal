import axiosInstance from "@/config/axiosConfig";

export interface ILoginPayload {
  email: string;
  password: string;
}

const authBaseUrl = "/auth";
export const login = async (payload: ILoginPayload) => {
  await axiosInstance.post(`${authBaseUrl}/login`, payload);
};

export const logout = async () => {
  await axiosInstance.post(`${authBaseUrl}/logout`);
};
