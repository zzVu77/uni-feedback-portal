/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAiReportDetail,
  useGetAiReports,
  useTriggerAiReport,
} from "@/hooks/queries/useAiAnalyticsQueries";
import { cn } from "@/lib/utils";
import { ReportPeriodType } from "@/types/ai-analytics";
import { addDays, endOfMonth, format, parseISO, subDays } from "date-fns";
import {
  Activity,
  AlertCircle,
  BarChart3,
  BrainCircuit,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  MessageSquareWarning,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";

const SentimentMeter = ({ score }: { score: number }) => {
  // Score is between -1 and 1
  const percentage = ((score + 1) / 2) * 100;

  let colorClass = "from-rose-500 to-rose-400";
  let textColor = "text-rose-600";
  let label = "Tiêu cực";

  if (score > -0.3 && score < 0.3) {
    colorClass = "from-amber-400 to-amber-300";
    textColor = "text-amber-600";
    label = "Trung lập";
  } else if (score >= 0.3) {
    colorClass = "from-emerald-500 to-emerald-400";
    textColor = "text-emerald-600";
    label = "Tích cực";
  }

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4">
      <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-slate-200 bg-linear-to-br from-slate-50 to-slate-100 shadow-inner">
        <div
          className={`absolute inset-2 rounded-full bg-linear-to-tr opacity-20 ${colorClass} animate-pulse`}
        ></div>
        <div className="z-10 flex flex-col items-center">
          <span className={`text-4xl font-black tracking-tighter ${textColor}`}>
            {score > 0 ? "+" : ""}
            {score.toFixed(2)}
          </span>
          <span
            className={`mt-1 text-xs font-semibold tracking-widest uppercase ${textColor}`}
          >
            {label}
          </span>
        </div>
      </div>

      <div className="w-full px-4">
        <div className="mb-1 flex justify-between text-xs font-medium text-slate-400">
          <span>-1.0</span>
          <span>0.0</span>
          <span>+1.0</span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="absolute top-0 bottom-0 left-0 w-full bg-linear-to-r from-rose-500 via-amber-400 to-emerald-500 opacity-30"></div>
          <div
            className="absolute top-0 bottom-0 w-1 rounded-full bg-slate-800 shadow-[0_0_8px_rgba(0,0,0,0.5)] transition-all duration-1000 ease-out"
            style={{ left: `calc(${percentage}% - 2px)` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export function AiAnalyticsDashboard() {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isTriggerOpen, setIsTriggerOpen] = useState(false);
  const [periodType, setPeriodType] = useState<ReportPeriodType>(
    ReportPeriodType.WEEKLY,
  );
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 6), "yyyy-MM-dd"),
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [monthStr, setMonthStr] = useState(format(new Date(), "yyyy-MM"));

  const { data: reports, isLoading: isReportsLoading } = useGetAiReports();
  const { data: reportDetail, isLoading: isDetailLoading } =
    useGetAiReportDetail(selectedReportId || "");
  const triggerMutation = useTriggerAiReport();

  // Group reports by Month and Year
  const groupedReports = useMemo(() => {
    if (!reports) return [];

    // Sort reports by date descending first to ensure newest is top
    const sorted = [...reports].sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );

    const groups: Record<string, typeof reports> = {};
    sorted.forEach((r) => {
      const date = new Date(r.startDate);
      const label = `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
      if (!groups[label]) groups[label] = [];
      groups[label].push(r);
    });

    return Object.entries(groups).map(([label, items]) => ({ label, items }));
  }, [reports]);

  // Auto-select the first report if none is selected
  useEffect(() => {
    if (reports && reports.length > 0 && !selectedReportId) {
      // Find the first report from the sorted list
      const sorted = [...reports].sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      );
      setSelectedReportId(sorted[0].id);
    }
  }, [reports, selectedReportId]);

  const handleTrigger = () => {
    triggerMutation.mutate(
      {
        periodType,
        startDate: `${startDate}T00:00:00Z`,
        endDate: `${endDate}T23:59:59Z`,
      },
      {
        onSuccess: () => setIsTriggerOpen(false),
      },
    );
  };

  return (
    <div className="flex w-full flex-col gap-6 font-sans">
      {/* Top Header & Report Selector Dropdown */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
          <div className="w-full sm:max-w-md">
            <Select
              value={selectedReportId || ""}
              onValueChange={(val) => setSelectedReportId(val)}
              disabled={isReportsLoading}
            >
              <SelectTrigger className="h-10 w-full border-slate-200 bg-white shadow-sm">
                <SelectValue
                  placeholder={
                    isReportsLoading
                      ? "Đang tải dữ liệu..."
                      : "Chọn báo cáo để xem chi tiết..."
                  }
                />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {reports?.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">
                    Chưa có báo cáo nào được tạo.
                  </div>
                ) : (
                  groupedReports.map((group) => (
                    <SelectGroup key={group.label}>
                      <SelectLabel className="sticky top-0 bg-slate-50/80 text-slate-500">
                        {group.label}
                      </SelectLabel>
                      {group.items.map((r) => (
                        <SelectItem
                          key={r.id}
                          value={r.id}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-indigo-400" />
                            <span className="font-semibold text-slate-700">
                              {r.periodType === "WEEKLY"
                                ? "Báo cáo Tuần"
                                : "Báo cáo Tháng"}
                            </span>
                            <span className="text-xs font-medium text-slate-400">
                              ({format(new Date(r.startDate), "dd/MM")} -{" "}
                              {format(new Date(r.endDate), "dd/MM")})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Trigger Dialog */}
        <Dialog open={isTriggerOpen} onOpenChange={setIsTriggerOpen}>
          <DialogTrigger asChild>
            <Button className="h-10 shrink-0 rounded-full bg-indigo-600 px-5 text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700">
              <Plus className="mr-1.5 h-4 w-4" />
              Tạo Báo Cáo Mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-indigo-500" />
                Phân Tích
              </DialogTitle>
              <DialogDescription>
                Hệ thống sẽ tổng hợp toàn bộ feedback trong khoảng thời gian
                được chọn và phân tích nó. Quá trình có thể mất vài phút.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 py-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="type"
                  className="text-right font-medium text-slate-600"
                >
                  Chu kỳ
                </Label>
                <Select
                  value={periodType}
                  onValueChange={(v) => {
                    const type = v as ReportPeriodType;
                    setPeriodType(type);
                    if (type === ReportPeriodType.WEEKLY) {
                      const end = addDays(parseISO(startDate), 6);
                      setEndDate(format(end, "yyyy-MM-dd"));
                    } else if (type === ReportPeriodType.MONTHLY) {
                      const start = parseISO(monthStr + "-01");
                      setStartDate(format(start, "yyyy-MM-dd"));
                      setEndDate(format(endOfMonth(start), "yyyy-MM-dd"));
                    }
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ReportPeriodType.WEEKLY}>
                      Báo cáo Tuần
                    </SelectItem>
                    <SelectItem value={ReportPeriodType.MONTHLY}>
                      Báo cáo Tháng
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {periodType === ReportPeriodType.WEEKLY ? (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="start"
                      className="text-right font-medium text-slate-600"
                    >
                      Từ ngày
                    </Label>
                    <div className="col-span-3">
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start border-slate-200 text-left font-normal shadow-sm",
                              !startDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                            {startDate ? (
                              format(parseISO(startDate), "dd/MM/yyyy")
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              startDate ? parseISO(startDate) : undefined
                            }
                            onSelect={(d) => {
                              if (d) {
                                const val = format(d, "yyyy-MM-dd");
                                setStartDate(val);
                                setEndDate(
                                  format(
                                    addDays(parseISO(val), 6),
                                    "yyyy-MM-dd",
                                  ),
                                );
                              }
                            }}
                            disabled={{ after: new Date() }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="end"
                      className="text-right font-medium text-slate-600"
                    >
                      Đến ngày
                    </Label>
                    <div className="col-span-3">
                      <Button
                        variant="outline"
                        disabled
                        className="w-full cursor-not-allowed justify-start border-slate-200 bg-slate-50 text-left font-normal text-slate-500 opacity-100 shadow-sm"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                        {endDate
                          ? format(parseISO(endDate), "dd/MM/yyyy")
                          : "---"}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="month"
                    className="text-right font-medium text-slate-600"
                  >
                    Tháng báo cáo
                  </Label>
                  <div className="col-span-3">
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start border-slate-200 text-left font-normal shadow-sm"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                          {monthStr
                            ? `Tháng ${format(parseISO(monthStr + "-01"), "MM/yyyy")}`
                            : "Chọn tháng"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-3" align="start">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => {
                                const current = parseISO(monthStr + "-01");
                                const prev = format(
                                  new Date(
                                    current.getFullYear() - 1,
                                    current.getMonth(),
                                    1,
                                  ),
                                  "yyyy-MM",
                                );
                                setMonthStr(prev);
                                const start = parseISO(prev + "-01");
                                setStartDate(format(start, "yyyy-MM-dd"));
                                setEndDate(
                                  format(endOfMonth(start), "yyyy-MM-dd"),
                                );
                              }}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-semibold text-slate-700">
                              Năm {parseISO(monthStr + "-01").getFullYear()}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              disabled={
                                parseISO(monthStr + "-01").getFullYear() >=
                                new Date().getFullYear()
                              }
                              onClick={() => {
                                const current = parseISO(monthStr + "-01");
                                const next = format(
                                  new Date(
                                    current.getFullYear() + 1,
                                    current.getMonth(),
                                    1,
                                  ),
                                  "yyyy-MM",
                                );
                                setMonthStr(next);
                                const start = parseISO(next + "-01");
                                setStartDate(format(start, "yyyy-MM-dd"));
                                setEndDate(
                                  format(endOfMonth(start), "yyyy-MM-dd"),
                                );
                              }}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {Array.from({ length: 12 }).map((_, i) => {
                              const monthDate = new Date(
                                parseISO(monthStr + "-01").getFullYear(),
                                i,
                                1,
                              );
                              const isFuture = monthDate > new Date();
                              const isSelected =
                                i === parseISO(monthStr + "-01").getMonth();
                              return (
                                <Button
                                  key={i}
                                  variant="ghost"
                                  className={cn(
                                    "h-10 text-xs",
                                    isSelected &&
                                      "bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white",
                                    !isSelected &&
                                      "hover:bg-indigo-50 hover:text-indigo-900",
                                  )}
                                  disabled={isFuture}
                                  onClick={() => {
                                    const val = format(monthDate, "yyyy-MM");
                                    setMonthStr(val);
                                    setStartDate(
                                      format(monthDate, "yyyy-MM-dd"),
                                    );
                                    setEndDate(
                                      format(
                                        endOfMonth(monthDate),
                                        "yyyy-MM-dd",
                                      ),
                                    );
                                  }}
                                >
                                  Thg {i + 1}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="border-t border-slate-100 pt-4">
              <Button variant="ghost" onClick={() => setIsTriggerOpen(false)}>
                Hủy
              </Button>
              <Button
                onClick={handleTrigger}
                disabled={triggerMutation.isPending}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {triggerMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <BrainCircuit className="mr-2 h-4 w-4" />
                )}
                {triggerMutation.isPending
                  ? "Đang xử lý..."
                  : "Tiến hành phân tích"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content: Report Details */}
      <Card className="w-full border-slate-200/60 bg-white/90 shadow-lg backdrop-blur-xl">
        <CardContent className="p-4">
          {isDetailLoading && (
            <div className="flex flex-col items-center justify-center space-y-4 py-20 text-indigo-500">
              <Loader2 className="h-10 w-10 animate-spin" />
              <p className="animate-pulse text-sm font-medium text-indigo-400">
                AI đang phân tích và hiển thị kết quả...
              </p>
            </div>
          )}

          {!isDetailLoading && !selectedReportId && (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-24 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
                <BrainCircuit className="h-10 w-10 text-indigo-300" />
              </div>
              <h3 className="mb-1 text-lg font-semibold text-slate-700">
                Chưa có dữ liệu hiển thị
              </h3>
              <p className="max-w-sm text-sm text-slate-500">
                Vui lòng chọn một báo cáo ở phía trên hoặc tạo mới để xem chi
                tiết.
              </p>
            </div>
          )}

          {!isDetailLoading && reportDetail && (
            <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-8 duration-500">
              {/* Header Title inside card */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Sparkles className="h-6 w-6 text-amber-500" />
                <h3 className="text-xl font-bold text-slate-800">
                  Kết Quả Phân Tích Tổng Hợp
                </h3>
              </div>

              {/* Overall Summary & Sentiment */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Summary */}
                <div className="col-span-1 space-y-4 lg:col-span-2">
                  <h4 className="flex items-center gap-2 text-sm font-bold tracking-widest text-slate-500 uppercase">
                    Tổng quan tình hình
                  </h4>
                  <div className="relative h-[calc(100%-2rem)] overflow-hidden rounded-2xl border border-indigo-100/50 bg-linear-to-br from-indigo-50/80 via-white to-violet-50/50 p-6 shadow-sm">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                      <FileText className="h-48 w-48" />
                    </div>
                    <p className="relative z-10 text-[15px] leading-relaxed whitespace-pre-wrap text-slate-700">
                      {reportDetail.overallSummary}
                    </p>
                  </div>
                </div>

                {/* Sentiment Meter */}
                <div className="col-span-1 space-y-4">
                  <h4 className="flex items-center gap-2 text-sm font-bold tracking-widest text-slate-500 uppercase">
                    Chỉ số Cảm xúc
                  </h4>
                  <div className="flex h-[calc(100%-2rem)] flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <SentimentMeter score={reportDetail.sentimentScore || 0} />
                    <div className="mt-8 flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-4 py-2">
                      <Activity className="h-4 w-4 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-600">
                        Đã phân tích {reportDetail.totalFeedbacksAnalyzed}{" "}
                        feedbacks
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frequent Categories */}
              <div className="mt-2 space-y-4">
                <h4 className="flex items-center gap-2 border-t border-slate-100 pt-6 text-sm font-bold tracking-widest text-slate-500 uppercase">
                  <AlertCircle className="h-4 w-4 text-rose-400" />
                  Các danh mục thường bị khiếu nại
                </h4>

                {!reportDetail.frequentCategories ||
                reportDetail.frequentCategories.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/50 p-8 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                      <Sparkles className="h-6 w-6 text-emerald-400" />
                    </div>
                    <p className="font-medium text-slate-600">
                      Tuyệt vời! Không có khiếu nại nổi bật nào.
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Sinh viên hiện tại rất hài lòng với chất lượng dịch vụ.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {reportDetail.frequentCategories?.map(
                      (cat: any, idx: number) => (
                        <div
                          key={idx}
                          className="group relative flex flex-col rounded-2xl border border-rose-100/50 bg-linear-to-br from-rose-50/50 to-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-md"
                        >
                          <div className="mb-5 flex items-start justify-between gap-4">
                            <div className="flex flex-col">
                              {cat.categoryId ? (
                                <Link
                                  href={`/admin/feedbacks-management?categoryId=${cat.categoryId}&from=${format(new Date(reportDetail.startDate), "yyyy-MM-dd")}&to=${format(new Date(reportDetail.endDate), "yyyy-MM-dd")}`}
                                  className="text-lg font-bold text-slate-800 transition-colors group-hover:text-rose-600"
                                >
                                  {cat.categoryName}
                                </Link>
                              ) : (
                                <h4 className="text-lg font-bold text-slate-800">
                                  {cat.categoryName}
                                </h4>
                              )}
                              <span className="mt-0.5 text-xs font-medium text-slate-400">
                                Click để xem các phản ánh
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="inline-flex items-center justify-center rounded-full bg-rose-100 px-3 py-1 text-sm font-black text-rose-600 shadow-sm ring-4 ring-white">
                                {cat.count}
                              </span>
                              <span className="mt-1.5 text-[10px] font-semibold tracking-wider text-rose-400 uppercase">
                                Lượt
                              </span>
                            </div>
                          </div>

                          <div className="flex-1 rounded-xl border border-rose-50 bg-white/70 p-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                            <h5 className="mb-3 flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                              <MessageSquareWarning className="h-3.5 w-3.5 text-rose-400" />
                              Vấn đề thường gặp
                            </h5>
                            <ul className="space-y-3">
                              {cat.commonIssues?.map(
                                (issue: string, issueIdx: number) => (
                                  <li
                                    key={issueIdx}
                                    className="flex items-start text-sm leading-relaxed text-slate-700"
                                  >
                                    <span className="mt-2 mr-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400 opacity-80"></span>
                                    <span>{issue}</span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
