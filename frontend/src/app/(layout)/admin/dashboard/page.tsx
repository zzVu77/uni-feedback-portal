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
// IMPORT MỚI
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
      {/* Header */}
      <div className="flex w-full flex-col items-start justify-end gap-4 md:flex-row md:items-center">
        <MonthRangePicker
          onUpdate={handleDateUpdate}
          defaultFrom={filter.from}
          defaultTo={filter.to}
        />
      </div>

      {/* 1. Overview Cards */}
      <section className="w-full">
        <StatsOverviewCards data={overview} isLoading={loadingOverview} />
      </section>

      {/* 2. Tables Row */}
      <div className="grid w-full grid-cols-1 gap-4">
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
      <div className="grid w-full grid-cols-1 gap-4 pb-4 lg:grid-cols-8">
        <div className="col-span-1 lg:col-span-4">
          <FeedbackTrendChart data={trends} isLoading={loadingTrends} />
        </div>
        <div className="col-span-1 h-full lg:col-span-4">
          <TopCategoriesChart
            data={categories}
            isLoading={loadingCategories}
            type="admin"
          />
        </div>
      </div>
    </Wrapper>
  );
}
