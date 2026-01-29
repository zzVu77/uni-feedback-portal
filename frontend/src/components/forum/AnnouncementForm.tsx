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
  Loader2,
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
  // We map the initialData.files structure to FileAttachmentDto structure
  const [existingFiles, setExistingFiles] = useState<FileAttachmentDto[]>([]);

  // Sync initialData to existingFiles only when initialData ID changes (to avoid re-sync on parent re-renders)
  useEffect(() => {
    if (initialData?.files) {
      // Map AnnouncementDetailType files to FileAttachmentDto
      const mappedFiles = initialData.files.map((f: any) => ({
        fileName: f.fileName,
        fileUrl: f.fileUrl,
        fileType: f.fileType || "", // Handle potential missing fields
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
      attachments: [], // Always empty initially, for new files
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
      // 1. Upload NEW files
      let uploadedAttachments: FileAttachmentDto[] = [];
      if (values.attachments && values.attachments.length > 0) {
        const rawAttachments = await Promise.all(
          values.attachments.map((file) => uploadFileToCloud(file)),
        );
        uploadedAttachments = rawAttachments.map(sanitizeAttachment);
      }

      // 2. Prepare Payload
      const payload: CreateAnnouncementPayload = {
        ...mapFormValuesToAnnouncementPayload(values),
        files: uploadedAttachments,
      };

      // 3. Submit
      await onSubmit(payload);

      setIsSubmitDialogOpen(false);
      // Reset form and increase key to force re-mount SunEditor
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
      // 1. Upload NEW files
      let newUploadedAttachments: FileAttachmentDto[] = [];
      if (values.attachments && values.attachments.length > 0) {
        const rawAttachments = await Promise.all(
          values.attachments.map((file) => uploadFileToCloud(file)),
        );
        newUploadedAttachments = rawAttachments.map(sanitizeAttachment);
      }

      // 2. Process EXISTING files (sanitize and filter)
      const processedExistingFiles = existingFiles
        .filter((file) => file.fileUrl && file.fileUrl.trim() !== "")
        .map(sanitizeAttachment);

      // 3. Merge files
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
    // Reset existing files to initial state
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
  // const canSubmit = isDirty || isExistingFilesChanged;

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
                    <FormLabel>
                      Tiêu đề thông báo<span className="text-red-500">*</span>
                    </FormLabel>
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
                      <FormLabel>
                        Nội dung thông báo
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        {/* Sử dụng key={editorKey} để reset editor */}
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

              {/* Attachments Section */}
              <div className="space-y-4">
                {/* 1. Display EXISTING files (Edit Mode) */}
                {existingFiles.length > 0 && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      Tệp đính kèm hiện tại:
                    </p>
                    <div className="space-y-2">
                      {existingFiles.map((file) => (
                        <div
                          key={file.fileUrl}
                          className="flex items-center justify-between rounded-md border border-gray-100 bg-white p-2 text-sm shadow-sm"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="h-4 w-4 shrink-0 text-blue-500" />
                            <a
                              href={file.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="truncate text-blue-600 hover:underline"
                            >
                              {file.fileName}
                            </a>
                            {/* Check if size exists before dividing */}
                            {file.fileSize ? (
                              <span className="text-xs text-gray-400">
                                (
                                {(Number(file.fileSize) / 1024 / 1024).toFixed(
                                  2,
                                )}{" "}
                                MB)
                              </span>
                            ) : null}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
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
                      <FormLabel>
                        {type === "edit" && existingFiles.length > 0
                          ? "Thêm tệp đính kèm mới (nếu có)"
                          : "Tệp đính kèm (nếu có)"}
                      </FormLabel>
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
                  disabled={!isDirty || isPending}
                  variant={"cancel"}
                  className="flex max-w-lg flex-row items-center gap-2 py-3"
                >
                  <RotateCcw className="h-5 w-5" />
                  Làm mới
                </Button>
              </ConfirmationDialog>

              <Button
                type="button"
                disabled={!isDirty || isPending}
                variant={"primary"}
                onClick={handleAttemptSubmit}
                className="flex max-w-lg flex-row items-center gap-2 py-3 shadow-md"
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
                {isUploading
                  ? "Đang tải tệp..."
                  : isPending
                    ? "Đang tạo..."
                    : "Tạo"}
              </Button>
            </div>
          ) : (
            <div className="border-neutral-light-primary-300 flex flex-row items-center justify-center gap-4 border-t pt-2 lg:justify-end">
              <Button
                type="button"
                variant={"cancel"}
                onClick={handleCancel}
                className="flex max-w-lg flex-row items-center gap-2 py-3"
              >
                <X className="h-5 w-5" />
                Hủy
              </Button>
              <ConfirmationDialog
                title="Bạn có chắc chắn muốn cập nhật thông báo này?"
                description="Hành động này sẽ làm thay đổi thông báo cũ. Bạn có muốn tiếp tục không?"
                onConfirm={handleUpdateAnnouncement}
                confirmText="Đồng ý"
              >
                <Button
                  type="button"
                  // Disable if pending or no changes (checking dirty + files change)
                  disabled={isPending || (!isDirty && !isExistingFilesChanged)}
                  variant={"primary"}
                  className="bg-green-primary-400 hover:bg-green-primary-500 flex max-w-lg flex-row items-center gap-2 py-3"
                >
                  {isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  {isUploading
                    ? "Đang tải tệp..."
                    : isPending
                      ? "Đang cập nhật..."
                      : "Cập nhật"}
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
            <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={handleCreateAnnouncement}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? "Đang xử lý..." : "Có"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AnnouncementForm;
