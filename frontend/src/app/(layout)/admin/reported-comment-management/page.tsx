import { ReportedCommentTable } from "@/components/report-management/reported-comment/reported-comment-list/ReportedCommentTable";
import Wrapper from "@/components/shared/Wrapper";

const page = () => {
  return (
    <Wrapper>
      <div className="flex h-full w-full flex-col gap-1">
        {/* Page Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between lg:items-center">
          <div className="flex-1 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Quản lý báo cáo bình luận
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Theo dõi và xử lý các bình luận vi phạm được báo cáo bởi sinh
              viên. Đảm bảo môi trường diễn đàn lành mạnh và tôn trọng.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ReportedCommentTable />
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
