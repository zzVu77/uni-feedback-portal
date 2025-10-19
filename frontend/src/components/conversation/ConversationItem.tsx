import React from "react";
import StatusBadge from "../common/StatusBadge";
import MessageItem from "./MessageItem";
type ConversationItemProps = {
  isClosed: boolean;
  subject: string;
  listMessage: {
    typeOfUser: "STAFF" | "STUDENT";
    isReceived: boolean;
    content: string;
    name: string;
    timestamp: string;
  }[];
};
const ConversationItem = ({
  isClosed,
  subject,
  listMessage,
}: ConversationItemProps) => {
  return (
    <div className="border-neutral-light-primary-300 flex w-full flex-col gap-4 rounded-[8px] border-[1px] shadow-sm">
      {/* Subject */}
      <div className="bg-neutral-light-primary-100 border-b-neutral-light-primary-300 flex flex-col gap-1 rounded-t-[8px] border-b-1 p-2">
        <span className="text-[15px] font-medium">
          {subject || "Request for additional information"}
        </span>
        {isClosed && <StatusBadge type="CLOSED" />}
      </div>
      {/* List of Message */}
      <div className="flex w-full flex-col gap-4 p-4">
        {listMessage.map((message, index) => (
          <MessageItem key={index} {...message} />
        ))}
      </div>
    </div>
  );
};

export default ConversationItem;
