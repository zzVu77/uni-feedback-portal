import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import {
  forgotPassword,
  IForgotPasswordPayload,
  ILoginPayload,
  IResetPasswordPayload,
  login,
  logout,
  resetPassword,
} from "@/services/auth-service";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { getUrlByRole } from "@/utils/getUrlByRole";

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  return useMutation({
    mutationFn: (payload: ILoginPayload) => login(payload),
    retry: false,
    onSuccess: () => {
      window.location.reload();
      toast.success("Đăng nhập thành công");
      const returnTo = searchParams.get("returnTo");
      const redirectPath = returnTo || (user ? getUrlByRole(user.role) : "/");
      router.push(redirectPath);
    },
    onError: () => {
      toast.error("Email hoặc mật khẩu không chính xác");
    },
  });
};
export const useLogout = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: () => logout(),
    retry: false,
    onSuccess: () => {
      toast.success("Đăng xuất thành công");
      router.push("/login");
    },
    onError: () => {
      toast.error("Đăng xuất thất bại");
    },
  });
};
// Hook for requesting the OTP
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (payload: IForgotPasswordPayload) => forgotPassword(payload),
    onSuccess: () => {
      toast.success("Mã OTP đã được gửi đến email của bạn.");
    },
    onError: () => {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
    },
  });
};

// Hook for resetting the password
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (payload: IResetPasswordPayload) => resetPassword(payload),
    onSuccess: () => {
      toast.success("Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.");
    },
    onError: () => {
      toast.error("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
    },
  });
};
