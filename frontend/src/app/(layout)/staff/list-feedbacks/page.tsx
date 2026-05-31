import { Loading } from "@/components/common/Loading";
import { ListDepartmentFeedback } from "@/components/feedback/staff-feedbacks-list/ListDepartmentFeedback";
import Wrapper from "@/components/shared/Wrapper";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Wrapper>
      <div className="flex h-full w-full flex-col gap-6 md:gap-8">
        {/* Page Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between lg:items-center">
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Quản lý góp ý phòng ban
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Theo dõi, xử lý và phản hồi các góp ý từ sinh viên thuộc trách
              nhiệm của phòng ban để nâng cao chất lượng dịch vụ.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Suspense fallback={<Loading variant="spinner" />}>
            <ListDepartmentFeedback />
          </Suspense>
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
