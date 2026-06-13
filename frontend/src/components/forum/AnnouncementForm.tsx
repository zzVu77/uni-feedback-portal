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

import { ACCEPTED_FILE_TYPES } from "@/constants/data";
import { uploadFileToCloud } from "@/services/upload-service"; // Ensure this service exists
import { CreateAnnouncementPayload, FileAttachmentDto } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import "suneditor/dist/css/suneditor.min.css";
import { useUser } from "@/context/UserContext";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
  loading: () => <p>Đang tải trình soạn thảo...</p>,
});

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
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
  fileKey: file.fileKey,
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
  const { user } = useUser();
  // State to manage key of Editor to force re-render on reset
  const [editorKey, setEditorKey] = useState(0);

  // State to manage EXISTING files (for Edit mode)
  const [existingFiles, setExistingFiles] = useState<FileAttachmentDto[]>([]);

  // Sync initialData to existingFiles only when initialData ID changes
  // useEffect(() => {
  //   if (initialData?.files) {
  //     form.reset({
  //       title: initialData.title || "",
  //       content: initialData.content || "",
  //       attachments: [],
  //     });
  //     const mappedFiles = initialData.files.map((f: any) => ({
  //       fileName: f.fileName,
  //       fileKey: f.fileKey,
  //       fileUrl: f.fileUrl,
  //       fileType: f.fileType || "",
  //       fileSize: f.fileSize || 0,
  //     }));
  //     setExistingFiles(mappedFiles);
  //   }
  // }, [initialData?.id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      attachments: [],
    },
  });

  // Sync initialData to form and existingFiles
  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title || "",
        content: initialData.content || "",
        attachments: [],
      });
      if (initialData.files) {
        const mappedFiles = initialData.files.map((f: any) => ({
          fileName: f.fileName,
          fileUrl: f.fileUrl,
          fileType: f.fileType || "",
          fileSize: f.fileSize || 0,
          fileKey: f.fileKey || "",
        }));
        setExistingFiles(mappedFiles);
      }
    }
  }, [initialData, form]);

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
          values.attachments.map((file) =>
            uploadFileToCloud(file, "ANNOUNCEMENT"),
          ),
        );
        uploadedAttachments = rawAttachments.map(sanitizeAttachment);
      }

      const payload: CreateAnnouncementPayload = {
        ...mapFormValuesToAnnouncementPayload(values),
        files: uploadedAttachments,
      };

      await onSubmit(payload);
      setTimeout(() => {
        if (user?.role === "STAFF_ASSISTANT") {
          router.replace(`/staff-assistant/announcement-management/`);
        } else {
          router.replace(`/staff/announcement-management/`);
        }
      }, 1000);
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
          values.attachments.map((file) =>
            uploadFileToCloud(file, "ANNOUNCEMENT"),
          ),
        );
        newUploadedAttachments = rawAttachments.map(sanitizeAttachment);
      }

      const processedExistingFiles = existingFiles
        .filter((file) => file.fileKey && file.fileKey.trim() !== "")
        .map(sanitizeAttachment);

      const finalFiles = [...processedExistingFiles, ...newUploadedAttachments];

      const payload: CreateAnnouncementPayload = {
        ...mapFormValuesToAnnouncementPayload(values),
        files: finalFiles,
      };
      await onSubmit(payload);
      setTimeout(() => {
        if (user?.role === "STAFF_ASSISTANT") {
          router.replace(`/staff-assistant/announcement-management/`);
        } else {
          router.replace(`/staff/announcement-management/`);
        }
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
        fileKey: f.fileKey,
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
    if (user?.role === "STAFF_ASSISTANT") {
      router.push("/staff-assistant/announcement-management");
    } else {
      router.push("/staff/announcement-management");
    }
  };

  const handleRemoveExistingFile = (fileKey: string) => {
    setExistingFiles((prev) => prev.filter((f) => f.fileKey !== fileKey));
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
          className="flex h-full w-full flex-col gap-6"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Header Area */}
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between lg:items-center">
            <div className="flex-1 space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                {type === "edit" ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-slate-500 sm:text-base">
                Hãy đảm bảo thông tin được trình bày đầy đủ, rõ ràng và chính
                xác để sinh viên có thể tiếp cận và hiểu nội dung thông báo một
                cách nhanh chóng.
              </p>
            </div>
          </div>

          <ScrollArea className="w-full flex-1 overflow-y-auto pr-3">
            <div className="flex h-full flex-col gap-6 pb-6">
              {/* Main Content Card */}
              <div className="flex flex-col gap-6 rounded-[24px] border border-white/60 bg-white/70 py-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                <div className="border-b border-indigo-100/50 px-6 pb-4 sm:px-8">
                  <div className="flex items-center gap-3 text-lg font-bold text-slate-800">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
                      <FileText className="h-5 w-5 text-indigo-600" />
                    </div>
                    Nội dung thông báo
                  </div>
                </div>

                <div className="space-y-8 px-6 pt-2 sm:px-8">
                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-slate-700">
                          Tiêu đề thông báo
                          <span className="ml-1 text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tiêu đề thông báo..."
                            className="h-12 w-full rounded-xl border-slate-200 bg-white/50 px-4 text-base shadow-sm transition-all hover:bg-white focus-visible:ring-indigo-500"
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
                          <span className="ml-1 text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/50 shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500 hover:bg-white">
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
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Attachments Section */}
                  <div className="space-y-4 pt-2">
                    <FormLabel className="flex items-center gap-3 font-bold text-slate-700">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50">
                        <Paperclip className="h-4 w-4 text-indigo-600" />
                      </div>
                      Tệp đính kèm
                    </FormLabel>

                    {/* 1. Display EXISTING files (Edit Mode) */}
                    {existingFiles.length > 0 && (
                      <div className="rounded-[20px] border border-indigo-100/50 bg-indigo-50/30 p-5">
                        <p className="mb-4 text-sm font-semibold text-slate-700">
                          Tệp hiện tại:
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {existingFiles.map((file) => (
                            <div
                              key={file.fileKey}
                              className="group flex items-center justify-between rounded-xl border border-white/60 bg-white/70 p-3 shadow-sm backdrop-blur-sm transition-all hover:border-indigo-200 hover:shadow-md"
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                  <FileText className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <a
                                    href={file.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block truncate text-sm font-semibold text-slate-700 transition-colors hover:text-indigo-600"
                                  >
                                    {file.fileName}
                                  </a>
                                  {file.fileSize ? (
                                    <p className="mt-0.5 text-xs font-medium text-slate-400">
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
                                className="h-9 w-9 shrink-0 rounded-full text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
                                onClick={() =>
                                  handleRemoveExistingFile(file.fileKey)
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
            <div className="py-2">
              <div className="flex flex-col-reverse items-center justify-center gap-4 sm:flex-row lg:justify-end">
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
                        className="h-12 w-full gap-2 rounded-full border-slate-200 bg-white/80 font-semibold text-slate-600 shadow-sm backdrop-blur-md transition-all hover:bg-slate-50 hover:text-slate-800 sm:w-auto"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Làm mới
                      </Button>
                    </ConfirmationDialog>

                    <Button
                      type="button"
                      disabled={!isDirty || isPending}
                      onClick={handleAttemptSubmit}
                      className="bg-blue-primary-400 hover:bg-blue-primary-600 h-12 w-full gap-2 rounded-full px-8 font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-[0.98] sm:w-auto"
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
                          : "Đăng thông báo"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="h-12 w-full gap-2 rounded-full border-slate-200 bg-white/80 font-semibold text-slate-600 shadow-sm backdrop-blur-md transition-all hover:bg-slate-50 hover:text-slate-800 sm:w-auto"
                    >
                      <X className="h-5 w-5" />
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
                        className="h-12 w-full gap-2 rounded-full bg-emerald-600 px-8 font-semibold text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98] sm:w-auto"
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
        <AlertDialogContent className="rounded-[24px] border border-white/60 bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-800">
              Xác nhận đăng thông báo
            </AlertDialogTitle>
            <AlertDialogDescription
              asChild
              className="space-y-4 text-sm leading-relaxed text-slate-600"
            >
              <div>
                <p>
                  Thông báo này sẽ được đăng công khai trên diễn đàn và sinh
                  viên có thể tiếp cận ngay lập tức. Bạn vẫn có thể chỉnh sửa
                  nội dung sau khi đăng.
                </p>
                <div className="flex items-start gap-3 rounded-2xl bg-amber-100 p-4 text-amber-700 shadow-sm">
                  <Info className="mt-0.5 h-5 w-5 shrink-0" />
                  <p className="leading-relaxed font-medium">
                    Lưu ý: Nội dung thông báo nên rõ ràng, súc tích và đính kèm
                    đầy đủ các tệp tin liên quan để sinh viên dễ dàng theo dõi.
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-2">
            <AlertDialogCancel
              disabled={isPending}
              className="h-11 rounded-full border-slate-200 px-6 font-semibold shadow-sm hover:bg-slate-50"
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={handleCreateAnnouncement}
              className="bg-blue-primary-400 hover:bg-blue-primary-600 h-11 rounded-full px-6 font-semibold text-white shadow-md transition-all hover:shadow-lg"
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
