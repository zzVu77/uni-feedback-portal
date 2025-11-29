/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// Import các component InputOTP
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { ASSETS } from "@/constants/assets";
import {
  useForgotPassword,
  useResetPassword,
} from "@/hooks/queries/useAuthenticationQueries";

// Schema for Step 1: Email
const emailSchema = z.object({
  email: z
    .string()
    .email({ message: "Vui lòng nhập một địa chỉ email hợp lệ." }),
});

// Schema for Step 2: OTP & New Password
const resetSchema = z.object({
  otp: z.string().length(6, { message: "Mã OTP phải có đúng 6 ký tự." }),
  newPassword: z
    .string()
    .min(8, { message: "Mật khẩu mới phải có ít nhất 8 ký tự." }),
});

export default function ForgotPasswordPage() {
  const router = useRouter();

  // State quản lý luồng: 1 = Nhập Email, 2 = Nhập OTP/Mật khẩu mới
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");

  // Queries
  const { mutateAsync: sendOtp, isPending: isSendingOtp } = useForgotPassword();
  const { mutateAsync: doReset, isPending: isResetting } = useResetPassword();

  // --- Forms Configuration ---
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { otp: "", newPassword: "" },
  });

  // --- Handlers ---
  const onEmailSubmit = async (values: z.infer<typeof emailSchema>) => {
    try {
      await sendOtp(values);
      setEmail(values.email);
      setStep(2);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const onResetSubmit = async (values: z.infer<typeof resetSchema>) => {
    try {
      await doReset({
        email: email,
        otp: values.otp,
        newPassword: values.newPassword,
      });
      router.push("/login");
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start gap-4 bg-gray-100 px-2 py-3 lg:px-10 lg:py-8">
      {/* Header / Logo */}
      <Image
        src={ASSETS.LOGO_UTE}
        alt="School Logo"
        width={120}
        height={120}
        priority
      />
      <h1 className="text-center text-xl font-extrabold text-blue-900 md:text-2xl">
        TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT TP.HCM
      </h1>

      <div className="flex w-full max-w-lg flex-col justify-center gap-4 rounded-lg bg-white px-6 py-6 shadow-lg">
        <div className="flex flex-col items-center justify-center gap-2">
          <h2 className="text-red-primary-500/80 text-center text-2xl font-bold tracking-wide uppercase">
            {step === 1 ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
          </h2>
          <span className="font- text-center text-sm font-medium text-gray-500/70">
            {step === 1
              ? "Nhập email của bạn để nhận mã OTP xác thực."
              : `Mã OTP đã được gửi tới email: ${email}`}
          </span>
        </div>

        {/* STEP 1: EMAIL FORM */}
        {step === 1 && (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="space-y-4 md:space-y-6"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant={"primary"}
                className="bg-blue-primary-600 hover:bg-blue-primary-700 w-full"
                disabled={isSendingOtp}
              >
                {isSendingOtp && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Gửi mã OTP
              </Button>
            </form>
          </Form>
        )}

        {/* STEP 2: OTP & NEW PASSWORD FORM */}
        {step === 2 && (
          <Form {...resetForm}>
            <form
              onSubmit={resetForm.handleSubmit(onResetSubmit)}
              className="space-y-4 md:space-y-6"
            >
              <FormField
                control={resetForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã OTP</FormLabel>
                    <FormControl>
                      <div className="flex w-full justify-center">
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={field.onChange}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />

              <FormField
                control={resetForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <Button
                  type="submit"
                  variant={"primary"}
                  className="bg-blue-primary-600 hover:bg-blue-primary-700 w-full"
                  disabled={isResetting}
                >
                  {isResetting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Đổi mật khẩu
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-gray-500"
                  onClick={() => setStep(1)}
                  disabled={isResetting}
                >
                  Gửi lại mã OTP
                </Button>
              </div>
            </form>
          </Form>
        )}

        <div className="mt-2 flex justify-center">
          <Link
            href="/login"
            className="text-blue-primary-600 flex items-center text-sm font-medium hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Quay lại trang đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
