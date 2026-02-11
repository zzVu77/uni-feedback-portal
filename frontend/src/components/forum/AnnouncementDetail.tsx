import type { AnnouncementDetailType } from "@/types";
import DOMPurify from "dompurify";
import { Building2, Calendar, User } from "lucide-react";
import Attachment from "../feedback/Attachment";
import Link from "next/link";

type Props = {
  data: AnnouncementDetailType;
};

const AnnouncementDetail = ({ data }: Props) => {
  const safeContent = DOMPurify.sanitize(data.content || "");

  return (
    <div className="flex w-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
      {/* Header Area */}
      <div className="mb-8 flex flex-col gap-6">
        <h1 className="text-2xl leading-tight font-bold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">
          {data.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <User className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-900">Ban quản trị</span>
              <div className="flex items-center gap-1.5 text-xs">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {new Date(data.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden h-8 w-px bg-slate-200 md:block" />

          <Link
            href={`/department/${data.department.id}`}
            className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>{data.department.name}</span>
          </Link>
        </div>
      </div>

      {/* Post Content */}
      <div
        className="prose prose-slate prose-lg prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-img:rounded-xl max-w-none"
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />

      {/* Attachments */}
      {data.files && data.files.length > 0 && (
        <div className="mt-12 border-t border-slate-100 pt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            Tệp đính kèm
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {data.files.length}
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.files.map((attachment, index) => (
              <Attachment
                key={index}
                fileName={attachment.fileName}
                fileUrl={attachment.fileUrl}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default AnnouncementDetail;
