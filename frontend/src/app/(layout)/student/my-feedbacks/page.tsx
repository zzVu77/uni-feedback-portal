import { Loading } from "@/components/common/Loading";
import { MyFeedbacksHistoryTable } from "@/components/feedback/my-feedbacks-history/MyFeedbacksHistoryTable";
import Wrapper from "@/components/shared/Wrapper";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <Wrapper>
      <div className="flex h-full w-full flex-col gap-1">
        {/* Page Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between lg:items-center">
          <div className="flex-1 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Lịch sử góp ý của tôi
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Theo dõi và quản lý các góp ý mà bạn đã gửi đến nhà trường. Xem
              trạng thái xử lý và phản hồi từ các phòng ban.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Suspense fallback={<Loading variant="spinner" />}>
            <MyFeedbacksHistoryTable />
          </Suspense>
        </div>
      </div>
    </Wrapper>
  );
};

export default Page;
