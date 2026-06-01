/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/department/components/DepartmentHeader.tsx
"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import { DepartmentDetail } from "@/types";
import {
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Share2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

interface Props {
  department: DepartmentDetail;
}

export const DepartmentHeader: React.FC<Props> = ({ department }) => {
  const { user } = useUser();

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.href;
      navigator.clipboard
        .writeText(currentUrl)
        .then(() => {
          toast.success("Đã sao chép liên kết vào bộ nhớ tạm!");
        })
        .catch(() => {
          toast.error("Không thể sao chép liên kết. Vui lòng thử lại.");
        });
    }
  };

  return (
    <Card className="overflow-hidden rounded-[24px] border border-white/60 bg-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
      <CardContent className="px-0 pt-0">
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/40 bg-indigo-50/30 px-6 pt-6 pb-4 md:px-8 md:pt-8 lg:flex-row lg:items-center">
          <div className="flex w-full flex-col items-center gap-4 lg:flex-row lg:gap-6">
            {/* Avatar */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-indigo-50 shadow-md sm:h-28 sm:w-28">
              <Building2 className="h-10 w-10 text-indigo-600 sm:h-12 sm:w-12" />
            </div>

            {/* Title & Badge */}
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {department.name}
              </h1>
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 lg:justify-start">
                {department.isActive ? (
                  <Badge className="rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Đang hoạt động
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="rounded-full border border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
                  >
                    <XCircle className="mr-1 h-3.5 w-3.5" /> Ngưng hoạt động
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          {user && user.role === "STUDENT" && (
            <div className="flex w-full flex-row items-center justify-center gap-3 lg:w-auto lg:justify-end">
              <Button
                variant="outline"
                className="h-11 rounded-full border border-indigo-100 bg-white px-6 font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" /> Chia sẻ
              </Button>

              <Link href={`/student/create-new-feedback`}>
                <Button className="h-11 rounded-full bg-indigo-600 px-6 font-semibold text-white shadow-md transition-all hover:bg-indigo-700 active:scale-[0.98]">
                  Gửi góp ý
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 rounded-lg p-6 shadow-xl md:p-8 lg:grid-cols-3">
          {/* Description */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              Thông tin giới thiệu
            </h3>
            <div className="prose prose-indigo max-w-none leading-relaxed text-slate-600">
              <p>
                {department.description || "Chưa có mô tả cho phòng ban này."}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col gap-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              Thông tin liên hệ
            </h3>
            <div className="flex flex-col gap-3">
              <ContactItem
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                content={
                  <a
                    href={`mailto:${department.email}`}
                    className="break-all transition-colors hover:text-indigo-600"
                  >
                    {department.email}
                  </a>
                }
                colorClass="bg-indigo-50 text-indigo-600"
              />
              <ContactItem
                icon={<Phone className="h-4 w-4" />}
                label="Điện thoại"
                content={department.phone || "Chưa cập nhật"}
                colorClass="bg-indigo-50 text-indigo-600"
              />
              <ContactItem
                icon={<MapPin className="h-4 w-4" />}
                label="Địa chỉ"
                content={department.location || "Chưa cập nhật"}
                colorClass="bg-indigo-50 text-indigo-600"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ContactItem = ({ icon, label, content, colorClass }: any) => (
  <div className="group flex items-start gap-3 rounded-xl border border-white/60 bg-white/50 p-3 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md">
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${colorClass}`}
    >
      {icon}
    </div>
    <div className="flex flex-col justify-center">
      <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
        {label}
      </p>
      <div className="mt-0.5 text-[13px] font-semibold text-slate-800">
        {content}
      </div>
    </div>
  </div>
);
