/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  CLARIFICATION_QUERY_KEYS,
  useCloseConversationById,
  useCreateNewConversation,
  useGetAllClarificationsByFeedbackId,
  useGetClarificationsDetailById,
} from "@/hooks/queries/useClarificationQueries";
import { createMessageInConversation } from "@/services/clarification-service";
import { ConversationBodyParams } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  ChevronRight,
  Loader2,
  MessageCircleMore,
  Plus,
  Send,
  User,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import StatusBadge from "../common/StatusBadge";
import ChatSheet from "./ChatSheet";

// --- Schema (Không còn attachments) ---
const newConversationSchema = z.object({
  subject: z.string().min(1, "Vui lòng nhập tiêu đề cuộc trao đổi"),
  initialMessage: z.string().min(1, "Vui lòng nhập nội dung tin nhắn"),
});

type NewConversationFormValues = z.infer<typeof newConversationSchema>;

interface NewConversationFormProps {
  onCancel: () => void;
  onSubmit: (values: ConversationBodyParams) => Promise<void>;
  isPending: boolean;
}

const NewConversationForm = ({
  onCancel,
  onSubmit,
  isPending,
}: NewConversationFormProps) => {
  const form = useForm<NewConversationFormValues>({
    resolver: zodResolver(newConversationSchema),
    defaultValues: {
      subject: "",
      initialMessage: "",
    },
  });

  const { isDirty } = form.formState;

  // Handler submit đơn giản, không upload file
  const handleFormSubmit = async (values: NewConversationFormValues) => {
    // Payload chỉ gồm text
    const payload: ConversationBodyParams = {
      feedbackId: "", // Parent sẽ inject
      subject: values.subject,
      initialMessage: values.initialMessage,
    };
    await onSubmit(payload);
  };

  return (
    <div className="w-full border-t border-neutral-200 px-2 py-4">
      <h3 className="mb-4 text-[16px] font-semibold">Cuộc hội thoại mới</h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Subject */}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-neutral-700">
                  Tiêu đề
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập tiêu đề cuộc trao đổi"
                    {...field}
                    className="bg-white"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message */}
          <FormField
            control={form.control}
            name="initialMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-neutral-700">
                  Tin nhắn
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập nội dung tin nhắn..."
                    className="min-h-[100px] resize-none bg-white"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions */}
          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-100"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
              disabled={!isDirty || isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isPending ? "Đang gửi..." : "Bắt đầu cuộc hội thoại"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

// --- Component: ConversationSection (Main) ---
interface ConversationSectionProps {
  role: "student" | "staff";
  currentFeedbackStatus: string;
  isForwarded?: boolean;
}
const ConversationSection = ({
  role,
  currentFeedbackStatus,
  isForwarded = false,
}: ConversationSectionProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const params = useParams();
  const feedbackId = params.id as string;

  // Queries
  const defaultFilters = { feedbackId, page: 1, pageSize: 50 };
  const { data: listConversation } =
    useGetAllClarificationsByFeedbackId(defaultFilters);
  const queryClient = useQueryClient();
  const { mutateAsync: createConversation, isPending } =
    useCreateNewConversation();

  // Query for Selected Conversation Details
  const { data: conversationDetail } = useGetClarificationsDetailById(
    selectedConversationId || "",
  );

  // Mutation for Sending Message (Generic)
  const { mutateAsync: sendMessage } = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      createMessageInConversation(id, { content }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [CLARIFICATION_QUERY_KEYS, selectedConversationId],
      });
    },
  });

  // Derived State
  const conversations = listConversation?.results || [];
  const hasConversations = conversations.length > 0;
  const allConversationsClosed = conversations.every((c) => c.isClosed);

  const canCreateNew =
    (!hasConversations || allConversationsClosed) &&
    role === "staff" &&
    currentFeedbackStatus !== "RESOLVED" &&
    currentFeedbackStatus !== "REJECTED";

  const { mutateAsync: closeConversation } = useCloseConversationById();

  // Handler Create: Inject feedbackId
  const handleCreateSubmit = async (payload: ConversationBodyParams) => {
    const finalPayload = {
      ...payload,
      feedbackId: feedbackId,
    };

    try {
      await createConversation(finalPayload);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [CLARIFICATION_QUERY_KEYS, defaultFilters],
        }),
      ]);
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId) return;
    await sendMessage({ id: selectedConversationId, content });
  };

  const handleCloseConversation = async () => {
    if (!selectedConversationId) return;
    try {
      await closeConversation(selectedConversationId);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [CLARIFICATION_QUERY_KEYS, defaultFilters],
        }),
        queryClient.invalidateQueries({
          queryKey: [CLARIFICATION_QUERY_KEYS, selectedConversationId],
        }),
      ]);
    } catch (error) {
      console.error("Failed to close conversation:", error);
    }
  };

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId,
  );

  return (
    <div className="flex max-h-[650px] min-h-[250px] w-full flex-col gap-1 overflow-x-hidden overflow-y-auto rounded-xl border border-neutral-200 bg-white p-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-row items-center justify-between border-b border-transparent pb-2">
        <div className="flex flex-row items-center gap-2">
          <MessageCircleMore className="h-6 w-6 text-neutral-700" />
          <h2 className="text-[18px] font-medium text-neutral-700">Trao đổi</h2>
        </div>
        {canCreateNew && !isForwarded && !isCreating && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1 border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            <Plus className="h-4 w-4" />
            Mới
          </Button>
        )}
      </div>

      <ScrollArea className="w-full overflow-y-auto">
        <div className="flex h-full max-h-[50vh] flex-col gap-4 py-1 pr-4">
          {isCreating ? (
            <NewConversationForm
              onCancel={() => setIsCreating(false)}
              onSubmit={handleCreateSubmit}
              isPending={isPending}
            />
          ) : (
            <>
              {!hasConversations ? (
                <div className="flex flex-col items-center justify-center gap-3 py-10">
                  <MessageCircleMore className="h-6 w-6 text-neutral-400" />
                  <span className="text-center text-[15px] font-medium text-neutral-400">
                    Chưa có cuộc trao đổi nào.
                  </span>
                  {canCreateNew && !isForwarded && (
                    <Button
                      variant="primary"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => setIsCreating(true)}
                    >
                      Bắt đầu hội thoại mới
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversationId(conv.id)}
                      className="group flex cursor-pointer items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-400 hover:shadow-md"
                    >
                      {/* Left Icon */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600">
                        {role === "student" ? (
                          <Building2 className="h-5 w-5" />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-start justify-between">
                          <h3 className="line-clamp-1 font-semibold text-slate-900">
                            {conv.subject}
                          </h3>
                          <span className="shrink-0 text-xs text-slate-400">
                            {new Date(conv.createdAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </span>
                        </div>
                        <p className="line-clamp-1 text-sm text-slate-500">
                          Nhấn để xem chi tiết cuộc trao đổi...
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <StatusBadge
                            type={conv.isClosed ? "CLOSED" : "OPENING"}
                          />
                        </div>
                      </div>

                      {/* Action Arrow */}
                      <div className="flex h-full items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                        <ChevronRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Chat Sheet Integration */}
      {selectedConversationId && (
        <ChatSheet
          isOpen={!!selectedConversationId}
          onClose={(open) => {
            if (!open) setSelectedConversationId(null);
          }}
          messages={conversationDetail?.messages || []}
          onSendMessage={handleSendMessage}
          threadTitle={conversationDetail?.subject || "Cuộc hội thoại"}
          role={role}
          isConversationOpen={!selectedConversation?.isClosed}
          onCloseConversation={handleCloseConversation}
        />
      )}
    </div>
  );
};

export default ConversationSection;
