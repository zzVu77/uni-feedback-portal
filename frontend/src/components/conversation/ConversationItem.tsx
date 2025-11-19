import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetClarificationsDetailById } from "@/hooks/queries/useClarificationQueries";
import { ConversationSummary } from "@/types";
import { SendHorizontal } from "lucide-react"; // Icon gửi tin nhắn reply
import React, { useState } from "react";
import StatusBadge from "../common/StatusBadge"; // Giả sử bạn đã có component này
import MessageItem from "./MessageItem"; // Giả sử bạn đã có component này

type ConversationItemProps = {
  data: ConversationSummary[];
};

const ConversationItem = ({ data }: ConversationItemProps) => {
  const [replyText, setReplyText] = useState("");

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setReplyText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendReply();
    }
  };
  const [conversationId, setConversationId] = useState<string>("");
  const { data: conversationDetail } =
    useGetClarificationsDetailById(conversationId);
  const handleOnChangeConversation = (id: string) => {
    setConversationId(id);
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
                    <div className="flex w-full items-center justify-between pr-2">
                      <span className="text-[15px] font-semibold text-neutral-800">
                        {conversation.subject ||
                          "Request for additional information"}
                      </span>
                      {conversation.isClosed ? (
                        <StatusBadge type="CLOSED" />
                      ) : (
                        <StatusBadge type="OPENING" />
                      )}
                    </div>
                    {/* //Todo: Add timestamp or last message preview */}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex w-full flex-col border-t border-neutral-100 bg-white p-0">
                  <div className="flex max-h-[300px] flex-col gap-4 overflow-y-auto px-4 py-4">
                    {conversationDetail &&
                    conversationDetail.messages &&
                    conversationDetail.messages.length > 0 ? (
                      conversationDetail.messages.map((message, index) => (
                        <MessageItem key={index} {...message} />
                      ))
                    ) : (
                      <p className="text-center text-sm text-neutral-400 italic">
                        Chưa có tin nhắn nào.
                      </p>
                    )}
                  </div>
                  {/* If not closed, show reply input */}
                  {!conversation.isClosed && (
                    <div className="flex items-center gap-2 border-t border-neutral-100 bg-neutral-50 p-3">
                      <Input
                        placeholder="Nhập nội dung trao đổi..."
                        className="flex-1 border-neutral-300 bg-white focus-visible:ring-blue-500"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <Button
                        size="icon"
                        className="h-10 w-10 shrink-0 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                        onClick={handleSendReply}
                        disabled={!replyText.trim()}
                      >
                        <SendHorizontal className="h-5 w-5" />
                      </Button>
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
