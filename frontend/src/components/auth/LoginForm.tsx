/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
    <div className="flex min-h-screen flex-col items-center justify-start gap-4 bg-gray-100 px-2 py-3 lg:px-10 lg:py-8">
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
            Đăng nhập
          </h2>
          <span className="font- text-center text-sm font-medium text-gray-500/70">
            Cổng thông tin góp ý và thảo luận
          </span>
        </div>
        <Form {...form}>
          <form
            className="space-y-4 md:space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <FormField
              control={form.control}
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Mật khẩu</FormLabel>
                    {/* Link to the new Forgot Password Page */}
                    <Link
                      href="/forgot-password"
                      className="text-blue-primary-600 text-sm font-medium hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button
                type="submit"
                variant={"primary"}
                className="bg-blue-primary-600 hover:bg-blue-primary-700 w-full"
                disabled={isPending}
                onClick={onSubmit}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Đăng nhập
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
