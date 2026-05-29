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
    <div className="relative flex w-full flex-col overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] ring-1 ring-slate-200/50 md:p-12">
      {/* Header Area */}
      <div className="mb-8 flex flex-col gap-6">
        <h1 className="text-3xl leading-tight font-black tracking-tight text-slate-900 md:text-4xl lg:text-[2.75rem]">
          {data.title}
        </h1>

        <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
          <div className="flex items-center gap-4">
            {/* Premium Avatar Ring */}
            <div className="rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px] shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-slate-500">
                <User className="h-6 w-6" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-base font-extrabold text-slate-900">
                Ban quản trị
              </span>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
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

          <div className="hidden h-10 w-px bg-slate-200 md:block" />

          <Link
            href={`/department/${data.department.id}`}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 text-[13px] font-bold text-blue-700 shadow-sm ring-1 shadow-blue-100/50 ring-blue-200/50 transition-all hover:shadow-md hover:ring-blue-300"
          >
            <Building2 className="h-4 w-4" />
            <span>{data.department.name}</span>
          </Link>
        </div>
      </div>

      {/* Post Content */}
      <div
        className="prose prose-slate prose-lg prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-img:rounded-2xl max-w-none"
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />

      {/* Attachments */}
      {data.files && data.files.length > 0 && (
        <div className="mt-10 rounded-[1.5rem] bg-slate-50 p-6 ring-1 ring-slate-100">
          <h2 className="mb-5 flex items-center gap-3 text-lg font-extrabold text-slate-900">
            Tệp đính kèm
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-100 px-2 text-xs font-bold text-blue-700">
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
