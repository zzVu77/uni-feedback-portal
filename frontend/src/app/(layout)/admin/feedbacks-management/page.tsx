import { Loading } from "@/components/common/Loading";
import { ListAllFeedbacks } from "@/components/feedback/admin-feedbacks-list/ListAllFeedbacks";
import Wrapper from "@/components/shared/Wrapper";
import { Suspense } from "react";

const page = () => {
  return (
    <Wrapper>
      <div className="flex h-full w-full flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between lg:items-center">
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Quản lý Góp ý toàn Hệ thống
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Theo dõi, phân loại và phân tích tất cả các góp ý từ sinh viên
              trên toàn hệ thống trường để đảm bảo chất lượng dịch vụ.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Suspense fallback={<Loading variant="spinner" />}>
            <ListAllFeedbacks />
          </Suspense>
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
