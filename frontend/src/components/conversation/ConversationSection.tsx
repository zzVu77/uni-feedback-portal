import React from "react";
import ConversationItem from "./ConversationItem";
import { MessageCircleMore } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

const ConversationSection = () => {
  return (
    <div className="flex max-h-[620px] w-full flex-col gap-6 rounded-[8px] bg-white p-4 shadow-xs">
      <div className="flex flex-row items-center gap-1">
        <MessageCircleMore className="text-neutral-dark-primary-700 h-6 w-6" />
        <h2 className="text-neutral-dark-primary-700 text-[18px] font-medium">
          Trao đổi
        </h2>
      </div>
      <ScrollArea className="overflow-y-auto pr-4">
        <div className="flex flex-col gap-8">
          <ConversationItem
            isClosed={true}
            subject="Request for additional information"
            listMessage={[
              {
                typeOfUser: "STAFF",
                isReceived: true,
                content: "Can you provide more details?",
                name: "John Doe",
                timestamp: "2023-03-15T12:00:00Z",
              },
              {
                typeOfUser: "STUDENT",
                isReceived: false,
                content: "Sure, I will send the details shortly.",
                name: "Jane Smith",
                timestamp: "2023-03-15T12:05:00Z",
              },
            ]}
          />
          <ConversationItem
            isClosed={true}
            subject="Request for additional information"
            listMessage={[
              {
                typeOfUser: "STAFF",
                isReceived: true,
                content: "Can you provide more details?",
                name: "John Doe",
                timestamp: "2023-03-15T12:00:00Z",
              },
              {
                typeOfUser: "STUDENT",
                isReceived: false,
                content: "Sure, I will send the details shortly.",
                name: "Jane Smith",
                timestamp: "2023-03-15T12:05:00Z",
              },
              {
                typeOfUser: "STAFF",
                isReceived: true,
                content: "Can you provide more details?",
                name: "John Doe",
                timestamp: "2023-03-15T12:00:00Z",
              },
              {
                typeOfUser: "STUDENT",
                isReceived: false,
                content: "Sure, I will send the details shortly.",
                name: "Jane Smith",
                timestamp: "2023-03-15T12:05:00Z",
              },
            ]}
          />
          <ConversationItem
            isClosed={true}
            subject="Request for additional information"
            listMessage={[
              {
                typeOfUser: "STAFF",
                isReceived: true,
                content: "Can you provide more details?",
                name: "John Doe",
                timestamp: "2023-03-15T12:00:00Z",
              },
              {
                typeOfUser: "STUDENT",
                isReceived: false,
                content: "Sure, I will send the details shortly.",
                name: "Jane Smith",
                timestamp: "2023-03-15T12:05:00Z",
              },
              {
                typeOfUser: "STAFF",
                isReceived: true,
                content: "Can you provide more details?",
                name: "John Doe",
                timestamp: "2023-03-15T12:00:00Z",
              },
              {
                typeOfUser: "STUDENT",
                isReceived: false,
                content: "Sure, I will send the details shortly.",
                name: "Jane Smith",
                timestamp: "2023-03-15T12:05:00Z",
              },
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  );
};
export default ConversationSection;
