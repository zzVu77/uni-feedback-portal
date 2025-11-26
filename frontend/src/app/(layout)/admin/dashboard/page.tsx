// app/(admin)/dashboard/page.tsx
"use client";

import React, { useState, useCallback } from "react";
import { StatsOverviewCards } from "@/components/dashboard/StatsOverviewCards";
import { FeedbackTrendChart } from "@/components/dashboard/FeedbackTrendChart";
import { TopCategoriesChart } from "@/components/dashboard/TopCategoriesChart";
import { DepartmentPerformanceTable } from "@/components/dashboard/DepartmentPerformanceTable";
import { TopInteractivePostsTable } from "@/components/dashboard/TopInteractivePostsTable";
import { MonthRangePicker } from "@/components/dashboard/MonthRangePicker"; // Import component mới

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

// Hàm helper để lấy tháng hiện tại làm mặc định
const getDefaultFilter = (): ReportFilter => {
  const now = new Date();
  return {
    from: format(startOfMonth(now), "yyyy-MM-dd"), // Ngày 1 của tháng
    to: format(endOfMonth(now), "yyyy-MM-dd"), // Ngày cuối của tháng
  };
};

export default function AdminDashboardPage() {
  const [filter, setFilter] = useState<ReportFilter>(getDefaultFilter());

  // Callback để update filter khi chọn từ Calendar
  const handleDateUpdate = useCallback((newRange: ReportFilter) => {
    setFilter(newRange);
  }, []);

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
    <Wrapper>
      {/* Header */}
      <div className="flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Thống kê
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Phân tích dữ liệu và đánh giá hiệu suất xử lý góp ý trong toàn hệ
            thống.
          </p>
        </div>

        {/* Bộ lọc thời gian Custom - Month Range Picker */}
        <div className="flex w-full items-center gap-2 md:w-auto">
          <MonthRangePicker onUpdate={handleDateUpdate} />
        </div>
      </div>

      {/* 1. Overview Cards */}
      <section className="w-full">
        <StatsOverviewCards data={overview} isLoading={loadingOverview} />
      </section>

      {/* 2. Tables Row */}
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-7">
        <div className="col-span-1 lg:col-span-4">
          <DepartmentPerformanceTable
            data={departments}
            isLoading={loadingDepts}
          />
        </div>
        <div className="col-span-1 lg:col-span-3">
          <TopInteractivePostsTable
            data={interactivePosts}
            isLoading={loadingPosts}
          />
        </div>
      </div>

      {/* 3. Charts Row */}
      <div className="grid w-full grid-cols-1 gap-6 pb-4 lg:grid-cols-7">
        <div className="col-span-1 lg:col-span-4">
          <FeedbackTrendChart data={trends} isLoading={loadingTrends} />
        </div>
        <div className="col-span-1 h-full lg:col-span-3">
          <TopCategoriesChart data={categories} isLoading={loadingCategories} />
        </div>
      </div>
    </Wrapper>
  );
}
