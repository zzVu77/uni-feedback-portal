import { Download, File, FileText } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const Attachment = () => {
  return (
    <div className="bg-neutral-light-primary-100 flex w-full flex-row justify-between rounded-[6px] border-[1px] border-gray-200 p-2">
      <div className="flex flex-row items-center gap-2">
        {/* File Icon */}
        <div className="bg-blue-primary-100 rounded-lg p-2">
          <FileText className="text-blue-primary-300 h-6 w-6" />
        </div>
        {/* File Name */}
        <span className="text-[14px] font-medium">Document.pdf</span>
      </div>
      <Button className="bg-blue-100 text-blue-500 hover:bg-blue-200 hover:text-blue-600">
        <Download />
        Download
      </Button>
    </div>
  );
};

export default Attachment;
