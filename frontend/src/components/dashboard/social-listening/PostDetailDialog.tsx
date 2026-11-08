/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import { format } from "date-fns";
import {
  AlertCircle,
  AlertTriangle,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Flame,
  MessageSquare,
  MinusCircle,
  RefreshCw,
  Sparkles,
  ThumbsUp,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetPostComments,
  useTriggerCrawlComments,
} from "@/hooks/queries/useSocialListeningQueries";
import { cn } from "@/lib/utils";
import { FeedbackPost, GetPostCommentsParams } from "@/types/social-listening";
import { CommentCard } from "./CommentCard";
import { CommentFilterType, CommentsFilterTabs } from "./CommentsFilterTabs";
import { SentimentRatioBar } from "./SentimentRatioBar";

export const getSentimentInfo = (label: string) => {
  switch (label) {
    case "Tiêu cực":
      return {
        color: "text-rose-700",
        bg: "bg-rose-50",
        border: "border-rose-200",
        icon: <AlertCircle className="mr-1 h-3.5 w-3.5" />,
        lightBg: "bg-rose-50/50",
        indicator: "bg-rose-500",
      };
    case "Tích cực":
      return {
        color: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        icon: <CheckCircle2 className="mr-1 h-3.5 w-3.5" />,
        lightBg: "bg-emerald-50/50",
        indicator: "bg-emerald-500",
      };
    case "Trung lập":
      return {
        color: "text-blue-700",
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: <MinusCircle className="mr-1 h-3.5 w-3.5" />,
        lightBg: "bg-blue-50/50",
        indicator: "bg-blue-500",
      };
    case "Stress lo âu":
      return {
        color: "text-yellow-700",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        icon: <AlertCircle className="mr-1 h-3.5 w-3.5" />,
        lightBg: "bg-yellow-50/50",
        indicator: "bg-yellow-500",
      };
    default:
      return {
        color: "text-slate-600",
        bg: "bg-slate-100",
        border: "border-slate-200",
        icon: null,
        lightBg: "bg-slate-50",
        indicator: "bg-slate-400",
      };
  }
};

interface PostDetailDialogProps {
  post: FeedbackPost | null;
  onClose: () => void;
}

export const PostDetailDialog: React.FC<PostDetailDialogProps> = ({
  post,
  onClose,
}) => {
  // Filters & Pagination state for comments
  const [activeTab, setActiveTab] = useState<CommentFilterType>("all");
  const [sortBy, setSortBy] = useState<"reactions" | "date">("reactions");
  const [page, setPage] = useState<number>(1);

  // Compute query params for comments
  const commentsParams: GetPostCommentsParams = {
    page,
    limit: 15,
    sortBy,
    ...(activeTab === "negative" && { sentimentLabel: "Tiêu cực" }),
    ...(activeTab === "top_concern" && { isTopConcern: true }),
    ...(activeTab === "positive_neutral" && { sentimentLabel: "Tích cực" }),
  };

  // TanStack queries & mutations
  const {
    data: commentsData,
    isLoading: isLoadingComments,
    isFetching: isFetchingComments,
  } = useGetPostComments(post?.postId, commentsParams);

  const { mutate: triggerCrawl, isPending: isCrawling } =
    useTriggerCrawlComments();

  if (!post) return null;

  const sentiment = getSentimentInfo(post.sentimentLabel);
  const isUrgent =
    post.urgencyLevel === "CRITICAL" ||
    (post.negativeCommentsRatio != null && post.negativeCommentsRatio >= 70) ||
    post.sentimentLabel === "Tiêu cực";

  const commentsSummary =
    commentsData?.postInfo?.commentsAiSummary || post.commentsAiSummary;
  const isCrawled =
    commentsData?.postInfo?.isCommentsCrawled ??
    post.isCommentsCrawled ??
    false;

  const handleTabChange = (tab: CommentFilterType) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleSortChange = (newSort: "reactions" | "date") => {
    setSortBy(newSort);
    setPage(1);
  };

  const handleTriggerCrawl = () => {
    triggerCrawl(post.postId, {
      onSuccess: (res) => {
        toast.success(
          res.message ||
            "Đã gửi yêu cầu quét bình luận cho bài viết thành công!",
        );
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message ||
            "Không thể kích hoạt quét bình luận. Vui lòng thử lại sau.",
        );
      },
    });
  };

  const totalPages = commentsData?.pagination?.totalPages || 1;
  const commentsList = commentsData?.comments || [];

  return (
    <Dialog open={!!post} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[92vh] w-[96vw] flex-col overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-[1100px] xl:max-w-[1250px]">
        {/* Header Bar */}
        <div
          className={cn(
            "relative shrink-0 overflow-hidden border-b border-slate-200/80 px-6 py-4.5",
            sentiment.lightBg,
          )}
        >
          <div
            className={cn(
              "absolute top-0 left-0 h-full w-1.5",
              sentiment.indicator,
            )}
          />

          <DialogHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "border bg-white px-2.5 py-0.5 font-bold shadow-2xs",
                    sentiment.color,
                    sentiment.border,
                  )}
                >
                  {sentiment.icon}
                  {post.sentimentLabel}
                </Badge>

                {isUrgent && (
                  <Badge className="animate-pulse gap-1 bg-rose-600 px-2.5 py-0.5 font-semibold text-white shadow-2xs hover:bg-rose-700">
                    <Flame className="h-3.5 w-3.5" />
                    Cấp bách / Cần chú ý
                  </Badge>
                )}

                <span className="rounded-md border border-slate-200/80 bg-white/90 px-2 py-0.5 text-xs font-semibold text-slate-700 shadow-2xs">
                  {post.topic}
                </span>
              </div>

              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                {format(new Date(post.postedAt), "dd/MM/yyyy 'lúc' HH:mm")}
              </span>
            </div>

            <DialogTitle className="mt-1.5 text-xl font-bold tracking-tight text-slate-900">
              Điều Tra Chi Tiết Dư Luận & Luồng Bình Luận Mạng Xã Hội
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Phân tích đa chiều phản ứng sinh viên, mức độ nghiêm trọng và
              trích xuất bằng chứng xử lý kịp thời.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* 2-Column Responsive Body */}
        <div className="grid flex-1 grid-cols-1 overflow-hidden bg-slate-50/50 lg:grid-cols-12">
          {/* ================= LEFT COLUMN: Post Overview & AI Synthesis (40%) ================= */}
          <div className="flex max-h-[45vh] flex-col gap-4 overflow-y-auto border-b border-slate-200/80 bg-white p-5 sm:p-6 lg:col-span-5 lg:max-h-[calc(92vh-100px)] lg:border-r lg:border-b-0">
            {/* Crisis Alert Banner */}
            {isUrgent && (
              <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 text-rose-900 shadow-2xs">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
                <div className="text-xs leading-relaxed">
                  <span className="block font-bold text-rose-800">
                    Cảnh báo khủng hoảng dư luận
                  </span>
                  Bài viết có mức độ tiêu cực cao hoặc bức xúc lan rộng. Cần ưu
                  tiên xem xét và lập Ticket xử lý nội bộ.
                </div>
              </div>
            )}

            {/* AI Summary Section */}
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 shadow-2xs">
              <div className="mb-2 flex items-center gap-2 text-indigo-700">
                <Bot className="h-4 w-4" />
                <h4 className="text-xs font-bold tracking-wider uppercase">
                  AI Tóm tắt bài đăng
                </h4>
              </div>
              <p className="text-xs leading-relaxed font-medium text-slate-700">
                {post.aiSummary}
              </p>
            </div>

            {/* AI Comments Synthesis Section */}
            {commentsSummary && (
              <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 shadow-2xs">
                <div className="mb-2 flex items-center gap-2 text-amber-800">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <h4 className="text-xs font-bold tracking-wider uppercase">
                    AI Tổng hợp dư luận từ bình luận
                  </h4>
                </div>
                <p className="text-xs leading-relaxed font-medium whitespace-pre-wrap text-slate-800">
                  {commentsSummary}
                </p>
              </div>
            )}

            {/* Original Post Content Box */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 shadow-inner">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-800">
                    {post.author}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3 text-blue-500" />
                    {post.reactionCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3 text-orange-500" />
                    {post.commentCount}
                  </span>
                </div>
              </div>

              <p className="text-xs leading-relaxed whitespace-pre-wrap text-slate-700 italic">
                "{post.content}"
              </p>
            </div>

            {/* Sentiment Ratio Bar */}
            <SentimentRatioBar
              stats={commentsData?.sentimentStats}
              totalComments={commentsData?.totalComments ?? post.commentCount}
            />

            {/* Action Buttons */}
            {post.postLink && (
              <div className="mt-auto pt-3">
                <Button
                  onClick={() => window.open(post.postLink!, "_blank")}
                  className="w-full gap-2 bg-indigo-600 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 active:scale-[0.99]"
                >
                  <span>Mở bài đăng gốc trên Facebook</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>

          {/* ================= RIGHT COLUMN: Interactive Comments Thread (60%) ================= */}
          <div className="flex max-h-[50vh] flex-col bg-slate-50/60 p-5 sm:p-6 lg:col-span-7 lg:max-h-[calc(92vh-100px)]">
            {/* Filter Toolbar */}
            <CommentsFilterTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              onRefresh={handleTriggerCrawl}
              isRefreshing={isCrawling || isFetchingComments}
              totalComments={commentsData?.totalComments ?? post.commentCount}
              className="mb-3"
            />

            {/* Comments List Container */}
            <div className="min-h-[300px] flex-1 space-y-2.5 overflow-y-auto pr-1">
              {isLoadingComments ? (
                <div className="space-y-3 p-2">
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
              ) : commentsList.length > 0 ? (
                commentsList.map((c) => (
                  <CommentCard key={c.id || c.commentId} comment={c} />
                ))
              ) : !isCrawled ? (
                /* Empty state: Not crawled yet */
                <div className="my-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center shadow-2xs">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 shadow-inner">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h4 className="mb-1 text-sm font-bold text-slate-800">
                    Chưa có dữ liệu bình luận chi tiết
                  </h4>
                  <p className="mb-4 max-w-sm text-xs leading-relaxed text-slate-500">
                    Hệ thống chưa tự động cào các bình luận của bài viết này.
                    Bạn có thể nhấn nút bên dưới để khởi chạy bộ quét bình luận
                    on-demand.
                  </p>
                  <Button
                    onClick={handleTriggerCrawl}
                    disabled={isCrawling}
                    className="gap-1.5 bg-indigo-600 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
                  >
                    <RefreshCw
                      className={cn(
                        "h-3.5 w-3.5",
                        isCrawling && "animate-spin",
                      )}
                    />
                    <span>
                      {isCrawling
                        ? "Đang gửi lệnh quét..."
                        : "Quét bình luận bài viết ngay"}
                    </span>
                  </Button>
                </div>
              ) : (
                /* Empty state: Filter returned nothing */
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                  <p className="text-xs font-medium">
                    Không tìm thấy bình luận nào phù hợp với bộ lọc hiện tại.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTabChange("all")}
                    className="mt-2 text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    Xem tất cả bình luận
                  </Button>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-3 flex items-center justify-between border-t border-slate-200/80 pt-3 text-xs">
                <span className="font-medium text-slate-500">
                  Trang <span className="font-bold text-slate-800">{page}</span>{" "}
                  / {totalPages}
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1 || isFetchingComments}
                    className="h-7 w-7 border-slate-200 bg-white p-0 shadow-2xs"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages || isFetchingComments}
                    className="h-7 w-7 border-slate-200 bg-white p-0 shadow-2xs"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetailDialog;
