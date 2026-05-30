/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft, Mail, Lock } from "lucide-react";
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
    <div className="flex min-h-screen w-full items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-white p-4">
      <div className="w-full max-w-lg space-y-8 rounded-3xl bg-white p-8 shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] ring-1 ring-slate-900/5 sm:p-10">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-4">
          <Image
            src={ASSETS.LOGO_UTE}
            alt="School Logo"
            width={120}
            height={120}
            priority
            className="drop-shadow-md"
          />
          <div className="space-y-1 text-center">
            <h1 className="text-xl font-black tracking-tight text-blue-900 lg:text-2xl">
              Cổng thông tin Góp ý & Thảo luận
            </h1>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-wider text-slate-900 uppercase">
              {step === 1 ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              {step === 1
                ? "Nhập email của bạn để nhận mã OTP xác thực."
                : `Mã OTP đã được gửi tới email: ${email}`}
            </p>
          </div>

          {/* STEP 1: EMAIL FORM */}
          {step === 1 && (
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-slate-700">
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                          <Input
                            placeholder="example@email.com"
                            className="h-12 rounded-xl border-slate-200 pl-10 focus-visible:ring-blue-600"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 text-base font-bold tracking-widest text-white uppercase shadow-lg shadow-blue-900/20 transition-all hover:from-blue-800 hover:to-blue-700 hover:shadow-xl active:scale-[0.98] disabled:opacity-70"
                  disabled={isSendingOtp}
                >
                  {isSendingOtp && (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
                className="space-y-6"
              >
                <FormField
                  control={resetForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block w-full text-center font-semibold text-slate-700">
                        Mã OTP
                      </FormLabel>
                      <FormControl>
                        <div className="flex w-full justify-center">
                          <InputOTP
                            maxLength={6}
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <InputOTPGroup className="gap-2">
                              <InputOTPSlot
                                index={0}
                                className="h-12 w-10 rounded-lg border-slate-200"
                              />
                              <InputOTPSlot
                                index={1}
                                className="h-12 w-10 rounded-lg border-slate-200"
                              />
                              <InputOTPSlot
                                index={2}
                                className="h-12 w-10 rounded-lg border-slate-200"
                              />
                              <InputOTPSlot
                                index={3}
                                className="h-12 w-10 rounded-lg border-slate-200"
                              />
                              <InputOTPSlot
                                index={4}
                                className="h-12 w-10 rounded-lg border-slate-200"
                              />
                              <InputOTPSlot
                                index={5}
                                className="h-12 w-10 rounded-lg border-slate-200"
                              />
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
                      <FormLabel className="font-semibold text-slate-700">
                        Mật khẩu mới
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                          <Input
                            type="password"
                            placeholder="********"
                            className="h-12 rounded-xl border-slate-200 pl-10 focus-visible:ring-blue-600"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 text-base font-bold tracking-widest text-white uppercase shadow-lg shadow-blue-900/20 transition-all hover:from-blue-800 hover:to-blue-700 hover:shadow-xl active:scale-[0.98] disabled:opacity-70"
                    disabled={isResetting}
                  >
                    {isResetting && (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    )}
                    Đổi mật khẩu
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full rounded-xl text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setStep(1)}
                    disabled={isResetting}
                  >
                    Gửi lại mã OTP
                  </Button>
                </div>
              </form>
            </Form>
          )}

          <div className="flex justify-center pt-2">
            <Link
              href="/login"
              className="flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800 hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại trang đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
