import React from "react";
import ConversationItem from "./ConversationItem";
import { MessageCircleMore } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
type Message = {
  typeOfUser: "STAFF" | "STUDENT";
  isReceived: boolean;
  content: string;
  name: string;
  timestamp: string;
};

type Conversation = {
  isClosed: boolean;
  subject: string;
  listMessage: Message[];
};
const listConversation: Conversation[] = [
  //   {
  //     isClosed: true,
  //     subject: "Request for additional information",
  //     listMessage: [
  //       {
  //         typeOfUser: "STAFF",
  //         isReceived: true,
  //         content: "Can you provide more details?",
  //         name: "John Doe",
  //         timestamp: "2023-03-15T12:00:00Z",
  //       },
  //       {
  //         typeOfUser: "STUDENT",
  //         isReceived: false,
  //         content: "Sure, I will send the details shortly.",
  //         name: "Jane Smith",
  //         timestamp: "2023-03-15T12:05:00Z",
  //       },
  //       {
  //         typeOfUser: "STAFF",
  //         isReceived: true,
  //         content: "Can you provide more details?",
  //         name: "John Doe",
  //         timestamp: "2023-03-15T12:00:00Z",
  //       },
  //       {
  //         typeOfUser: "STUDENT",
  //         isReceived: false,
  //         content: "Sure, I will send the details shortly.",
  //         name: "Jane Smith",
  //         timestamp: "2023-03-15T12:05:00Z",
  //       },
  //     ],
  //   },
  //   {
  //     isClosed: true,
  //     subject: "Request for additional information",
  //     listMessage: [
  //       {
  //         typeOfUser: "STAFF",
  //         isReceived: true,
  //         content: "Can you provide more details?",
  //         name: "John Doe",
  //         timestamp: "2023-03-15T12:00:00Z",
  //       },
  //       {
  //         typeOfUser: "STUDENT",
  //         isReceived: false,
  //         content: "Sure, I will send the details shortly.",
  //         name: "Jane Smith",
  //         timestamp: "2023-03-15T12:05:00Z",
  //       },
  //       {
  //         typeOfUser: "STAFF",
  //         isReceived: true,
  //         content: "Can you provide more details?",
  //         name: "John Doe",
  //         timestamp: "2023-03-15T12:00:00Z",
  //       },
  //       {
  //         typeOfUser: "STUDENT",
  //         isReceived: false,
  //         content: "Sure, I will send the details shortly.",
  //         name: "Jane Smith",
  //         timestamp: "2023-03-15T12:05:00Z",
  //       },
  //     ],
  //   },
  //   {
  //     isClosed: true,
  //     subject: "Request for additional information",
  //     listMessage: [
  //       {
  //         typeOfUser: "STAFF",
  //         isReceived: true,
  //         content: "Can you provide more details?",
  //         name: "John Doe",
  //         timestamp: "2023-03-15T12:00:00Z",
  //       },
  //       {
  //         typeOfUser: "STUDENT",
  //         isReceived: false,
  //         content: "Sure, I will send the details shortly.",
  //         name: "Jane Smith",
  //         timestamp: "2023-03-15T12:05:00Z",
  //       },
  //       {
  //         typeOfUser: "STAFF",
  //         isReceived: true,
  //         content: "Can you provide more details?",
  //         name: "John Doe",
  //         timestamp: "2023-03-15T12:00:00Z",
  //       },
  //       {
  //         typeOfUser: "STUDENT",
  //         isReceived: false,
  //         content: "Sure, I will send the details shortly.",
  //         name: "Jane Smith",
  //         timestamp: "2023-03-15T12:05:00Z",
  //       },
  //     ],
  //   },
  //   {
  //     isClosed: true,
  //     subject: "Request for additional information",
  //     listMessage: [
  //       {
  //         typeOfUser: "STAFF",
  //         isReceived: true,
  //         content: "Can you provide more details?",
  //         name: "John Doe",
  //         timestamp: "2023-03-15T12:00:00Z",
  //       },
  //       {
  //         typeOfUser: "STUDENT",
  //         isReceived: false,
  //         content: "Sure, I will send the details shortly.",
  //         name: "Jane Smith",
  //         timestamp: "2023-03-15T12:05:00Z",
  //       },
  //       {
  //         typeOfUser: "STAFF",
  //         isReceived: true,
  //         content: "Can you provide more details?",
  //         name: "John Doe",
  //         timestamp: "2023-03-15T12:00:00Z",
  //       },
  //       {
  //         typeOfUser: "STUDENT",
  //         isReceived: false,
  //         content: "Sure, I will send the details shortly.",
  //         name: "Jane Smith",
  //         timestamp: "2023-03-15T12:05:00Z",
  //       },
  //     ],
  //   },
];
const ConversationSection = () => {
  return (
    <div className="flex max-h-[580px] min-h-[250px] w-full flex-col gap-6 rounded-[8px] bg-white p-4 shadow-xs">
      <div className="flex flex-row items-center gap-1">
        <MessageCircleMore className="text-neutral-dark-primary-700 h-6 w-6" />
        <h2 className="text-neutral-dark-primary-700 text-[18px] font-medium">
          Trao đổi
        </h2>
      </div>
      <ScrollArea className="overflow-y-auto pr-4">
        <div className="flex flex-col gap-6 py-1">
          {listConversation.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-10">
              <MessageCircleMore className="text-neutral-dark-primary-300 h-12 w-12" />
              <span className="text-neutral-dark-primary-300 text-center text-[15px] font-medium">
                Chưa có cuộc trao đổi nào được tạo.
              </span>
            </div>
          )}
          {listConversation.length > 0 &&
            listConversation.map((conversation, index) => (
              <ConversationItem
                key={index}
                isClosed={conversation.isClosed}
                subject={conversation.subject}
                listMessage={conversation.listMessage}
              />
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};
export default ConversationSection;
