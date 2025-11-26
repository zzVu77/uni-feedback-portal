// app/(admin)/dashboard/page.tsx
"use client";

import React, { useState } from "react";
import { StatsOverviewCards } from "@/components/dashboard/StatsOverviewCards";
import { FeedbackTrendChart } from "@/components/dashboard/FeedbackTrendChart";
import { TopCategoriesChart } from "@/components/dashboard/TopCategoriesChart";
import { DepartmentPerformanceTable } from "@/components/dashboard/DepartmentPerformanceTable";
import { TopInteractivePostsTable } from "@/components/dashboard/TopInteractivePostsTable";

import { ReportFilter } from "@/types/report";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import {
  useGetDepartmentStats,
  useGetFeedbackTrends,
  useGetStatsOverview,
  useGetTopCategories,
  useGetTopInteractivePosts,
} from "@/hooks/queries/useReportQueries";

const getDefaultFilter = (): ReportFilter => {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 30);
  return {
    from: from.toISOString().split("T")[0],
    to: to.toISOString().split("T")[0],
  };
};

export default function AdminDashboardPage() {
  const [filter] = useState<ReportFilter>(getDefaultFilter());

  // Fetching data
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
    // FIX: p-4 cho mobile, md:p-8 cho desktop để thoáng hơn
    <div className="bg-muted/10 flex min-h-screen w-full flex-col gap-6 p-4 md:p-8">
      {/* Header */}
      <div className="flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Tổng quan
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Báo cáo hiệu suất và tình hình tiếp nhận góp ý.
          </p>
        </div>
        <div className="flex w-full items-center gap-2 md:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-full gap-1 border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 md:w-auto"
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              30 ngày gần nhất
            </span>
            {/* Hiển thị text trên mobile để user dễ hiểu hơn nếu icon nhỏ */}
            <span className="sm:hidden">30 ngày gần nhất</span>
          </Button>
        </div>
      </div>

      {/* 1. Overview Cards */}
      {/* Component này bên trong đã handle responsive grid rồi */}
      <section>
        <StatsOverviewCards data={overview} isLoading={loadingOverview} />
      </section>

      {/* 2. Tables Row: Performance & Top Interactive */}
      {/* FIX: Mặc định grid-cols-1 (mobile/tablet), lên LG mới chia cột 7 phần */}
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-7">
        {/* Department Performance */}
        {/* FIX: col-span-1 (mobile), col-span-4 (desktop) */}
        <div className="col-span-1 lg:col-span-4">
          <DepartmentPerformanceTable
            data={departments}
            isLoading={loadingDepts}
          />
        </div>

        {/* Top Interactive Posts */}
        {/* FIX: col-span-1 (mobile), col-span-3 (desktop) */}
        <div className="col-span-1 lg:col-span-3">
          <TopInteractivePostsTable
            data={interactivePosts}
            isLoading={loadingPosts}
          />
        </div>
      </div>

      {/* 3. Charts Row: Trend (Area) & Categories (Bar) */}
      {/* Tương tự row trên: Stack dọc ở mobile, chia 4/3 ở desktop */}
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-7">
        {/* Trend Chart */}
        <div className="col-span-1 lg:col-span-4">
          <FeedbackTrendChart data={trends} isLoading={loadingTrends} />
        </div>

        {/* Categories Chart */}
        <div className="col-span-1 h-full lg:col-span-3">
          <TopCategoriesChart data={categories} isLoading={loadingCategories} />
        </div>
      </div>
    </div>
  );
}
