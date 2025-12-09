import { BadgeCheck, Building2 } from "lucide-react";
import React from "react";
type Props = {
  departmentName: string;
  responseDate: string;
  responseContent: string;
};
const OfficialResponse = ({
  departmentName,
  responseDate,
  responseContent,
}: Props) => {
  return (
    <div className="border-green-primary-200/20 bg-green-primary-100/50 flex w-full flex-col gap-3 rounded-xl border px-4 py-2 shadow-sm">
      <div className="flex w-full flex-row items-center justify-start gap-1">
        <BadgeCheck className="h-5 w-5 text-green-500" />
        <span className="text-lg font-medium tracking-wide text-green-500/80">
          Phản hồi từ nhà trường
        </span>
      </div>
      <div className="flex flex-row items-center justify-start gap-2">
        <div className="bg-green-primary-200/50 flex h-10 w-10 flex-row items-center justify-center rounded-full p-2">
          <Building2 className="text-green-500" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-green-primary-300/80 text-[16px] font-semibold">
            {departmentName ?? "Khoa Đào tạo quốc tế"}
          </span>
          <time className="text-sm font-normal text-gray-400">
            {new Date(responseDate).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </time>
        </div>
      </div>
      <p className="px-4 text-[14px]">
        {responseContent ??
          `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt, fuga facilis? Expedita, perferendis corrupti harum quisquam quam dolores iusto voluptatum. Architecto eligendi optio molestiae odio ducimus accusantium id ipsa quisquam?`}
      </p>
    </div>
  );
};

export default OfficialResponse;
