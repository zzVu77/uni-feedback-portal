"use client";
import { DataSourceCardGrid } from "@/components/dashboard/social-listening/data-source-card-grid";
import { AddDataSourceDialog } from "@/components/dashboard/social-listening/add-data-source-dialog";
import { TriggerPipelineButton } from "@/components/dashboard/social-listening/trigger-pipeline-button";
import Wrapper from "@/components/shared/Wrapper";
import { Input } from "@/components/ui/input";
import { useGetSocialDataSources } from "@/hooks/queries/useSocialDataSourceQueries";
import { useState } from "react";
import { Search } from "lucide-react";

const AdminSocialListeningPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: dataSourcesData } = useGetSocialDataSources({
    limit: 100,
  });

  const filteredDataSources =
    dataSourcesData?.results?.filter((group) => {
      const term = searchQuery.toLowerCase();
      return (
        group.groupName.toLowerCase().includes(term) ||
        group.url.toLowerCase().includes(term)
      );
    }) || [];

  return (
    <Wrapper>
      <div className="animate-in fade-in flex w-full flex-col items-center gap-4 duration-500">
        {/* Hero Section */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <h1 className="bg-gradient-to-r from-indigo-600 to-blue-400 bg-clip-text pb-2 text-2xl font-extrabold tracking-tight text-slate-900 text-transparent sm:text-5xl lg:text-6xl">
            Quản lý Nguồn Dữ Liệu
          </h1>
          <p className="text-lg leading-relaxed text-slate-500">
            Quản lý các nguồn dữ liệu mạng xã hội (Facebook Groups). Thêm mới,
            chỉnh sửa thông tin hoặc cấu hình để hệ thống tự động cào dữ liệu.
          </p>
          <div className="mt-6 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm tên hoặc url..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-md border-slate-200 bg-white pl-11 text-base shadow-sm transition-all focus-visible:ring-indigo-500"
              />
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <AddDataSourceDialog />
              <TriggerPipelineButton />
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <DataSourceCardGrid dataSources={filteredDataSources} isAdmin={true} />
      </div>
    </Wrapper>
  );
};

export default AdminSocialListeningPage;
