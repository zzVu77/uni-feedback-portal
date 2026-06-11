"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDepartment } from "@/hooks/queries/useDepartmentQueries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createDepartmentSchema = z.object({
  name: z.string().min(3, "Tên phòng ban phải có ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  description: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
});

type CreateDepartmentFormValues = z.infer<typeof createDepartmentSchema>;

interface CreateDepartmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateDepartmentDialog = ({
  isOpen,
  onClose,
}: CreateDepartmentDialogProps) => {
  const { mutateAsync: createDepartment, isPending } = useCreateDepartment();

  const form = useForm<CreateDepartmentFormValues>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
      name: "",
      email: "",
      description: "",
      location: "",
      phone: "",
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const onSubmit = async (data: CreateDepartmentFormValues) => {
    try {
      await createDepartment(data);
      onClose();
    } catch (error) {
      // Error is handled by the mutation hook (toast)
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm phòng ban mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin chi tiết cho phòng ban mới. Email sẽ được sử dụng để
            liên hệ chính.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên phòng ban *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Phòng Đào tạo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email liên hệ *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Ví dụ: daotao@hcmute.edu.vn"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: 0123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vị trí / Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Tòa nhà Trung tâm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả (Tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả ngắn gọn chức năng của phòng ban..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Thêm mới
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
