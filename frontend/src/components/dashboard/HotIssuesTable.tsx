import React from "react";
import { FeedbackPost } from "@/types/dashboard";
import { Flame, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface HotIssuesTableProps {
  data: FeedbackPost[];
}

const HotIssuesTable: React.FC<HotIssuesTableProps> = ({ data }) => {
  // Sort by engagement_score descending and take top 10
  const topIssues = [...data]
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
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-6">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900">
          Vấn đề tiêu điểm
        </h3>
        <p className="text-sm text-slate-500">
          Top 10 phản hồi có mức độ tương tác cao nhất
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-slate-100 hover:bg-transparent">
            <TableHead className="w-[150px] font-medium text-slate-500">
              Mức độ ưu tiên
            </TableHead>
            <TableHead className="font-medium text-slate-500">
              Tóm tắt vấn đề
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
          {topIssues.map((post) => (
            <TableRow key={post.post_id} className="group border-slate-100">
              <TableCell className="py-4">
                <div className="flex items-center gap-2 font-semibold text-slate-700">
                  <Flame className="h-4 w-4 text-orange-500" />
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
                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default HotIssuesTable;
