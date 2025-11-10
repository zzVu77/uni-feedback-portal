/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const REPORT_REASONS = {
  SPAM: "Spam hoặc quảng cáo",
  HARASSMENT: "Quấy rối hoặc bắt nạt",
  INAPPROPRIATE: "Nội dung không phù hợp",
  HATE_SPEECH: "Ngôn từ thù địch",
  OTHER: "Khác (vui lòng mô tả)",
};

const reportFormSchema = z.object({
  reason: z.string().min(1, "Vui lòng chọn lý do báo cáo."),
  description: z
    .string()
    .max(500, "Mô tả chỉ được tối đa 500 ký tự.")
    .optional(),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

interface ReportDialogProps {
  children: React.ReactNode;
  //   feedbackId: string;
  onSubmit: (values: ReportFormValues) => Promise<void>;
}

export function ReportDialog({
  children,
  //   feedbackId,
  onSubmit,
}: ReportDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      reason: undefined,
      description: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset();
      form.clearErrors();
    }
  }, [open, form]);

  const handleSubmit = async (values: ReportFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      setIsSubmitting(false);
      setOpen(false);
    } catch (error) {
      console.error("Failed to submit report:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Báo cáo bình luận</DialogTitle>
          <DialogDescription>
            Hãy cho chúng tôi biết tại sao bạn báo cáo bình luận này. Báo cáo
            của bạn sẽ được xem xét.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Lý do báo cáo *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn một lý do..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(REPORT_REASONS).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Field: Mô tả chi tiết (Textarea) */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả chi tiết (Tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cung cấp thêm thông tin chi tiết (nếu cần)..."
                      className="resize-none"
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
                variant="destructive" // Màu đỏ cho hành động báo cáo
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Gửi báo cáo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
