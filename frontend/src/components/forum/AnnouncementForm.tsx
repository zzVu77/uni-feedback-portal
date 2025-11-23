/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw, Save, Send, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ConfirmationDialog from "../common/ConfirmationDialog";
import { FileInput } from "../common/FileInput";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

import dynamic from "next/dynamic";

import { CreateAnnouncementPayload } from "@/types";
import "suneditor/dist/css/suneditor.min.css";
import { useRouter } from "next/navigation";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
  loading: () => <p>Đang tải trình soạn thảo...</p>,
});

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "text/plain", // .txt
];
const formSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Tiêu đề phải có ít nhất 3 ký tự.",
    })
    .max(500, {
      message: "Tiêu đề chỉ có tối đa 500 ký tự.",
    }),

  content: z
    .string()
    .min(1, { message: "Vui lòng nhập nội dung thông báo." })
    .max(5000, {
      message: "Tối đa 5000 ký tự.",
    }),
  attachments: z
    .array(z.instanceof(File))
    .optional()
    .refine(
      (files) => !files || files.every((file) => file.size <= MAX_FILE_SIZE),
      `Kích thước file tối đa là 100MB.`,
    )
    .refine(
      (files) =>
        !files ||
        files.every((file) => ACCEPTED_FILE_TYPES.includes(file.type)),
      "Chỉ chấp nhận các định dạng .jpg, .png, .pdf, .docx, .txt",
    ),
});
type AnnouncementForm = {
  type: "create" | "edit";
  initialData?: CreateAnnouncementPayload;
  onSubmit: (values: CreateAnnouncementPayload) => Promise<void>;
  isPending?: boolean;
};
const AnnouncementForm = ({
  type = "create",
  initialData,
  onSubmit,
  isPending,
}: AnnouncementForm) => {
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      // attachments: initialData?.attachments || [],
      attachments: [],
    },
  });
  const mapFormValuesToAnnouncementPayload = (
    values: z.infer<typeof formSchema>,
  ): CreateAnnouncementPayload => {
    return {
      title: values.title,
      content: values.content,
      // attachments: values.attachments,
    };
  };
  const { isDirty } = form.formState;
  const handleCreateAnnouncement = form.handleSubmit(async (values) => {
    const payload = mapFormValuesToAnnouncementPayload(values);
    await onSubmit(payload);
    setIsSubmitDialogOpen(false);
    form.reset();
  });

  const handleUpdateAnnouncement = form.handleSubmit(async (values) => {
    const payload = mapFormValuesToAnnouncementPayload(values);
    await onSubmit(payload);
  });
  const handleResetForm = () => {
    form.reset();
    form.clearErrors();
  };
  const handleAttemptSubmit = async () => {
    const isFormValid = await form.trigger();
    if (isFormValid) {
      setIsSubmitDialogOpen(true);
    }
  };
  const router = useRouter();
  const handleCancel = () => {
    router.push("/staff/announcement-management");
  };

  return (
    <>
      <Form {...form}>
        <form
          className="rounded-xlbg-white flex h-full flex-col gap-2 px-4 py-4 shadow-md lg:px-8 lg:py-4"
          onSubmit={(e) => e.preventDefault()} // prevent default submit
        >
          <h2 className="mb-2 text-[20px] font-semibold lg:text-[28px]">
            {type === "edit" ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}
          </h2>
          <ScrollArea className="w-full overflow-y-auto pr-1">
            <div className="flex h-[76vh] flex-col gap-4 px-2">
              {/* Subject Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề thông báo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tiêu đề thông báo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nội dung thông báo</FormLabel>
                      <FormControl>
                        <SunEditor
                          defaultValue={field.value}
                          onChange={(content) => {
                            const textContent = content
                              .replace(/<[^>]+>/g, "")
                              .trim();
                            if (!textContent) {
                              field.onChange("");
                            } else {
                              field.onChange(content);
                            }
                          }}
                          height="auto"
                          setOptions={{
                            minHeight: "200px",
                            buttonList: [
                              ["undo", "redo"],
                              ["font", "fontSize", "formatBlock"],
                              ["bold", "italic", "underline", "strike"],
                              ["list", "link"],
                              ["removeFormat"],
                              ["codeView", "fullScreen"],
                            ],
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Attachments */}
              <FormField
                control={form.control}
                name="attachments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tệp đính kèm (nếu có)</FormLabel>
                    <FormControl>
                      <FileInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </ScrollArea>

          {type == "create" ? (
            <div className="border-neutral-light-primary-300 flex flex-row items-center justify-center gap-4 border-t pt-2 lg:justify-end">
              <ConfirmationDialog
                title="Xác nhận làm mới biểu mẫu?"
                description="Hành động này sẽ xóa toàn bộ thông tin bạn đã nhập. Bạn có muốn tiếp tục không?"
                onConfirm={handleResetForm}
                confirmText="Đồng ý"
              >
                <Button
                  type="button"
                  disabled={!isDirty}
                  variant={"cancel"}
                  className="flex max-w-lg flex-row items-center gap-2 py-3"
                >
                  <RotateCcw className="h-5 w-5" />
                  Làm mới
                </Button>
              </ConfirmationDialog>

              <Button
                type="button"
                disabled={!isDirty}
                variant={"primary"}
                onClick={handleAttemptSubmit}
                className="flex max-w-lg flex-row items-center gap-2 py-3 shadow-md"
              >
                <Send className="h-5 w-5" />
                Tạo
              </Button>
            </div>
          ) : (
            <div className="border-neutral-light-primary-300 flex flex-row items-center justify-center gap-4 border-t pt-2 lg:justify-end">
              <Button
                type="button"
                variant={"cancel"}
                onClick={handleCancel} // TODO: Implement cancel functionality ( back again to detail page )
                className="flex max-w-lg flex-row items-center gap-2 py-3"
              >
                <X className="h-5 w-5" />
                Hủy
              </Button>
              <ConfirmationDialog
                title="Bạn có chắc chắn muốn cập nhật góp ý này?"
                description="Hành động này sẽ làm thay đổi góp ý cũ của bạn. Bạn có muốn tiếp tục không?"
                onConfirm={handleResetForm}
                confirmText="Đồng ý"
              >
                <Button
                  type="button"
                  onClick={handleUpdateAnnouncement} // TODO: Implement update functionality
                  variant={"primary"}
                  className="bg-green-primary-400 hover:bg-green-primary-500 flex max-w-lg flex-row items-center gap-2 py-3"
                >
                  <Save className="h-5 w-5" />
                  Cập nhật
                </Button>
              </ConfirmationDialog>
            </div>
          )}
        </form>
      </Form>

      <AlertDialog
        open={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vui lòng xác nhận trước khi gửi</AlertDialogTitle>

            <AlertDialogDescription
              asChild
              className="space-y-2 text-sm leading-relaxed text-gray-600"
            >
              <span>Bạn có chắc chắn muốn đăng thông báo này không?</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={handleCreateAnnouncement}
            >
              Có
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AnnouncementForm;
