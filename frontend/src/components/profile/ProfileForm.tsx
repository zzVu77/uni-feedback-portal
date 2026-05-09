/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import { useUpdateMe } from "@/hooks/queries/useUserQueries";
import { cn } from "@/lib/utils";
import { getRoleDisplayName } from "@/utils/getRoleDisplayName";
import { getSidebarType } from "@/utils/getSidebarType";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Building,
  Calendar,
  Camera,
  Check,
  Loader2,
  Mail,
  Pencil,
  Shield,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  fullName: z.string().min(1, {
    message: "Vui lòng nhập họ và tên.",
  }),
});

export function ProfileForm() {
  const { user } = useUser();
  const { mutateAsync: updateMe, isPending } = useUpdateMe();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.fullName || "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await updateMe(values);
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      form.reset(values);
    } catch {
      toast.error("Cập nhật thông tin thất bại.");
    }
  });

  const handleCancel = () => {
    setIsEditing(false);
    form.reset({ fullName: user?.fullName || "" });
  };

  if (!user) return null;

  const sidebarType = getSidebarType(user.role);

  return (
    <div className="mx-auto w-full space-y-6">
      <Card className="overflow-hidden rounded-xl border-slate-100 py-4 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="group relative">
              <Avatar className="h-24 w-24 border-2 border-white shadow-md">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-blue-100 text-xl text-blue-700">
                  {user.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute right-0 bottom-0 h-8 w-8 rounded-full border border-white bg-white shadow-md hover:bg-slate-50"
                onClick={() =>
                  toast.info("Tính năng cập nhật ảnh đại diện sẽ sớm ra mắt!")
                }
                type="button"
              >
                <Camera className="h-4 w-4 text-slate-600" />
              </Button>
            </div>
            <div className="flex-1 space-y-1 text-center md:text-left">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900">
                    {user.fullName}
                  </CardTitle>
                  <CardDescription className="font-medium text-slate-500">
                    {getRoleDisplayName(sidebarType)}
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="rounded-lg border-slate-200 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Chỉnh sửa hồ sơ
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form
              onSubmit={(e) => {
                void onSubmit(e);
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Full Name - Editable in edit mode */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="font-semibold text-slate-700">
                        Họ và tên
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                          <Input
                            className={cn(
                              "h-11 rounded-lg border-slate-200 pl-10 transition-all focus-visible:ring-blue-600",
                              !isEditing &&
                                "cursor-not-allowed border-transparent bg-slate-50 text-slate-500 shadow-none",
                            )}
                            placeholder="Nhập họ và tên của bạn"
                            readOnly={!isEditing}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email - ReadOnly */}
                <FormItem>
                  <FormLabel className="font-semibold text-slate-700">
                    Email
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <Input
                        value={user.email}
                        readOnly
                        className="h-11 cursor-not-allowed rounded-lg border-slate-200 border-transparent bg-slate-50 pl-10 text-slate-500 shadow-none"
                      />
                    </div>
                  </FormControl>
                </FormItem>

                {/* Role - ReadOnly */}
                <FormItem>
                  <FormLabel className="font-semibold text-slate-700">
                    Vai trò
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Shield className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <Input
                        value={getRoleDisplayName(sidebarType)}
                        readOnly
                        className="h-11 cursor-not-allowed rounded-lg border-slate-200 border-transparent bg-slate-50 pl-10 text-slate-500 shadow-none"
                      />
                    </div>
                  </FormControl>
                </FormItem>

                {/* Department - ReadOnly */}
                <FormItem>
                  <FormLabel className="font-semibold text-slate-700">
                    Phòng ban / Đơn vị
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <Input
                        value={user.department?.name || "Không có"}
                        readOnly
                        className="h-11 cursor-not-allowed rounded-lg border-slate-200 border-transparent bg-slate-50 pl-10 text-slate-500 shadow-none"
                      />
                    </div>
                  </FormControl>
                </FormItem>

                {/* Created At - ReadOnly */}
                <FormItem>
                  <FormLabel className="font-semibold text-slate-700">
                    Ngày tham gia
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <Input
                        value={format(new Date(user.createdAt), "dd/MM/yyyy")}
                        readOnly
                        className="h-11 cursor-not-allowed rounded-lg border-slate-200 border-transparent bg-slate-50 pl-10 text-slate-500 shadow-none"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              </div>

              {isEditing && (
                <div className="flex items-center justify-center gap-3 border-t border-slate-100 pt-4 md:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="h-11 rounded-lg border-slate-200 px-6 font-semibold text-slate-700"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending || !form.formState.isDirty}
                    className="h-11 rounded-lg bg-blue-600 px-6 font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98]"
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Lưu thay đổi
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
