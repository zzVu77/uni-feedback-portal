/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAiReportDetail,
  useGetAiReports,
  useTriggerAiReport,
} from "@/hooks/queries/useAiAnalyticsQueries";
import { ReportPeriodType } from "@/types/ai-analytics";
import { format, subDays } from "date-fns";
import {
  Activity,
  Calendar,
  FileText,
  Loader2,
  MessageSquareWarning,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function AiAnalyticsDashboard() {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isTriggerOpen, setIsTriggerOpen] = useState(false);
  const [periodType, setPeriodType] = useState<ReportPeriodType>(
    ReportPeriodType.WEEKLY,
  );
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 7), "yyyy-MM-dd"),
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const { data: reports, isLoading: isReportsLoading } = useGetAiReports();
  const { data: reportDetail, isLoading: isDetailLoading } =
    useGetAiReportDetail(selectedReportId || "");
  const triggerMutation = useTriggerAiReport();

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

  const getSentimentColor = (score: number) => {
    if (score < -0.5) return "text-red-600";
    if (score < 0) return "text-orange-500";
    if (score > 0.5) return "text-green-600";
    return "text-slate-600";
  };

  return (
    <div className="flex h-full flex-col gap-6 md:flex-row">
      {/* Left Sidebar: List of Reports */}
      <Card className="flex h-[calc(100vh-200px)] w-full flex-col md:w-1/3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-3">
          <div>
            <CardTitle className="text-lg">Danh sách Báo cáo</CardTitle>
            <CardDescription>Các báo cáo đã tạo</CardDescription>
          </div>

          {/* Trigger Dialog */}
          <Dialog open={isTriggerOpen} onOpenChange={setIsTriggerOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                Tạo Mới
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo Báo cáo AI Thủ công</DialogTitle>
                <DialogDescription>
                  Hệ thống sẽ chạy ngầm và tốn một vài phút để hoàn thành việc
                  phân tích dữ liệu.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Loại kỳ
                  </Label>
                  <Select
                    value={periodType}
                    onValueChange={(v) => setPeriodType(v as ReportPeriodType)}
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="start" className="text-right">
                    Từ ngày
                  </Label>
                  <Input
                    id="start"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="end" className="text-right">
                    Đến ngày
                  </Label>
                  <Input
                    id="end"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsTriggerOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleTrigger}
                  disabled={triggerMutation.isPending}
                >
                  {triggerMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Bắt đầu tạo
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0">
          {isReportsLoading ? (
            <div className="p-4 text-center text-slate-500">Đang tải...</div>
          ) : reports?.length === 0 ? (
            <div className="p-4 text-center text-slate-500">
              Chưa có báo cáo nào.
            </div>
          ) : (
            <div className="flex flex-col divide-y">
              {reports?.map((r) => (
                <div
                  key={r.id}
                  className={`cursor-pointer p-4 transition-colors hover:bg-slate-50 ${selectedReportId === r.id ? "border-l-4 border-blue-500 bg-blue-50" : ""}`}
                  onClick={() => setSelectedReportId(r.id)}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      Báo cáo {r.periodType === "WEEKLY" ? "Tuần" : "Tháng"}
                    </span>
                    <span className="flex items-center text-xs text-slate-500">
                      <Calendar className="mr-1 h-3 w-3" />
                      {format(new Date(r.createdAt), "dd/MM/yyyy HH:mm")}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Từ: {format(new Date(r.startDate), "dd/MM/yyyy")} - Đến:{" "}
                    {format(new Date(r.endDate), "dd/MM/yyyy")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right Content: Report Details */}
      <Card className="h-[calc(100vh-200px)] w-full overflow-y-auto md:w-2/3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Chi tiết Báo Cáo Phân Tích
          </CardTitle>
          {!selectedReportId && (
            <CardDescription>
              Vui lòng chọn một báo cáo ở danh sách bên trái để xem chi tiết.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {isDetailLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Loader2 className="mb-4 h-8 w-8 animate-spin" />
              <p>Đang tải chi tiết báo cáo...</p>
            </div>
          )}

          {!isDetailLoading && !selectedReportId && (
            <div className="flex h-64 items-center justify-center rounded-md border border-dashed bg-slate-50">
              <p className="text-sm text-slate-500">Chưa chọn báo cáo nào</p>
            </div>
          )}

          {!isDetailLoading && reportDetail && (
            <div className="flex flex-col gap-8 pb-8">
              {/* Overall Summary & Sentiment */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <div className="col-span-3 space-y-3">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Tổng quan tình hình
                  </h3>
                  <div className="rounded-lg border bg-slate-50 p-4 text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
                    {reportDetail.overallSummary}
                  </div>
                </div>

                <div className="col-span-1 space-y-3">
                  <h3 className="text-center text-lg font-semibold">
                    Chỉ số Cảm xúc
                  </h3>
                  <div className="flex h-full flex-col items-center justify-center rounded-lg border bg-slate-50 p-4">
                    <span
                      className={`text-4xl font-bold ${getSentimentColor(reportDetail.sentimentScore)}`}
                    >
                      {reportDetail.sentimentScore?.toFixed(2) || "0.0"}
                    </span>
                    <span className="mt-2 text-center text-xs text-slate-500">
                      (-1.0 Tiêu cực đến 1.0 Tích cực)
                    </span>
                    <div className="mt-4 text-sm font-medium text-slate-600">
                      {reportDetail.totalFeedbacksAnalyzed} feedbacks đã phân
                      tích
                    </div>
                  </div>
                </div>
              </div>

              {/* Frequent Categories */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <MessageSquareWarning className="h-5 w-5 text-red-500" />
                  Các danh mục thường bị khiếu nại
                </h3>
                <div className="grid gap-4">
                  {reportDetail.frequentCategories?.map(
                    (cat: any, idx: number) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-red-100 bg-red-50 p-4 shadow-sm"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          {cat.categoryId ? (
                            <Link
                              href={`/admin/feedbacks-management?categoryId=${cat.categoryId}`}
                              className="font-semibold text-blue-600 hover:underline"
                            >
                              {cat.categoryName}
                            </Link>
                          ) : (
                            <h4 className="font-semibold text-slate-800">
                              {cat.categoryName}
                            </h4>
                          )}
                          <span className="rounded-full border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-600">
                            {cat.count} lượt
                          </span>
                        </div>
                        <ul className="list-disc space-y-2 pl-5">
                          {cat.commonIssues?.map(
                            (issue: string, issueIdx: number) => (
                              <li
                                key={issueIdx}
                                className="text-sm text-slate-700"
                              >
                                {issue}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    ),
                  )}
                  {(!reportDetail.frequentCategories ||
                    reportDetail.frequentCategories.length === 0) && (
                    <p className="text-sm text-slate-500">
                      Không có danh mục khiếu nại nổi bật nào.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
