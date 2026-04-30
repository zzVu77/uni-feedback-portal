import React, { useState } from "react";
import { FeedbackPost } from "@/types/social-listening";
import { ExternalLink, ThumbsUp, MessageSquare } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface HotIssuesTableProps {
  data: FeedbackPost[];
}

type TabType = "Tiêu cực" | "Tích cực" | "Tất cả";

const HotIssuesTable: React.FC<HotIssuesTableProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<TabType>("Tiêu cực");

  // Filter logic
  const processedData =
    activeTab === "Tất cả"
      ? data
      : data.filter((post) => post.sentimentLabel === activeTab);

  // Sort by sentiment_score ascending, then (reaction + comment) descending
  const topIssues = [...processedData]
    .sort((a, b) => {
      if (a.sentimentScore !== b.sentimentScore) {
        return a.sentimentScore - b.sentimentScore;
      }
      const engagementA = a.reactionCount + a.commentCount;
      const engagementB = b.reactionCount + b.commentCount;
      return engagementB - engagementA;
    })
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
            {activeTab === "Tất cả"
              ? "Danh sách tất cả phản hồi"
              : `Các vấn đề ${activeTab.toLowerCase()} cần chú ý`}
          </p>
        </div>

        {/* 3-Way Tab Selector */}
        <div className="flex items-center rounded-lg bg-slate-100 p-1">
          {(["Tiêu cực", "Tích cực", "Tất cả"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium transition-all duration-200",
                activeTab === tab
                  ? "rounded-md bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-slate-100 hover:bg-transparent">
            <TableHead className="font-medium text-slate-500">
              Tóm tắt vấn đề
            </TableHead>
            <TableHead className="font-medium text-slate-500">Chủ đề</TableHead>
            <TableHead className="font-medium text-slate-500">
              Phân loại
            </TableHead>
            <TableHead className="font-medium text-slate-500">
              Tương tác
            </TableHead>
            <TableHead className="font-medium text-slate-500">
              Ngày đăng
            </TableHead>
            <TableHead className="text-right font-medium text-slate-500">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topIssues.length > 0 ? (
            topIssues.map((post) => (
              <TableRow key={post.postId} className="group border-slate-100">
                <TableCell className="py-4">
                  <p className="line-clamp-2 max-w-[400px] text-sm text-slate-600">
                    {post.aiSummary}
                  </p>
                </TableCell>
                <TableCell className="py-4">
                  <span className="text-sm text-slate-500">{post.topic}</span>
                </TableCell>
                <TableCell className="py-4">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                      getSentimentStyles(post.sentimentLabel),
                    )}
                  >
                    {post.sentimentLabel}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {post.reactionCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {post.commentCount}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <span className="text-sm whitespace-nowrap text-slate-500">
                    {format(new Date(post.postedAt), "dd/MM/yyyy")}
                  </span>
                </TableCell>
                <TableCell className="py-4 text-right">
                  <a
                    href={post.postLink || "#"}
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
                colSpan={6}
                className="py-12 text-center text-sm text-slate-400"
              >
                Không có dữ liệu phản hồi phù hợp.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default HotIssuesTable;
