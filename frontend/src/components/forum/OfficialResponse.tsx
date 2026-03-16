import { BadgeCheck, Building2, Calendar } from "lucide-react";
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
    <div className="my-2 w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 md:p-8">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900">
                {departmentName}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {new Date(responseDate).toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-fit items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold tracking-wider text-emerald-700 uppercase shadow-sm">
            <BadgeCheck className="h-4 w-4" />
            Phản hồi chính thức
          </div>
        </div>

        {/* Content Section */}
        <div className="prose prose-slate max-w-none">
          <p className="text-lg leading-relaxed text-slate-800 italic">
            {responseContent}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfficialResponse;
