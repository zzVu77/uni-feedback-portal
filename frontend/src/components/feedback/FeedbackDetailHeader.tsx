import React from "react";
import StatusBadge from "../common/StatusBadge";
import Attachment from "./Attachment";
import { Button } from "../ui/button";
import { SquarePen } from "lucide-react";
import Link from "next/link";

const FeedbackDetailHeader = () => {
  return (
    <>
      <div className="flex flex-col gap-2 rounded-[8px] bg-white px-4 py-4 shadow-xs lg:px-8">
        {/* Title */}
        <div className="flex flex-col items-start justify-between gap-1 md:flex-row lg:gap-4">
          <h1 className="order-2 text-[16px] font-bold text-black md:order-1 lg:text-[24px]">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit
            ratione dicta quia. Inventore animi qui expedita accusamus ex
            voluptates dignissimos officia molestiae! Rerum mollitia distinctio
            consequuntur molestias, veniam illum dolores.
          </h1>
          {/* //TODO: If status is PENDING, show edit button */}
          <Link href={"/my-feedbacks/1/edit"} className="order-1 md:order-2">
            <Button className="h-fit border-1 bg-gray-100/70 p-2 text-xs font-normal text-black shadow-xs hover:bg-gray-100">
              <SquarePen className="h-4 w-4 text-black" />
              Sửa
            </Button>
          </Link>
        </div>
        {/* Information */}
        <ul className="text-neutral-dark-primary-500 flex list-inside list-disc flex-col gap-2 md:grid md:grid-cols-2 lg:flex lg:flex-row">
          <li className="text-[12px] font-normal xl:text-[14px]">
            Phòng ban tiếp nhận: Thư viện
          </li>
          <li className="text-[12px] font-normal xl:text-[14px]">
            Ngày gửi: 2023-11-01
          </li>
          <li className="text-[12px] font-normal xl:text-[14px]">
            Danh mục: Cơ sở vật chất
          </li>
          <li className="text-[12px] font-normal xl:text-[14px]">
            Địa điểm: Phòng F1-406
          </li>
        </ul>
        {/* Status Badge */}
        <StatusBadge type="PENDING" />
        {/* Description */}
        <div>
          <h2 className="text-[18px] font-medium">Nội dung:</h2>
          <p className="text-[13px] font-normal text-black lg:text-[14px]">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores
            perferendis minima ea et ipsum vero provident magni eveniet iure?
            Iusto eveniet id provident a nam dolorum error magnam, perspiciatis.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
            adipisci magnam explicabo aliquam? Laboriosam, ad nesciunt, rem
            suscipit fuga sunt molestiae corrupti repellat maxime animi sequi
            dolor, voluptate veniam ut. at. Lorem ipsum, dolor sit amet
            consectetur adipisicing elit. Maiores perferendis minima ea et ipsum
            vero provident magni eveniet iure? Iusto eveniet id provident a nam
            dolorum error magnam, perspiciatis. Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Odit adipisci magnam explicabo
            aliquam? Laboriosam, ad nesciunt, rem suscipit fuga sunt molestiae
            corrupti repellat maxime animi sequi dolor, voluptate veniam ut. at.
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
