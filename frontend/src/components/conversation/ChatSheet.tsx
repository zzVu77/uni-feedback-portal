"use client";

import { useUser } from "@/context/UserContext";
import { ACCEPTED_FILE_TYPES } from "@/constants/data";
import { Message } from "@/types/conversation";
import {
  CheckCircle,
  FileIcon,
  Paperclip,
  SendHorizontal,
  X,
  UserCircle2,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ConfirmationDialog from "../common/ConfirmationDialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Textarea } from "../ui/textarea";

interface ChatSheetProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  messages: Message[];
  onSendMessage: (content: string, file?: File | null) => Promise<void>;
  threadTitle: string;
  role: "student" | "staff";
  isConversationOpen: boolean;
  onCloseConversation: () => Promise<void>;
  isReadOnly?: boolean;
}

const ChatSheet = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  threadTitle,
  role,
  isConversationOpen,
  onCloseConversation,
  isReadOnly = false,
}: ChatSheetProps) => {
  const { user } = useUser();
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine if the current user is a participant (creator or student)
  const isParticipant =
    role === "student" ||
    (messages.length > 0 && messages[0].user.id === user?.id);
  const effectiveIsReadOnly = isReadOnly || !isParticipant;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        toast.error(
          "Định dạng tệp không được hỗ trợ. Vui lòng chọn ảnh, PDF, DOCX hoặc TXT.",
        );
        e.target.value = "";
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error("Kích thước tệp không được vượt quá 100MB.");
        e.target.value = "";
        return;
      }

      setSelectedFile(file);
    }
    // Reset value to allow selecting the same file again if needed
    e.target.value = "";
  };

  const handleSend = async () => {
    if ((!inputValue.trim() && !selectedFile) || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(inputValue, selectedFile);
      setInputValue("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Gửi tin nhắn thất bại. Vui lòng thử lại!");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="flex w-full flex-col border-l-0 p-0 shadow-2xl sm:max-w-[500px]"
      >
        <SheetHeader className="border-b border-slate-100 bg-white/80 p-5 pb-4 text-left backdrop-blur-md">
          <div className="mr-6 flex items-center justify-between gap-4">
            <div className="flex-1">
              <SheetTitle className="mb-1 line-clamp-1 text-lg font-bold text-slate-800">
                {threadTitle}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-1.5 text-xs font-medium">
                <span
                  className={`h-2 w-2 rounded-full ${
                    isConversationOpen ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
                <span
                  className={
                    isConversationOpen ? "text-emerald-600" : "text-rose-600"
                  }
                >
                  {isConversationOpen ? "Đang mở" : "Đã kết thúc"}
                </span>
              </SheetDescription>
            </div>
            {role === "staff" && isConversationOpen && !effectiveIsReadOnly && (
              <ConfirmationDialog
                title="Kết thúc cuộc trao đổi?"
                description="Hành động này sẽ đánh dấu cuộc hội thoại là đã hoàn thành và không thể gửi thêm tin nhắn."
                onConfirm={onCloseConversation}
                confirmText="Xác nhận"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100 hover:text-rose-700"
                >
                  <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                  Kết thúc
                </Button>
              </ConfirmationDialog>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden bg-slate-50/50">
          <ScrollArea ref={scrollRef} className="h-full px-5 py-4">
            <div className="flex flex-col gap-5 pb-4">
              {messages.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-slate-400">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <UserCircle2 className="h-6 w-6 text-slate-300" />
                  </div>
                  <span className="text-sm font-medium">
                    Chưa có tin nhắn nào. Bắt đầu cuộc trò chuyện!
                  </span>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.user.id === user?.id;
                  const isStaffAssistant = msg.user.role === "STAFF_ASSISTANT";
                  const roleSuffix = isStaffAssistant ? " (CTV)" : "";
                  const senderName = isMe
                    ? "Bạn"
                    : `${msg.user.fullName || "Người dùng"}${roleSuffix}`;
                  const timeString = new Date(msg.createdAt).toLocaleTimeString(
                    "vi-VN",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  );

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col gap-1.5 ${
                        isMe ? "items-end" : "items-start"
                      }`}
                    >
                      {/* User Info Header */}
                      <div
                        className={`flex items-center gap-2 px-1 text-xs font-medium ${isMe ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <span className="text-slate-700">{senderName}</span>
                        <span className="text-[10px] text-slate-400">
                          {timeString}
                        </span>
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`max-w-[85%] px-4 py-2.5 text-[15px] leading-relaxed shadow-sm ${
                          isMe
                            ? "rounded-[20px] rounded-tr-[4px] bg-indigo-600 text-white"
                            : "rounded-[20px] rounded-tl-[4px] border border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        {msg.content}

                        {/* Attachments rendering */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-3 flex flex-col gap-2">
                            {msg.attachments.map((file, idx) => {
                              const isImage =
                                /\.(jpg|jpeg|png|webp|gif)$/i.test(
                                  file.fileUrl || "",
                                );
                              return (
                                <a
                                  key={idx}
                                  href={file.fileUrl || ""}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-2.5 rounded-xl border p-2 transition-colors ${
                                    isMe
                                      ? "border-indigo-400 bg-indigo-500/50 hover:bg-indigo-500/80"
                                      : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                                  }`}
                                >
                                  {isImage ? (
                                    <img
                                      src={file.fileUrl || ""}
                                      alt={file.fileName}
                                      className="max-h-[200px] w-full rounded-lg object-cover"
                                    />
                                  ) : (
                                    <>
                                      <div
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isMe ? "bg-indigo-400 text-white" : "bg-slate-200 text-slate-500"}`}
                                      >
                                        <FileIcon className="h-4 w-4" />
                                      </div>
                                      <span className="truncate text-sm font-medium">
                                        {file.fileName || "Tệp đính kèm"}
                                      </span>
                                    </>
                                  )}
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {effectiveIsReadOnly ? (
          <div className="border-t border-slate-100 bg-slate-50 p-5 text-center">
            <p className="text-[13px] font-medium text-slate-400">
              Bạn không có quyền tham gia cuộc trao đổi này.
            </p>
          </div>
        ) : isConversationOpen ? (
          <div className="border-t border-slate-100 bg-white p-4 shadow-[0_-4px_24px_-12px_rgba(0,0,0,0.05)]">
            {/* File Preview Chip */}
            {selectedFile && (
              <div className="mb-3 flex w-fit max-w-[80%] items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 py-1.5 pr-2 pl-3 shadow-sm">
                <FileIcon className="h-4 w-4 text-indigo-500" />
                <span className="truncate text-xs font-semibold text-indigo-700">
                  {selectedFile.name}
                </span>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="ml-1 flex h-5 w-5 items-center justify-center rounded-full text-indigo-400 transition-colors hover:bg-indigo-200 hover:text-indigo-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            <div className="flex items-end gap-2">
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept={ACCEPTED_FILE_TYPES.join(",")}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSending}
                className="h-11 w-11 shrink-0 rounded-full text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
              >
                <Paperclip className="h-5 w-5" />
              </Button>

              <Textarea
                placeholder="Nhập tin nhắn..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="max-h-[120px] min-h-[44px] flex-1 resize-none rounded-[22px] border-slate-200 bg-slate-50 px-4 py-3 text-[14px] leading-relaxed transition-colors focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-indigo-500"
                disabled={isSending}
              />
              <Button
                size="icon"
                disabled={(!inputValue.trim() && !selectedFile) || isSending}
                onClick={() => void handleSend()}
                className="h-11 w-11 shrink-0 rounded-full bg-indigo-600 text-white shadow-md shadow-indigo-600/20 transition-transform hover:scale-105 hover:bg-indigo-700 disabled:hover:scale-100"
              >
                <SendHorizontal className="ml-0.5 h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-t border-slate-100 bg-slate-50 p-5 text-center">
            <p className="text-[13px] font-medium text-slate-400">
              Cuộc trò chuyện này đã được đóng lại.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ChatSheet;
