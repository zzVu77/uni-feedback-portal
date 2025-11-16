import React from "react";
import StatusBadge, { StatusBadgeProps } from "../common/StatusBadge";
import Attachment from "./Attachment";
import { Button } from "../ui/button";
import { SquarePen } from "lucide-react";
import Link from "next/link";
import { FeedbackHeaderType } from "@/types";
type Props = {
  type: "student" | "staff";
  data: FeedbackHeaderType;
};
const FeedbackDetailHeader = ({ type = "student", data }: Props) => {
  const {
    subject,
    category,
    createdAt,
    currentStatus,
    department,
    description,
    // id,
    // isPrivate,
    location,
  } = data;
  return (
    <>
      <div className="flex flex-col gap-2 rounded-xl bg-white px-4 py-4 shadow-xs lg:px-8">
        {/* Title */}
        <div className="flex flex-col items-start justify-between gap-1 md:flex-row lg:gap-4">
          <h1 className="order-2 text-[16px] font-bold text-black md:order-1 lg:text-[24px]">
            {subject ||
              `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit
           ratione dicta quia. Inventore animi qui expedita accusamus ex
           voluptates dignissimos officia molestiae! Rerum mollitia distinctio
           consequuntur molestias, veniam illum dolores.
           `}
          </h1>
          {type === "student" && currentStatus === "PENDING" && (
            //TODO: If status is PENDING, show edit button
            <Link href={"/my-feedbacks/1/edit"} className="order-1 md:order-2">
              <Button className="h-fit border bg-gray-100/70 p-2 text-xs font-normal text-black shadow-xs hover:bg-gray-100">
                <SquarePen className="h-4 w-4 text-black" />
                Sửa
              </Button>
            </Link>
          )}
        </div>
        {/* Information */}
        <ul className="text-neutral-dark-primary-500 flex list-inside list-disc flex-col gap-2 md:grid md:grid-cols-2 lg:flex lg:flex-row">
          <li className="text-[12px] font-normal xl:text-[14px]">
            Phòng ban tiếp nhận: {department.name || "Phòng Quản trị hệ thống"}
          </li>
          <li className="text-[12px] font-normal xl:text-[14px]">
            Ngày gửi: {new Date(createdAt).toLocaleDateString("vi-VN")}
          </li>
          <li className="text-[12px] font-normal xl:text-[14px]">
            Danh mục: {category.name || "Cơ sở vật chất"}
          </li>
          {location && (
            <li className="text-[12px] font-normal xl:text-[14px]">
              Địa điểm: {location}
            </li>
          )}
        </ul>
        {/* Status Badge */}
        <StatusBadge type={currentStatus as StatusBadgeProps["type"]} />
        {/* Description */}
        <div>
          <h2 className="text-[18px] font-medium">Nội dung:</h2>
          <p className="text-[13px] font-normal text-black lg:text-[14px]">
            {description ||
              " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
          </p>
        </div>
        {/* Attachments */}
        <h2 className="mt-4 text-[18px] font-medium">Tệp đính kèm:</h2>
        <Attachment />
        <Attachment />
        <Attachment />
      </div>
    </>
  );
};

export default FeedbackDetailHeader;
