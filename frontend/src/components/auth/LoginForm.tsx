/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { ASSETS } from "@/constants/assets";
import { useLogin } from "@/hooks/queries/useAuthenticationQueries";

const formSchema = z.object({
  email: z.string().email({
    message: "Vui lòng nhập một địa chỉ email hợp lệ.",
  }),
  password: z.string().min(1, {
    message: "Vui lòng nhập mật khẩu.",
  }),
});

export function LoginForm() {
  const { mutateAsync: login, isPending } = useLogin();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await login(values);
  });

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

        <div className="space-y-1">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-wider text-slate-900 uppercase">
              Đăng nhập
            </h2>
          </div>

          <Form {...form}>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <FormField
                control={form.control}
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="font-semibold text-slate-700">
                        Mật khẩu
                      </FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 hover:underline"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>
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
              <div className="pt-2">
                <Button
                  type="submit"
                  className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 text-base font-bold tracking-widest text-white uppercase shadow-lg shadow-blue-900/20 transition-all hover:from-blue-800 hover:to-blue-700 hover:shadow-xl active:scale-[0.98] disabled:opacity-70"
                  disabled={isPending}
                  onClick={onSubmit}
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  )}
                  Đăng nhập
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
