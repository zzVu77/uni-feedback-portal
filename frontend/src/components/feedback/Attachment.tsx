import { FileAttachment } from "@/types";
import { Download, Paperclip } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const Attachment = ({ fileName, fileUrl }: FileAttachment) => {
  return (
    <div className="bg-neutral-light-primary-100 flex w-full flex-row justify-between rounded-xl border border-gray-200 p-2 shadow-xs">
      <div className="flex flex-row items-center gap-2">
        {/* File Icon */}
        <div className="bg-blue-primary-100 rounded-lg p-2">
          <Paperclip className="text-blue-primary-300 h-6 w-6" />
        </div>
        {/* File Name */}
        <span className="text-[14px] font-medium">{fileName}</span>
      </div>
      <Link href={fileUrl} target="_blank" rel="noopener noreferrer">
        <Button className="bg-blue-100 text-blue-500 hover:bg-blue-200 hover:text-blue-600">
          <Download />
          Download
        </Button>
      </Link>
    </div>
  );
};

export default Attachment;
