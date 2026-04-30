"use client";

import { SocialListeningDatePicker } from "@/components/dashboard/admin/SocialListeningDatePicker";
import HotIssuesTable from "@/components/dashboard/HotIssuesTable";
import KPIOverview from "@/components/dashboard/KPIOverview";
import SentimentTrendChart from "@/components/dashboard/SentimentTrendChart";
import TopicDistributionChart from "@/components/dashboard/TopicDistributionChart";
import { useGetTrendingIssues } from "@/hooks/queries/useSocialListeningQueries";
import { SocialListeningFilter } from "@/types/social-listening";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

const SocialListeningPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filter = useMemo((): SocialListeningFilter => {
    const fromParam = searchParams.get("startDate");
    const toParam = searchParams.get("endDate");
    const now = new Date();

    return {
      startDate: fromParam || format(startOfMonth(now), "yyyy-MM-dd"),
      endDate: toParam || format(endOfMonth(now), "yyyy-MM-dd"),
    };
  }, [searchParams]);

  const { data, isLoading } = useGetTrendingIssues(filter);

  const results = data?.results || [];

  const handleDateUpdate = useCallback(
    (newRange: Partial<SocialListeningFilter>) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newRange.startDate) {
        params.set("startDate", newRange.startDate);
      } else {
        params.delete("startDate");
      }

      if (newRange.endDate) {
        params.set("endDate", newRange.endDate);
      } else {
        params.delete("endDate");
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Phân tích bài đăng sinh viên trên mạng xã hội
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Theo dõi và phân tích các vấn đề của sinh viên thông qua các bài
              đăng mạng xã hội để có những hành động kịp thời và hiệu quả
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row md:items-center">
            <SocialListeningDatePicker
              onUpdate={handleDateUpdate}
              defaultStartDate={filter.startDate}
              defaultEndDate={filter.endDate}
            />
          </div>
        </div>

        {isLoading && !data ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-xl bg-gray-200"
                />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="h-80 animate-pulse rounded-xl bg-gray-200 lg:col-span-2" />
              <div className="h-80 animate-pulse rounded-xl bg-gray-200 lg:col-span-1" />
            </div>
            <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
          </div>
        ) : (
          <>
            {/* Row 2: KPI Overview */}
            <KPIOverview data={results} />

            {/* Row 3: Charts Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <SentimentTrendChart data={results} />
              </div>
              <div className="lg:col-span-1">
                <TopicDistributionChart data={results} />
              </div>
            </div>

            {/* Row 4: Hot Issues Table */}
            <HotIssuesTable data={results} />
          </>
        )}
      </div>
    </div>
  );
};

export default SocialListeningPage;
