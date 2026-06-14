"use client";
import React, { useCallback, useMemo } from "react";
import { ReportFilter } from "@/types/report";
import {
  useGetDepartmentStats,
  useGetFeedbackTrends,
  useGetStatsOverview,
  useGetTopCategories,
  useGetTopInteractivePosts,
} from "@/hooks/queries/useReportQueries";
import { startOfMonth, endOfMonth, format } from "date-fns";
import Wrapper from "@/components/shared/Wrapper";
import { MonthRangePicker } from "@/components/dashboard/admin/MonthRangePicker";
import { StatsOverviewCards } from "@/components/dashboard/admin/StatsOverviewCards";
import { TopInteractivePostsTable } from "@/components/dashboard/admin/TopInteractivePostsTable";
import { FeedbackTrendChart } from "@/components/dashboard/admin/FeedbackTrendChart";
import { TopCategoriesChart } from "@/components/dashboard/admin/TopCategoriesChart";
import { DepartmentPerformanceRadial } from "@/components/dashboard/admin/DepartmentPerformanceRadial";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiAnalyticsDashboard } from "@/components/dashboard/ai-analytics/AiAnalyticsDashboard";

export default function AdminDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filter = useMemo((): ReportFilter => {
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");
    const now = new Date();

    return {
      from: fromParam || format(startOfMonth(now), "yyyy-MM-dd"),
      to: toParam || format(endOfMonth(now), "yyyy-MM-dd"),
    };
  }, [searchParams]);

  const activeTab = searchParams.get("tab") || "overview";

  const handleDateUpdate = useCallback(
    (newRange: ReportFilter) => {
      const params = new URLSearchParams(searchParams);
      if (newRange.from) params.set("from", newRange.from);
      if (newRange.to) params.set("to", newRange.to);

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const handleTabChange = useCallback(
    (val: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("tab", val);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const { data: overview, isLoading: loadingOverview } =
    useGetStatsOverview(filter);
  const { data: trends, isLoading: loadingTrends } =
    useGetFeedbackTrends(filter);
  const { data: categories, isLoading: loadingCategories } =
    useGetTopCategories(filter);
  const { data: departments, isLoading: loadingDepts } =
    useGetDepartmentStats(filter);
  const { data: interactivePosts, isLoading: loadingPosts } =
    useGetTopInteractivePosts(filter);

  return (
    <Wrapper>
      <div className="flex w-full flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between lg:items-center">
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Thống kê
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Xem tổng quan và chi tiết hiệu suất phản hồi của các phòng ban,
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            {activeTab === "department-performance" && (
              <MonthRangePicker
                onUpdate={handleDateUpdate}
                defaultFrom={filter.from}
                defaultTo={filter.to}
              />
            )}
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="flex w-full flex-col gap-2"
        >
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2 rounded-xl bg-slate-100/80 p-1">
              <TabsTrigger
                value="overview"
                className="cursor-pointer rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
              >
                Tổng quan
              </TabsTrigger>
              <TabsTrigger
                value="department-performance"
                className="cursor-pointer rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
              >
                Chi tiết phòng ban
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-0">
            <AiAnalyticsDashboard />
          </TabsContent>

          <TabsContent
            value="department-performance"
            className="mt-0 flex w-full flex-col gap-6"
          >
            {/* 1. Overview Cards */}
            <section className="w-full">
              <StatsOverviewCards data={overview} isLoading={loadingOverview} />
            </section>

            {/* 2. Tables Row */}
            <div className="grid w-full grid-cols-1 gap-4 lg:gap-6">
              <div className="col-span-1 w-full">
                <DepartmentPerformanceRadial
                  data={departments}
                  isLoading={loadingDepts}
                />
              </div>
              <div className="col-span-1 w-full">
                <TopInteractivePostsTable
                  data={interactivePosts}
                  isLoading={loadingPosts}
                />
              </div>
            </div>

            {/* 3. Charts Row */}
            <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-8 lg:gap-6">
              <div className="col-span-1 h-full w-full lg:col-span-4">
                <FeedbackTrendChart data={trends} isLoading={loadingTrends} />
              </div>
              <div className="col-span-1 h-full w-full lg:col-span-4">
                <TopCategoriesChart
                  data={categories}
                  isLoading={loadingCategories}
                  type="admin"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Wrapper>
  );
}
