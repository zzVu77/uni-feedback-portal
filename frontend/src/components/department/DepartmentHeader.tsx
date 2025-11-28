/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/department/components/DepartmentHeader.tsx
"use client";
import React from "react";
import {
  Building2,
  CheckCircle2,
  XCircle,
  Share2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DepartmentDetail } from "@/types";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
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
    <Card className="border-none shadow-sm">
      <CardContent className="px-0 pt-0">
        <div className="flex flex-col items-end justify-between gap-4 bg-white px-6 py-2 lg:flex-row">
          <div className="flex w-full flex-col items-center gap-4 lg:flex-row lg:gap-8">
            {/* Avatar */}
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-none bg-zinc-100/50 shadow-lg sm:h-32 sm:w-32">
              <Building2 className="h-12 w-12 text-blue-900 sm:h-16 sm:w-16" />
            </div>

            {/* Title & Badge */}
            <div className="space-y-1 text-center sm:mt-0 sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {department.name}
              </h1>
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 sm:justify-start">
                {department.isActive ? (
                  <Badge className="border-green-200 bg-green-100 text-green-700 hover:bg-green-200">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Đang hoạt động
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-600"
                  >
                    <XCircle className="mr-1 h-3 w-3" /> Ngưng hoạt động
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          {user && user.role === "STUDENT" && (
            <div className="flex w-full flex-row items-center justify-center gap-2 lg:justify-end">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" /> Chia sẻ
              </Button>

              <Link href={`/student/create-new-feedback`}>
                <Button
                  size="sm"
                  className="bg-red-500 text-white shadow-red-600/20 hover:bg-red-600/80"
                >
                  Gửi góp ý
                </Button>
              </Link>
            </div>
          )}
        </div>
        <Separator className="my-2" />
        {/* Description */}
        <div className="flex flex-col gap-4 px-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Thông tin giới thiệu
          </h3>
          <div className="prose prose-blue max-w-none leading-relaxed text-gray-600">
            <p>
              {department.description || "Chưa có mô tả cho phòng ban này."}
            </p>
          </div>
        </div>
        <Separator className="my-2" />
        {/* Contact Information */}
        <div className="flex flex-col gap-4 px-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Thông tin liên hệ
          </h3>
          <ContactItem
            icon={<Mail className="h-4 w-4" />}
            label="Email"
            content={
              <a
                href={`mailto:${department.email}`}
                className="break-all transition-colors hover:text-blue-700"
              >
                {department.email}
              </a>
            }
            colorClass="bg-blue-50 text-blue-700 group-hover:bg-blue-100"
          />
          <ContactItem
            icon={<Phone className="h-4 w-4" />}
            label="Điện thoại"
            content={department.phone || "Chưa cập nhật"}
            colorClass="bg-red-50 text-red-600 group-hover:bg-red-100"
          />
          <ContactItem
            icon={<MapPin className="h-4 w-4" />}
            label="Địa chỉ"
            content={department.location || "Chưa cập nhật"}
            colorClass="bg-green-50 text-green-600 group-hover:bg-green-100"
          />
        </div>
      </CardContent>
    </Card>
  );
};

const ContactItem = ({ icon, label, content, colorClass }: any) => (
  <div className="group flex items-start gap-3">
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${colorClass}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
        {label}
      </p>
      <div className="text-sm leading-snug font-medium text-gray-900">
        {content}
      </div>
    </div>
  </div>
);
