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
  return (
    <Wrapper>
      <div className="flex w-full flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between lg:items-center">
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Tổng quan phòng ban
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Thống kê hoạt động xử lý góp ý của đơn vị. Nắm bắt xu hướng và
              đánh giá hiệu suất.
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

        {/* 2. Charts Row 1 */}
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-8 lg:gap-6">
          <div className="col-span-1 h-full w-full lg:col-span-4">
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

        {/* 3. Charts Row 2 */}
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-8 lg:gap-6">
          <div className="col-span-1 h-full w-full lg:col-span-4">
            {/* Tự tạo Card wrapper cho Staff Dashboard */}
            <Card className="flex h-full flex-col items-center justify-start rounded-2xl border border-slate-100 bg-white/70 shadow-sm backdrop-blur-md transition-all hover:shadow-md">
              <CardHeader className="w-full pb-2">
                <CardTitle className="text-xl font-bold text-slate-800">
                  Hiệu suất xử lý
                </CardTitle>
                <CardDescription className="text-sm font-medium text-slate-500">
                  Thời gian trung bình
                </CardDescription>
              </CardHeader>
              <CardContent className="flex w-full flex-1 justify-center pt-4 pb-6">
                {loadingPerformance ? (
                  <div className="h-[200px] w-full animate-pulse rounded-xl bg-slate-100/60" />
                ) : performance ? (
                  <SingleDeptPerformanceChart
                    dept={performance}
                    className="scale-110"
                  />
                ) : (
                  <div className="flex w-full items-center justify-center py-10 text-slate-400">
                    Chưa có dữ liệu
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex w-full flex-col gap-3 border-t border-slate-100/50 bg-slate-50/30 pt-4 text-xs">
                <div className="flex w-full flex-col items-center gap-2">
                  <div className="flex items-center gap-4 text-slate-600">
                    <div className="flex items-center gap-1.5 font-medium">
                      <div className="h-2.5 w-2.5 rounded-full bg-[hsl(221.2,83.2%,53.3%)] shadow-sm"></div>
                      <span>Đã xử lý</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <div className="h-2.5 w-2.5 rounded-full bg-[hsl(0,84.2%,60.2%)] shadow-sm"></div>
                      <span>Chưa xử lý</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-medium text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-300"></div>
                      <span>N/A</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
                      <span>&lt;24h (Tốt)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-500"></div>
                      <span>24-72h (TB)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-rose-500"></div>
                      <span>&gt;72h (Kém)</span>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
          <div className="col-span-1 h-full w-full lg:col-span-4">
            <StaffRadarChart />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
