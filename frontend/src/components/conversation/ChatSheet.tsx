"use client";

import { useUser } from "@/context/UserContext";
import { Message } from "@/types/conversation";
import { CheckCircle, SendHorizontal } from "lucide-react";
import React, { useEffect, useRef } from "react";
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
  onSendMessage: (content: string) => Promise<void>;
  threadTitle: string;
  role: "student" | "staff";
  isConversationOpen: boolean;
  onCloseConversation: () => Promise<void>;
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
}: ChatSheetProps) => {
  const { user } = useUser();
  const [inputValue, setInputValue] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(inputValue);
      setInputValue("");
    } catch (error) {
      console.error("Failed to send message:", error);
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
        className="flex w-full flex-col p-0 sm:max-w-[500px]"
      >
        <SheetHeader className="border-b border-slate-200 p-6 text-left">
          <div className="mr-6 flex items-center justify-center gap-4">
            <div className="flex-1">
              <SheetTitle className="mb-2 text-xl font-semibold text-slate-900">
                {threadTitle}
              </SheetTitle>
              <SheetDescription className="text-[12px] text-slate-500">
                Trạng thái:{" "}
                <span
                  className={
                    isConversationOpen
                      ? "font-medium text-emerald-600"
                      : "font-medium text-red-600"
                  }
                >
                  {isConversationOpen ? "Đang mở" : "Đã đóng"}
                </span>
              </SheetDescription>
            </div>
            {role === "staff" && isConversationOpen && (
              <ConfirmationDialog
                title="Kết thúc cuộc trao đổi?"
                description="Hành động này sẽ đánh dấu cuộc hội thoại là đã hoàn thành và không thể gửi thêm tin nhắn."
                onConfirm={onCloseConversation}
                confirmText="Xác nhận"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-lg border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                  Đóng trao đổi
                </Button>
              </ConfirmationDialog>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden bg-white">
          <ScrollArea ref={scrollRef} className="h-full px-6 py-4">
            <div className="flex flex-col gap-4">
              {messages.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-slate-400">
                  Chưa có tin nhắn nào.
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.user.id === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col gap-1 ${
                        isMe ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-2 text-[14px] shadow-sm ${
                          isMe
                            ? "rounded-2xl rounded-tr-none bg-blue-600 text-white"
                            : "rounded-2xl rounded-tl-none bg-slate-100 text-slate-800"
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="px-1 text-[10px] text-slate-400">
                        {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {isConversationOpen ? (
          <div className="border-t border-slate-200 bg-slate-50 p-4">
            <div className="flex items-end gap-2">
              <Textarea
                placeholder="Nhập tin nhắn..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="max-h-[120px] min-h-[44px] resize-none bg-white p-3 text-[14px]"
                disabled={isSending}
              />
              <Button
                size="icon"
                disabled={!inputValue.trim() || isSending}
                onClick={() => void handleSend()}
                className="h-11 w-11 shrink-0 bg-blue-600 hover:bg-blue-700"
              >
                <SendHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-t border-slate-100 bg-slate-50/50 p-4 text-center">
            <p className="text-sm text-slate-400">
              Cuộc trao đổi này đã kết thúc.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ChatSheet;
