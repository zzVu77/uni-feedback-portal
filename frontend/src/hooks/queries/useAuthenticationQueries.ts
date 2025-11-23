import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { ILoginPayload, login, logout } from "@/services/auth-service";
import { toast } from "sonner";

export const useLogin = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (payload: ILoginPayload) => login(payload),
    retry: false,
    onSuccess: () => {
      toast.success("Đăng nhập thành công");
      router.push("/");
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
