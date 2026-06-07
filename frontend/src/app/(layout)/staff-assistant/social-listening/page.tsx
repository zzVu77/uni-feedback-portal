"use client";
import { DataSourceCardGrid } from "@/components/dashboard/social-listening/data-source-card-grid";
import Wrapper from "@/components/shared/Wrapper";
import { Input } from "@/components/ui/input";
import { useGetSocialDataSources } from "@/hooks/queries/useSocialDataSourceQueries";
import { useState } from "react";
import { Search } from "lucide-react";

const SocialListeningPage = () => {
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
            Lắng nghe sinh viên
          </h1>
          <p className="text-lg leading-relaxed text-slate-500">
            Chọn một nguồn dữ liệu để bắt đầu theo dõi và phân tích các vấn đề
            của sinh viên. Hệ thống tự động thu thập và đánh giá cảm xúc mỗi
            ngày.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mt-2 w-full max-w-md">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm nhóm theo tên hoặc URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 w-full rounded-full border-slate-200 bg-white pl-12 text-base shadow-sm transition-all focus-visible:ring-indigo-500"
          />
        </div>

        {/* Cards Grid */}
        <DataSourceCardGrid dataSources={filteredDataSources} />
      </div>
    </Wrapper>
  );
};

export default SocialListeningPage;
