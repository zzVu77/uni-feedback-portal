"use client";
import React, { useState } from "react";
import { StatsOverviewCards } from "@/components/dashboard/StatsOverviewCards";
import { FeedbackTrendChart } from "@/components/dashboard/FeedbackTrendChart";
import { TopCategoriesChart } from "@/components/dashboard/TopCategoriesChart";
import { DepartmentPerformanceTable } from "@/components/dashboard/DepartmentPerformanceTable";

import { ReportFilter } from "@/types/report";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import {
  useGetDepartmentStats,
  useGetFeedbackTrends,
  useGetStatsOverview,
  useGetTopCategories,
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

  // Parallel fetching
  const { data: overview, isLoading: loadingOverview } =
    useGetStatsOverview(filter);
  const { data: trends, isLoading: loadingTrends } =
    useGetFeedbackTrends(filter);
  const { data: categories, isLoading: loadingCategories } =
    useGetTopCategories(filter);
  const { data: departments, isLoading: loadingDepts } =
    useGetDepartmentStats(filter);

  return (
    <div className="bg-muted/10 flex min-h-screen flex-col gap-6 p-6 md:p-8">
      {/* 1. Header & Filter Section */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of student feedback system performance.
          </p>
        </div>

        {/* Simple Date Filter Trigger - You can implement DatePickerWithRange here */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Last 30 Days
            </span>
          </Button>
        </div>
      </div>

      {/* 2. Overview Cards */}
      <section>
        <StatsOverviewCards data={overview} isLoading={loadingOverview} />
      </section>

      {/* 3. Main Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Trend Chart (chiếm 4 cột) */}
        <div className="col-span-4">
          <FeedbackTrendChart data={trends} isLoading={loadingTrends} />
        </div>

        {/* Department Stats (chiếm 3 cột) */}
        <div className="col-span-3">
          <DepartmentPerformanceTable
            data={departments}
            isLoading={loadingDepts}
          />
        </div>
      </div>

      {/* 4. Secondary Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Categories Chart (chiếm 3 cột) */}
        <div className="col-span-3">
          <TopCategoriesChart data={categories} isLoading={loadingCategories} />
        </div>

        {/* Placeholder for future expansion or another chart */}
        <div className="bg-muted/20 text-muted-foreground col-span-4 flex items-center justify-center rounded-xl border border-dashed p-10">
          More analytics coming soon...
        </div>
      </div>
    </div>
  );
}
