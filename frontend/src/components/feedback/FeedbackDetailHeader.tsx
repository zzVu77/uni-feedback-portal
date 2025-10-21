import React from "react";
import StatusBadge from "../common/StatusBadge";
import Attachment from "./Attachment";

const FeedbackDetailHeader = () => {
  return (
    <>
      <div className="flex flex-col gap-2 rounded-[8px] bg-white px-4 py-4 shadow-xs lg:px-8">
        {/* Title */}
        <div>
          <h1 className="text-[24px] font-bold text-black">Bóng đèn bị hỏng</h1>
        </div>
        {/* Information */}
        <ul className="text-neutral-dark-primary-500 flex list-inside list-disc flex-col gap-2 md:grid md:grid-cols-2 lg:flex lg:flex-row">
          <li className="font-light">Phòng ban tiếp nhận: Thư viện</li>
          <li className="font-light">Ngày gửi: 2023-11-01</li>
          <li className="font-light">Danh mục: Cơ sở vật chất</li>
          <li className="font-light">Địa điểm: Phòng F1-406</li>
        </ul>
        {/* Status Badge */}
        <StatusBadge type="PENDING" />
        {/* Description */}
        <div>
          <h2 className="text-[18px] font-medium">Nội dung:</h2>
          <p className="text-[15px] font-normal text-black">
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
