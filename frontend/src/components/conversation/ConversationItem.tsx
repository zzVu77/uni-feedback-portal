import React from "react";
import StatusBadge from "../common/StatusBadge";
import MessageItem from "./MessageItem";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    <Accordion type="multiple" className="w-full">
      <AccordionItem
        value="item-1"
        className="border-neutral-light-primary-300 rounded-[8px] border-[1px]"
      >
        <AccordionTrigger className="bg-neutral-light-primary-100 cursor-pointer rounded-t-[8px] border-b-1 p-2 text-left hover:no-underline">
          <div className="flex flex-col items-start gap-1">
            <span className="text-[15px] font-medium">
              {subject || "Request for additional information"}
            </span>
            {isClosed && <StatusBadge type="CLOSED" />}
          </div>
        </AccordionTrigger>

        <AccordionContent className="flex w-full flex-col gap-4 rounded-b-[8px] border-b-1 px-4 py-2">
          {listMessage.map((message, index) => (
            <MessageItem key={index} {...message} />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ConversationItem;
