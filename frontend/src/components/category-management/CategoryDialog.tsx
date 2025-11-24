/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Category } from "./category-table/columns";

const categoryFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Tên danh mục phải có ít nhất 3 ký tự." })
    .max(100, { message: "Tên danh mục chỉ có tối đa 100 ký tự." }),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryDialogProps {
  children: React.ReactNode;

  mode: "create" | "edit";

  initialData?: Category | null;

  onSubmit: (values: CategoryFormValues) => Promise<void>;
}

export function CategoryDialog({
  children,
  mode,
  initialData,
  onSubmit,
}: CategoryDialogProps) {
  const [open, setOpen] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isEditMode = mode === "edit";

  const title = isEditMode ? "Chỉnh sửa Danh mục" : "Tạo Danh mục mới";
  const description = isEditMode
    ? "Cập nhật thông tin cho danh mục này."
    : "Thêm một danh mục mới vào hệ thống.";
  const actionText = isEditMode ? "Lưu thay đổi" : "Tạo mới";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: initialData?.name || "",
      });
      form.clearErrors();
    }
  }, [open, initialData, form.reset]);

  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      setIsSubmitting(true);

      await onSubmit(values);

      setIsSubmitting(false);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Failed to submit category:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Danh Mục</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: Cơ sở vật chất"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="bg-green-500 hover:bg-green-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                {actionText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
