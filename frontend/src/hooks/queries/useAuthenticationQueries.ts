import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { ILoginPayload, login, logout } from "@/services/auth-service";
import { toast } from "sonner";

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  return useMutation({
    mutationFn: (payload: ILoginPayload) => login(payload),
    retry: false,
    onSuccess: () => {
      window.location.reload();
      toast.success("Đăng nhập thành công");
      const returnTo = searchParams.get("returnTo");
      const redirectPath = returnTo || "/";
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
