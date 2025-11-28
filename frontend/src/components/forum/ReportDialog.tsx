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

// Updated Schema: Description is required only if reason is "OTHER"
const reportFormSchema = z
  .object({
    reason: z.string().min(1, "Vui lòng chọn lý do báo cáo."),
    description: z
      .string()
      .max(500, "Mô tả chỉ được tối đa 500 ký tự.")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.reason === "OTHER" && !data.description?.trim()) {
        return false;
      }
      return true;
    },
    {
      message: "Vui lòng nhập mô tả chi tiết.",
      path: ["description"],
    },
  );

type ReportFormValues = z.infer<typeof reportFormSchema>;

interface ReportDialogProps {
  children: React.ReactNode;
  // Changed logic: returns the final reason string to the parent
  onSubmit: (reason: string) => Promise<void>;
}

export function ReportDialog({ children, onSubmit }: ReportDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      reason: undefined,
      description: "",
    },
  });

  // Watch the reason field to conditionally render textarea
  const selectedReason = form.watch("reason");

  React.useEffect(() => {
    if (open) {
      form.reset();
      form.clearErrors();
    }
  }, [open, form]);

  const handleSubmit = async (values: ReportFormValues) => {
    try {
      setIsSubmitting(true);

      // Logic: If "OTHER", use description. Else, use the predefined text value.
      let finalReason = "";
      if (values.reason === "OTHER") {
        finalReason = values.description || "";
      } else {
        // Get the Vietnamese text corresponding to the key (e.g., "SPAM" -> "Spam hoặc quảng cáo")
        finalReason =
          REPORT_REASONS[values.reason as keyof typeof REPORT_REASONS];
      }

      await onSubmit(finalReason);

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

            {/* Conditionally render Textarea only if "OTHER" is selected */}
            {selectedReason === "OTHER" && (
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả chi tiết *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Vui lòng mô tả lý do..."
                        className="resize-none"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                variant="destructive"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
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
