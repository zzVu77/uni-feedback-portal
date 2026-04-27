import React, { useState } from "react";
import { FeedbackPost } from "@/types/dashboard";
import { Flame, ExternalLink, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HotIssuesTableProps {
  data: FeedbackPost[];
}

const HotIssuesTable: React.FC<HotIssuesTableProps> = ({ data }) => {
  const [showAll, setShowAll] = useState(false);

  // Filter logic: Default to only Negative issues, or all if toggled
  const processedData = showAll
    ? data
    : data.filter((post) => post.sentiment_label === "Tiêu cực");

  // Sort by engagement_score descending and take top 10
  const topIssues = [...processedData]
    .sort((a, b) => b.engagement_score - a.engagement_score)
    .slice(0, 10);

  const getSentimentStyles = (label: string) => {
    switch (label) {
      case "Tiêu cực":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "Tích cực":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Trung lập":
        return "bg-slate-50 text-slate-700 border-slate-200";
      default:
        return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 md:flex-row md:items-center">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">
            Vấn đề tiêu điểm
          </h3>
          <p className="text-sm text-slate-500">
            {showAll
              ? "Danh sách tất cả phản hồi"
              : "Các vấn đề tiêu cực cần chú ý"}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className={cn(
            "rounded-lg border-slate-200 text-slate-600 transition-all",
            showAll && "border-slate-300 bg-slate-100 text-slate-900",
          )}
        >
          <Filter className="mr-2 h-4 w-4" />
          {showAll ? "Đang hiện tất cả" : "Hiển thị tất cả"}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-slate-100 hover:bg-transparent">
            <TableHead className="w-[150px] font-medium text-slate-500">
              Mức độ ưu tiên
            </TableHead>
            <TableHead className="font-medium text-slate-500">
              Tóm tắt AI
            </TableHead>
            <TableHead className="font-medium text-slate-500">Chủ đề</TableHead>
            <TableHead className="font-medium text-slate-500">
              Sắc thái
            </TableHead>
            <TableHead className="text-right font-medium text-slate-500">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topIssues.length > 0 ? (
            topIssues.map((post) => (
              <TableRow key={post.post_id} className="group border-slate-100">
                <TableCell className="py-4">
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <Flame
                      className={cn(
                        "h-4 w-4",
                        post.engagement_score > 50
                          ? "text-orange-500"
                          : "text-slate-400",
                      )}
                    />
                    {post.engagement_score}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <p className="line-clamp-2 max-w-[400px] text-sm text-slate-600">
                    {post.ai_summary}
                  </p>
                </TableCell>
                <TableCell className="py-4">
                  <span className="text-sm text-slate-500">{post.topic}</span>
                </TableCell>
                <TableCell className="py-4">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                      getSentimentStyles(post.sentiment_label),
                    )}
                  >
                    {post.sentiment_label}
                  </span>
                </TableCell>
                <TableCell className="py-4 text-right">
                  <a
                    href={post.post_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
                  >
                    Xem
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-12 text-center text-sm text-slate-400"
              >
                Không có dữ liệu phản hồi tiêu cực nào.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default HotIssuesTable;
