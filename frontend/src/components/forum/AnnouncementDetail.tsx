import type { AnnouncementDetailType } from "@/types";
import DOMPurify from "dompurify";
import { Building2, CalendarFold } from "lucide-react";
import { Separator } from "../ui/separator";
import Attachment from "../feedback/Attachment";
type Props = {
  data: AnnouncementDetailType;
};
const AnnouncementDetail = ({ data }: Props) => {
  const safeContent = DOMPurify.sanitize(data.content || "");
  return (
    <div className="flex w-full flex-col gap-3 rounded-xl bg-white px-3 py-4 shadow-sm md:px-4">
      {/* Post Title */}
      <h2 className="text-md font-semibold md:text-[16px] lg:text-2xl">
        {data.title || "Extended Library Hours During Finals Week"}
      </h2>
      <div className="flex h-5 items-center space-x-1 text-sm">
        <div className="flex flex-row items-center gap-1">
          <div className="bg-yellow-primary-100 flex h-8 w-8 flex-row items-center justify-center rounded-full p-2">
            <Building2 className="text-yellow-primary-200" />
          </div>
          <span className="text-[16px] font-normal text-black/60 md:text-[14px]">
            {data.department.name || "Khoa Đào tạo Quốc tế"}
          </span>
        </div>
        <Separator orientation="vertical" />
        <CalendarFold className="text-neutral-dark-primary-400 h-4 w-4" />
        <span className="text-neutral-dark-primary-400 text-[11px] font-light md:text-[14px]">
          {new Date(data.createdAt).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }) || "2023-11-01"}
        </span>
      </div>
      {/* Post Content */}
      <div
        className="prose prose-neutral prose-headings:font-semibold prose-a:text-blue-600 prose-img:rounded-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />
      {/* <span className="text-md font-normal text-black/80">
        {data.content || "No content available"}
      </span> */}
      {/* Attachments */}
      {data.files && data.files.length > 0 && (
        <>
          <h2 className="mt-2 text-[18px] font-medium">Tệp đính kèm:</h2>
          <div className="flex flex-col gap-2">
            {data.files.map((attachment, index) => (
              <Attachment
                key={index}
                fileName={attachment.fileName}
                fileUrl={attachment.fileUrl}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AnnouncementDetail;
