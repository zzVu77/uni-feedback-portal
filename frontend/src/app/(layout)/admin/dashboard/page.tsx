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

  const handleDateUpdate = useCallback(
    (newRange: ReportFilter) => {
      const params = new URLSearchParams(searchParams);
      if (newRange.from) params.set("from", newRange.from);
      if (newRange.to) params.set("to", newRange.to);

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
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between lg:items-center">
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Thống kê
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Theo dõi và quản lý hiệu suất giải quyết phản hồi từ các phòng
              ban, đồng thời nắm bắt các xu hướng thảo luận nổi bật nhất trên hệ
              thống.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <MonthRangePicker
              onUpdate={handleDateUpdate}
              defaultFrom={filter.from}
              defaultTo={filter.to}
            />
          </div>
        </div>

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
      </div>
    </Wrapper>
  );
}
