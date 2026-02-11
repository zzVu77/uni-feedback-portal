/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileText,
  Info,
  Loader2,
  Paperclip,
  RotateCcw,
  Save,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
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

import { CreateAnnouncementPayload, FileAttachmentDto } from "@/types";
import "suneditor/dist/css/suneditor.min.css";
import { useRouter } from "next/navigation";
import { uploadFileToCloud } from "@/services/upload-service"; // Ensure this service exists
import { toast } from "sonner";

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
  // Validation only applies to NEW files selected by user
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
  initialData?: any;
  onSubmit: (values: CreateAnnouncementPayload) => Promise<void>;
  isPending?: boolean;
};

// Helper to sanitize URL (encode spaces) and ensure numeric size
const sanitizeAttachment = (file: FileAttachmentDto) => ({
  fileName: file.fileName,
  fileUrl: encodeURI(file.fileUrl.trim()),
  fileType: file.fileType || "application/octet-stream", // Fallback if missing
  fileSize: Number(file.fileSize) || 0,
});

const AnnouncementForm = ({
  type = "create",
  initialData,
  onSubmit,
  isPending: isMutationPending,
}: AnnouncementForm) => {
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Manage upload state

  // State to manage key of Editor to force re-render on reset
  const [editorKey, setEditorKey] = useState(0);

  // State to manage EXISTING files (for Edit mode)
  const [existingFiles, setExistingFiles] = useState<FileAttachmentDto[]>([]);

  // Sync initialData to existingFiles only when initialData ID changes
  useEffect(() => {
    if (initialData?.files) {
      const mappedFiles = initialData.files.map((f: any) => ({
        fileName: f.fileName,
        fileUrl: f.fileUrl,
        fileType: f.fileType || "",
        fileSize: f.fileSize || 0,
      }));
      setExistingFiles(mappedFiles);
    }
  }, [initialData?.id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      attachments: [],
    },
  });

  const mapFormValuesToAnnouncementPayload = (
    values: z.infer<typeof formSchema>,
  ): CreateAnnouncementPayload => {
    return {
      title: values.title,
      content: values.content,
    };
  };

  const { isDirty } = form.formState;

  // Logic for CREATE
  const handleCreateAnnouncement = form.handleSubmit(async (values) => {
    setIsUploading(true);
    try {
      let uploadedAttachments: FileAttachmentDto[] = [];
      if (values.attachments && values.attachments.length > 0) {
        const rawAttachments = await Promise.all(
          values.attachments.map((file) => uploadFileToCloud(file)),
        );
        uploadedAttachments = rawAttachments.map(sanitizeAttachment);
      }

      const payload: CreateAnnouncementPayload = {
        ...mapFormValuesToAnnouncementPayload(values),
        files: uploadedAttachments,
      };

      await onSubmit(payload);
      setIsSubmitDialogOpen(false);
      form.reset();
      setExistingFiles([]);
      setEditorKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast.error("Có lỗi xảy ra khi tải tệp lên hoặc tạo thông báo.");
    } finally {
      setIsUploading(false);
    }
  });

  // Logic for UPDATE
  const handleUpdateAnnouncement = form.handleSubmit(async (values) => {
    setIsUploading(true);
    try {
      let newUploadedAttachments: FileAttachmentDto[] = [];
      if (values.attachments && values.attachments.length > 0) {
        const rawAttachments = await Promise.all(
          values.attachments.map((file) => uploadFileToCloud(file)),
        );
        newUploadedAttachments = rawAttachments.map(sanitizeAttachment);
      }

      const processedExistingFiles = existingFiles
        .filter((file) => file.fileUrl && file.fileUrl.trim() !== "")
        .map(sanitizeAttachment);

      const finalFiles = [...processedExistingFiles, ...newUploadedAttachments];

      const payload: CreateAnnouncementPayload = {
        ...mapFormValuesToAnnouncementPayload(values),
        files: finalFiles,
      };
      await onSubmit(payload);
      setTimeout(() => {
        router.replace(`/staff/announcement-management/`);
      }, 1000);
    } catch (error) {
      console.error("Error updating announcement:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông báo.");
    } finally {
      setIsUploading(false);
    }
  });

  const handleResetForm = () => {
    form.reset();
    form.clearErrors();
    if (initialData?.files) {
      const mappedFiles = initialData.files.map((f: any) => ({
        fileName: f.fileName,
        fileUrl: f.fileUrl,
        fileType: f.fileType || "",
        fileSize: f.fileSize || 0,
      }));
      setExistingFiles(mappedFiles);
    } else {
      setExistingFiles([]);
    }
    setEditorKey((prev) => prev + 1);
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

  const handleRemoveExistingFile = (fileUrl: string) => {
    setExistingFiles((prev) => prev.filter((f) => f.fileUrl !== fileUrl));
  };

  const isPending = isMutationPending || isUploading;

  const isExistingFilesChanged =
    type === "edit" &&
    initialData?.files &&
    existingFiles.length !== initialData.files.length;

  return (
    <>
      <Form {...form}>
        <form
          className="h-full w-full py-2"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Header Area */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">
              {type === "edit" ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}
            </h1>
            <p className="mt-1 text-sm text-slate-500 md:text-base">
              Hãy đảm bảo thông tin được trình bày đầy đủ, rõ ràng và chính xác
              để sinh viên có thể tiếp cận và hiểu nội dung thông báo một cách
              nhanh chóng.
            </p>
          </div>

          <ScrollArea className="w-full overflow-y-auto pr-1">
            <div className="flex h-full flex-col gap-6">
              {/* Main Content Card */}
              <div className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white py-6 shadow-sm">
                <div className="border-b border-slate-100 px-6 pb-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                    <FileText className="h-5 w-5 text-blue-500" />
                    Nội dung thông báo
                  </div>
                </div>

                <div className="space-y-6 px-6 pt-0">
                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-slate-700">
                          Tiêu đề thông báo
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tiêu đề thông báo"
                            className="h-11 w-full bg-slate-50 focus-visible:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Content Field */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-slate-700">
                          Nội dung chi tiết
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <SunEditor
                            key={editorKey}
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
                              minHeight: "300px",
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

                  {/* Attachments Section */}
                  <div className="space-y-4 pt-4">
                    <FormLabel className="flex items-center gap-2 font-semibold text-slate-700">
                      <Paperclip className="h-4 w-4" /> Tệp đính kèm
                    </FormLabel>

                    {/* 1. Display EXISTING files (Edit Mode) */}
                    {existingFiles.length > 0 && (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <p className="mb-3 text-sm font-medium text-slate-700">
                          Tệp hiện tại:
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {existingFiles.map((file) => (
                            <div
                              key={file.fileUrl}
                              className="group flex items-center justify-between rounded-md border border-slate-200 bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md"
                            >
                              <div className="flex min-w-0 items-center gap-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-blue-50 text-blue-600">
                                  <FileText className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <a
                                    href={file.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block truncate text-sm font-medium text-slate-700 hover:text-blue-600"
                                  >
                                    {file.fileName}
                                  </a>
                                  {file.fileSize ? (
                                    <p className="text-xs text-slate-400">
                                      {(
                                        Number(file.fileSize) /
                                        1024 /
                                        1024
                                      ).toFixed(2)}{" "}
                                      MB
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
                                onClick={() =>
                                  handleRemoveExistingFile(file.fileUrl)
                                }
                                disabled={isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. New File Input */}
                    <FormField
                      control={form.control}
                      name="attachments"
                      render={({ field }) => (
                        <FormItem>
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
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="py-6">
              <div className="flex items-center justify-center gap-4 lg:justify-end">
                {type === "create" ? (
                  <>
                    <ConfirmationDialog
                      title="Xác nhận làm mới?"
                      description="Hành động này sẽ xóa toàn bộ thông tin bạn đã nhập."
                      onConfirm={handleResetForm}
                      confirmText="Đồng ý"
                    >
                      <Button
                        type="button"
                        disabled={!isDirty || isPending}
                        variant="outline"
                        className="h-11 gap-2 border-slate-300 text-slate-600 hover:bg-slate-50"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Làm mới
                      </Button>
                    </ConfirmationDialog>

                    <Button
                      type="button"
                      disabled={!isDirty || isPending}
                      onClick={handleAttemptSubmit}
                      className="h-11 gap-2 rounded-lg bg-blue-600 px-8 text-white shadow-md hover:bg-blue-700"
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {isUploading
                        ? "Đang tải tệp..."
                        : isPending
                          ? "Đang tạo..."
                          : "Đăng thông báo"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="h-11 gap-2 border-slate-300 text-slate-600"
                    >
                      <X className="h-4 w-4" />
                      Hủy bỏ
                    </Button>
                    <ConfirmationDialog
                      title="Xác nhận cập nhật?"
                      description="Hành động này sẽ làm thay đổi thông báo đã đăng. Bạn có muốn tiếp tục không?"
                      onConfirm={handleUpdateAnnouncement}
                      confirmText="Đồng ý"
                    >
                      <Button
                        type="button"
                        disabled={
                          isPending || (!isDirty && !isExistingFilesChanged)
                        }
                        className="h-11 gap-2 rounded-lg bg-emerald-600 px-8 text-white shadow-md hover:bg-emerald-700"
                      >
                        {isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {isUploading
                          ? "Đang tải tệp..."
                          : isPending
                            ? "Đang cập nhật..."
                            : "Lưu thay đổi"}
                      </Button>
                    </ConfirmationDialog>
                  </>
                )}
              </div>
            </div>
          </ScrollArea>
        </form>
      </Form>

      <AlertDialog
        open={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
      >
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-slate-800">
              Xác nhận đăng thông báo
            </AlertDialogTitle>
            <AlertDialogDescription
              asChild
              className="space-y-3 text-sm leading-relaxed text-slate-600"
            >
              <div>
                <p>
                  Thông báo này sẽ được đăng công khai trên diễn đàn và sinh
                  viên có thể tiếp cận ngay lập tức. Bạn vẫn có thể chỉnh sửa
                  nội dung sau khi đăng.
                </p>
                <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4 text-xs text-blue-700">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    Lưu ý: Nội dung thông báo nên rõ ràng, súc tích và đính kèm
                    đầy đủ các tệp tin liên quan để sinh viên dễ dàng theo dõi.
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending} className="rounded-lg">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={handleCreateAnnouncement}
              className="rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? "Đang xử lý..." : "Xác nhận đăng"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AnnouncementForm;
