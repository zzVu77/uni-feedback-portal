import { BadgeCheck, Building2 } from "lucide-react";
import React from "react";

const OfficialResponse = () => {
  return (
    <div className="border-blue-primary-200 bg-blue-primary-100/40 flex w-full flex-col gap-3 rounded-[8px] border-1 px-4 py-2 shadow-sm">
      <div className="flex w-full flex-row items-center justify-start gap-1">
        <BadgeCheck className="text-blue-primary-700 h-5 w-5" />
        <span className="text-blue-primary-700 text-lg font-medium tracking-wide">
          Trả lời từ nhà trường
        </span>
      </div>
      <div className="flex flex-row items-center justify-start gap-1">
        <div className="bg-blue-primary-200 flex h-10 w-10 flex-row items-center justify-center rounded-full p-2">
          <Building2 className="text-blue-primary-600" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[18px] font-bold text-black/70">
            Khoa Đào tạo quốc tế
          </span>
          <time className="text-neutral-dark-primary-100 text-sm font-normal">
            20/10/2025
          </time>
        </div>
      </div>
      <p className="px-4 text-[14px]">
        Cảm ơn bạn đã góp ý. Chúng tôi hiện đang đánh giá tính khả thi của việc
        kéo dài thời gian hoạt động trong tuần thi cuối kỳ. Chúng tôi đang xem
        xét một chương trình thí điểm sẽ giữ cho tầng trệt mở cửa 24 giờ trong
        khi đóng cửa các tầng trên. Chúng tôi sẽ cập nhật cho mọi người về quyết
        định của mình vào cuối tháng.
      </p>
    </div>
  );
};

export default OfficialResponse;
