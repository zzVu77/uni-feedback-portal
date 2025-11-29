import axiosInstance from "@/config/axiosConfig";

export interface ILoginPayload {
  email: string;
  password: string;
}
export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

const authBaseUrl = "/auth";
export const login = async (payload: ILoginPayload) => {
  await axiosInstance.post(`${authBaseUrl}/login`, payload);
};

export const logout = async () => {
  await axiosInstance.post(`${authBaseUrl}/logout`);
};

export const forgotPassword = async (payload: IForgotPasswordPayload) => {
  await axiosInstance.post(`${authBaseUrl}/forgot-password`, payload);
};

export const resetPassword = async (payload: IResetPasswordPayload) => {
  await axiosInstance.post(`${authBaseUrl}/reset-password`, payload);
};
