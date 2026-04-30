import React, { useState } from "react";
import { FeedbackPost } from "@/types/social-listening";
import { ExternalLink, ThumbsUp, MessageSquare, Bot, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface HotIssuesTableProps {
  data: FeedbackPost[];
}

type TabType = "Tất cả" | "Tiêu cực" | "Tích cực";

const HotIssuesTable: React.FC<HotIssuesTableProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<TabType>("Tất cả");

  // State quản lý bài post đang được chọn để hiển thị trên Dialog
  const [selectedPost, setSelectedPost] = useState<FeedbackPost | null>(null);

  const processedData =
    activeTab === "Tất cả"
      ? data
      : data.filter((post) => post.sentimentLabel === activeTab);

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
        return "bg-blue-100 text-blue-700 border-blue-200";
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
              ? "Danh sách phản hồi cần chú ý"
              : `Các vấn đề ${activeTab.toLowerCase()} cần chú ý`}
          </p>
        </div>

        <div className="flex items-center rounded-lg bg-slate-100 p-1">
          {(["Tất cả", "Tiêu cực", "Tích cực"] as TabType[]).map((tab) => (
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

      <div className="w-full overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="border-slate-100 hover:bg-transparent">
              {/* Cột được chia lại tỷ lệ sau khi bỏ icon Chevron */}
              <TableHead className="w-[35%] pl-6 font-medium text-slate-500">
                Vấn đề cốt lõi
              </TableHead>
              <TableHead className="w-[15%] font-medium text-slate-500">
                Chủ đề
              </TableHead>
              <TableHead className="w-[15%] font-medium text-slate-500">
                Phân loại
              </TableHead>
              <TableHead className="w-[15%] font-medium text-slate-500">
                Tương tác
              </TableHead>
              <TableHead className="w-[10%] font-medium text-slate-500">
                Ngày đăng
              </TableHead>
              <TableHead className="w-[10%] pr-6 text-right font-medium text-slate-500">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topIssues.length > 0 ? (
              topIssues.map((post) => (
                <TableRow
                  key={post.postId}
                  className="group cursor-pointer border-slate-100 transition-colors hover:bg-slate-50"
                  onClick={() => setSelectedPost(post)} // MỞ DIALOG TẠI ĐÂY
                >
                  <TableCell className="py-4 pl-6">
                    <div className="w-full max-w-[250px] md:max-w-[350px] lg:max-w-[400px]">
                      <p className="truncate font-medium text-slate-800">
                        {post.aiSummary}
                      </p>
                    </div>
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

                  <TableCell className="py-4 pr-6 text-right">
                    <a
                      href={post.postLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()} // Chặn event click truyền lên TableRow
                      className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
                    >
                      Nguồn
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

      <Dialog
        open={!!selectedPost}
        onOpenChange={(open) => !open && setSelectedPost(null)}
      >
        <DialogContent className="max-h-[80vh] overflow-auto p-0 sm:max-w-[650px] md:h-auto md:overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between text-lg font-semibold text-slate-900">
                Chi tiết phản hồi
                {selectedPost && (
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide",
                      getSentimentStyles(selectedPost.sentimentLabel),
                    )}
                  >
                    {selectedPost.sentimentLabel}
                  </span>
                )}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-slate-500">
                {selectedPost &&
                  `Đăng ngày ${format(new Date(selectedPost.postedAt), "dd/MM/yyyy 'lúc' HH:mm")} • Chủ đề: ${selectedPost.topic}`}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-6 p-6">
            {/* AI analysis */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-600">
                <Bot className="h-4 w-4" />
                <h4 className="text-sm font-bold tracking-wider">
                  Tóm tắt vấn đề bởi AI
                </h4>
              </div>
              <p className="text-[15px] leading-relaxed text-slate-700">
                {selectedPost?.aiSummary}
              </p>
            </div>

            <hr className="border-slate-100" />

            {/* Original content of the post */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-500">
                <User className="h-4 w-4 text-orange-500" />
                <h4 className="text-sm font-bold tracking-wider text-orange-400">
                  Nội dung gốc
                </h4>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-600">
                  "{selectedPost?.content}"
                </p>
              </div>
            </div>

            {/* Interaction statistics at the bottom */}
            {selectedPost && (
              <div className="flex flex-col items-center justify-between gap-4 py-1 md:flex-row">
                <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <ThumbsUp className="h-4 w-4 text-blue-500" />
                    {selectedPost.reactionCount} Lượt thích
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                    {selectedPost.commentCount} Bình luận
                  </span>
                </div>

                {/* Nút hành động mở link gốc */}
                {selectedPost.postLink && (
                  <Button
                    onClick={() =>
                      window.open(selectedPost.postLink!, "_blank")
                    }
                    variant="default"
                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Xem bài đăng gốc
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HotIssuesTable;
