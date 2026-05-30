import { BadgeCheck, Building2, Calendar, Quote } from "lucide-react";
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
    <div className="relative w-full overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_8px_30px_-12px_rgba(16,185,129,0.2)] ring-1 ring-emerald-200/60 md:p-8">
      {/* Decorative Emerald Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-white to-white opacity-80" />
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />

      {/* Watermark Icon */}
      <Quote className="absolute -top-4 -right-4 h-32 w-32 text-emerald-50/60 mix-blend-multiply" />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-4">
            {/* Premium Department Avatar */}
            <div className="rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 p-[2px] shadow-sm shadow-emerald-500/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white bg-white text-emerald-600">
                <Building2 className="h-5 w-5" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-emerald-950">
                {departmentName}
              </span>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-700/70">
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

          <div className="flex w-fit items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1.5 text-[12px] font-bold tracking-wide text-white shadow-sm shadow-emerald-500/30">
            <BadgeCheck className="h-4 w-4" />
            <span className="uppercase">Phản hồi chính thức</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative mt-1 rounded-[1.25rem] bg-white/60 p-5 ring-1 ring-emerald-100 backdrop-blur-sm">
          <p className="text-[15px] leading-relaxed font-medium text-slate-700">
            {responseContent}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfficialResponse;
