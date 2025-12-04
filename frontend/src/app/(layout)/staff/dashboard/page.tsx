"use client";
import { FeedbackTrendChart } from "@/components/dashboard/admin/FeedbackTrendChart";
import { MonthRangePicker } from "@/components/dashboard/admin/MonthRangePicker";
import { SingleDeptPerformanceChart } from "@/components/dashboard/admin/SingleDeptPerformanceChart";
import { StaffRadarChart } from "@/components/dashboard/admin/StaffRadarChart";
import { StatsOverviewCards } from "@/components/dashboard/admin/StatsOverviewCards";
import { TopCategoriesChart } from "@/components/dashboard/admin/TopCategoriesChart";
import Wrapper from "@/components/shared/Wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useGetStaffFeedbackTrends,
  useGetStaffPerformance,
  useGetStaffRadarChart,
  useGetStaffStatsOverview,
  useGetStaffTopCategories,
} from "@/hooks/queries/useReportQueries";
import { ReportFilter } from "@/types/report";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export default function StaffDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Filter Logic (Giống Admin)
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

  // 2. Fetching Data (Dùng Hooks của Staff)
  const { data: overview, isLoading: loadingOverview } =
    useGetStaffStatsOverview(filter);

  const { data: trends, isLoading: loadingTrends } =
    useGetStaffFeedbackTrends(filter);

  const { data: categories, isLoading: loadingCategories } =
    useGetStaffTopCategories(filter);

  const { data: performance, isLoading: loadingPerformance } =
    useGetStaffPerformance(filter);
  const { data: radarData, isLoading: loadingRadar } =
    useGetStaffRadarChart(filter);
  return (
    <Wrapper>
      {/* Header */}
      <div className="flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Tổng quan phòng ban
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Thống kê hoạt động xử lý góp ý của đơn vị.
          </p>
        </div>
        <MonthRangePicker
          onUpdate={handleDateUpdate}
          defaultFrom={filter.from}
          defaultTo={filter.to}
        />
      </div>

      <section className="w-full">
        <StatsOverviewCards data={overview} isLoading={loadingOverview} />
      </section>

      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-8">
        {/* Trend Chart */}
        <div className="col-span-1 lg:col-span-4">
          <FeedbackTrendChart data={trends} isLoading={loadingTrends} />
        </div>
        <div className="col-span-1 h-full w-full lg:col-span-4">
          <TopCategoriesChart
            data={categories}
            isLoading={loadingCategories}
            type="staff"
          />
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 pb-4 lg:grid-cols-8">
        <div className="col-span-1 lg:col-span-4">
          {/* Tự tạo Card wrapper cho Staff Dashboard */}
          <Card className="flex h-full flex-col items-center justify-start">
            <CardHeader className="w-full pb-2">
              <CardTitle>Hiệu suất xử lý</CardTitle>
              <CardDescription>Thời gian trung bình</CardDescription>
            </CardHeader>
            <CardContent className="flex w-full justify-center pb-6">
              {loadingPerformance ? (
                <div className="h-[200px] w-full animate-pulse rounded-xl bg-gray-100" />
              ) : performance ? (
                <SingleDeptPerformanceChart
                  dept={performance}
                  className="scale-110"
                />
              ) : (
                <div className="text-muted-foreground py-10">
                  Chưa có dữ liệu
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-3 border-t pt-1 text-xs">
              <div className="flex w-full flex-col items-center gap-2">
                <div className="text-muted-foreground flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-[hsl(221.2,83.2%,53.3%)]"></div>
                    <span>Đã xử lý</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-[hsl(0,84.2%,60.2%)]"></div>
                    <span>Chưa xử lý</span>
                  </div>
                </div>

                <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-[10px]">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-slate-400"></div>
                    <span>N/A</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    <span>&lt;24h (Tốt)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                    <span>24-72h (TB)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                    <span>&gt;72h (Kém)</span>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className="col-span-1 lg:col-span-4">
          <StaffRadarChart
            data={radarData}
            isLoading={loadingRadar}
            filter={filter}
          />
        </div>
      </div>
    </Wrapper>
  );
}
