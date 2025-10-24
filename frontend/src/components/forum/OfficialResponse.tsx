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
    <div className="border-blue-primary-200 bg-blue-primary-100/40 flex w-full flex-col gap-3 rounded-[8px] border-1 px-4 py-2 shadow-sm">
      <div className="flex w-full flex-row items-center justify-start gap-1">
        <BadgeCheck className="text-blue-primary-700 h-5 w-5" />
        <span className="text-blue-primary-700 text-lg font-medium tracking-wide">
          Phản hồi từ nhà trường
        </span>
      </div>
      <div className="flex flex-row items-center justify-start gap-1">
        <div className="bg-blue-primary-200 flex h-10 w-10 flex-row items-center justify-center rounded-full p-2">
          <Building2 className="text-blue-primary-600" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[18px] font-semibold text-black/70">
            {departmentName ?? "Khoa Đào tạo quốc tế"}
          </span>
          <time className="text-sm font-normal text-gray-400">
            {responseDate ?? "20/10/2025"}
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
