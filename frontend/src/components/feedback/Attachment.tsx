import { FileAttachment } from "@/types";
import { Download, FileText } from "lucide-react";
import Link from "next/link";

const Attachment = ({ fileName, fileUrl }: FileAttachment) => {
  return (
    <Link
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
          <FileText className="h-5 w-5" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-sm font-medium text-slate-700 group-hover:text-slate-900">
            {fileName}
          </span>
          <span className="text-xs text-slate-400">Tệp đính kèm</span>
        </div>
      </div>
      <div className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-all group-hover:bg-white group-hover:text-blue-600">
        <Download className="h-4 w-4" />
      </div>
    </Link>
  );
};

export default Attachment;
