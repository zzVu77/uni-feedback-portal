/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CLARIFICATION_QUERY_KEYS,
  useCreateMessageInConversation,
  useGetClarificationsDetailById,
} from "@/hooks/queries/useClarificationQueries";
import { ConversationSummary, FileAttachmentDto } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  MessageCircleOff,
  Paperclip,
  SendHorizontal,
  X,
} from "lucide-react"; // Import Paperclip
import React, { useEffect, useRef, useState } from "react";
import ConfirmationDialog from "../common/ConfirmationDialog";
import StatusBadge from "../common/StatusBadge";
import MessageItem from "./MessageItem";
// Import Upload Helper
import { uploadFileToCloud } from "@/services/upload-service";

type ConversationItemProps = {
  data: ConversationSummary[];
  role: "student" | "staff";
  onClose: (id: string) => void | Promise<void>;
};

const ConversationItem = ({ data, role, onClose }: ConversationItemProps) => {
  const [replyText, setReplyText] = useState("");
  // New state for handling file attachments in reply
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [conversationId, setConversationId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for hidden file input

  const { data: conversationDetail } =
    useGetClarificationsDetailById(conversationId);
  const { mutateAsync: createMessageInConversation } =
    useCreateMessageInConversation(conversationId);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationDetail]);

  const handleSendReply = async () => {
    if (!replyText.trim() && selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      let uploadedAttachments: FileAttachmentDto[] = [];
      // Upload files if any
      if (selectedFiles.length > 0) {
        const rawAttachments = await Promise.all(
          selectedFiles.map((file) => uploadFileToCloud(file)),
        );
        uploadedAttachments = rawAttachments.map((file) => ({
          fileName: file.fileName,
          fileUrl: encodeURI(file.fileUrl.trim()),
          fileType: file.fileType,
          fileSize: Number(file.fileSize),
        }));
      }

      await createMessageInConversation({
        content: replyText,
        attachments: uploadedAttachments,
      });

      await queryClient.invalidateQueries({
        queryKey: [CLARIFICATION_QUERY_KEYS, conversationId],
      });

      // Reset state
      setReplyText("");
      setSelectedFiles([]);
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Prevent default only if just Enter
      e.preventDefault();
      await handleSendReply();
    }
  };

  const handleOnChangeConversation = (id: string) => {
    setConversationId(id);
    // Clear draft when switching conversations
    setReplyText("");
    setSelectedFiles([]);
  };

  const handleCloseConversation = async (id: string) => {
    await onClose(id);
    await queryClient.invalidateQueries({
      queryKey: [CLARIFICATION_QUERY_KEYS, conversationId],
    });
  };

  // Logic to remove a selected file before sending
  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Logic to handle file selection via hidden input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      // Basic limit check or merge
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      // Reset value so same file can be selected again if needed
      e.target.value = "";
    }
  };

  return (
    <>
      <Accordion type="single" className="w-full" collapsible>
        <div className="flex flex-col gap-4">
          {data &&
            data.map((conversation) => (
              <AccordionItem
                value={conversation.id}
                className="overflow-hidden rounded-lg border border-neutral-200 shadow-sm"
                key={conversation.id}
              >
                <AccordionTrigger
                  className="cursor-pointer bg-neutral-50 px-4 py-3 text-left transition-colors hover:bg-neutral-100 hover:no-underline"
                  onClick={() => handleOnChangeConversation(conversation.id)}
                >
                  <div className="flex w-full flex-col items-start gap-1">
                    <div className="flex w-full flex-col items-start justify-between gap-1 py-1">
                      <div className="flex w-full flex-row items-center justify-between gap-2">
                        {conversation.isClosed ? (
                          <StatusBadge type="CLOSED" />
                        ) : (
                          <StatusBadge type="OPENING" />
                        )}
                        {role === "staff" && !conversation.isClosed && (
                          <ConfirmationDialog
                            title="Bạn có muốn kết thúc cuộc hội thoại này?"
                            description="Hành động này sẽ đánh dấu cuộc hội thoại là đã đóng và không thể tiếp tục trao đổi."
                            onConfirm={() => {
                              void handleCloseConversation(conversation.id);
                            }}
                            confirmText="Đồng ý"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 rounded-3xl border-red-200 px-2 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={(e) => e.stopPropagation()} // Prevent accordion toggle
                            >
                              <MessageCircleOff className="mr-1 h-3 w-3" />
                              Kết thúc hội thoại
                            </Button>
                          </ConfirmationDialog>
                        )}
                      </div>
                      <span className="text-[15px] font-semibold text-neutral-800">
                        {conversation.subject ||
                          "Request for additional information"}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex w-full flex-col border-t border-neutral-100 bg-white p-0">
                  <div className="flex max-h-[300px] flex-col gap-4 overflow-y-auto px-4 py-4">
                    {conversationDetail &&
                    conversationDetail.messages &&
                    conversationDetail.messages.length > 0 ? (
                      <>
                        {conversationDetail.messages.map((message, index) => (
                          <MessageItem
                            key={index}
                            content={message.content}
                            user={message.user}
                            createdAt={message.createdAt}
                            id={message.id}
                            attachments={message.attachments} // Pass attachments
                          />
                        ))}
                        {conversation.id === conversationId && (
                          <div ref={messagesEndRef} />
                        )}
                      </>
                    ) : (
                      <p className="text-center text-sm text-neutral-400 italic">
                        Chưa có tin nhắn nào.
                      </p>
                    )}
                  </div>

                  {!conversation.isClosed && (
                    <div className="flex flex-col gap-2 border-t border-neutral-100 bg-neutral-50 p-3">
                      {/* Selected Files Preview Area */}
                      {selectedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 px-1">
                          {selectedFiles.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs shadow-sm"
                            >
                              <span className="max-w-[150px] truncate text-neutral-600">
                                {file.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(idx)}
                                className="text-neutral-400 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {/* Attachment Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          <Paperclip className="h-5 w-5" />
                        </Button>
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                        />

                        <Input
                          placeholder="Nhập nội dung trao đổi..."
                          className="flex-1 border-neutral-300 bg-white focus-visible:ring-blue-500"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={handleKeyDown}
                          disabled={isUploading}
                        />
                        <Button
                          size="icon"
                          className="h-10 w-10 shrink-0 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                          onClick={handleSendReply}
                          disabled={
                            (!replyText.trim() && selectedFiles.length === 0) ||
                            isUploading
                          }
                        >
                          {isUploading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <SendHorizontal className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
        </div>
      </Accordion>
    </>
  );
};

export default ConversationItem;
