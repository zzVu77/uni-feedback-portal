/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { format } from "date-fns";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Bot,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Flame,
  MessageSquare,
  RefreshCw,
  Sparkles,
  ThumbsUp,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

import Wrapper from "@/components/shared/Wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetPostById,
  useGetPostComments,
  useTriggerCrawlComments,
} from "@/hooks/queries/useSocialListeningQueries";
import { cn } from "@/lib/utils";
import { GetPostCommentsParams } from "@/types/social-listening";
import { CommentCard } from "./CommentCard";
import { CommentFilterType, CommentsFilterTabs } from "./CommentsFilterTabs";
import { getSentimentInfo } from "./PostDetailDialog";
import { SentimentRatioBar } from "./SentimentRatioBar";

interface PostDetailPageProps {
  /** Optional custom back URL if router.back() is not desired */
  backUrl?: string;
}

export const PostDetailPage: React.FC<PostDetailPageProps> = ({ backUrl }) => {
  const router = useRouter();
  const params = useParams();
  const postId = params.postId as string;
  const dataSourceId = params.id as string | undefined;

  // Filters & Pagination state for comments
  const [activeTab, setActiveTab] = useState<CommentFilterType>("all");
  const [sortBy, setSortBy] = useState<"reactions" | "date">("reactions");
  const [page, setPage] = useState<number>(1);

  // TanStack queries
  const {
    data: post,
    isLoading: isLoadingPost,
    isError: isPostError,
  } = useGetPostById(postId);

  const commentsParams: GetPostCommentsParams = {
    page,
    limit: 15,
    sortBy,
    ...(activeTab === "negative" && { sentimentLabel: "Tiêu cực" }),
    ...(activeTab === "top_concern" && { isTopConcern: true }),
    ...(activeTab === "positive_neutral" && { sentimentLabel: "Tích cực" }),
  };

  const {
    data: commentsData,
    isLoading: isLoadingComments,
    isFetching: isFetchingComments,
  } = useGetPostComments(postId, commentsParams);

  const { mutate: triggerCrawl, isPending: isCrawling } =
    useTriggerCrawlComments();

  const handleTabChange = (tab: CommentFilterType) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleSortChange = (newSort: "reactions" | "date") => {
    setSortBy(newSort);
    setPage(1);
  };

  const handleTriggerCrawl = () => {
    if (!postId) return;
    triggerCrawl(postId, {
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

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else if (dataSourceId) {
      router.back();
    } else {
      router.back();
    }
  };

  if (isLoadingPost) {
    return (
      <Wrapper classNames={{ container: "max-w-6xl mx-auto px-4 sm:px-6" }}>
        <div className="space-y-6 py-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-8 w-64 rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </Wrapper>
    );
  }

  if (isPostError || !post) {
    return (
      <Wrapper classNames={{ container: "max-w-6xl mx-auto px-4 sm:px-6" }}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-200">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-slate-900">
            Không tìm thấy bài viết
          </h2>
          <p className="mb-6 max-w-md text-sm text-slate-500">
            Bài viết với mã ID này không tồn tại trong hệ thống hoặc đã bị xóa.
          </p>
          <Button
            onClick={handleBack}
            className="gap-2 bg-indigo-600 font-semibold text-white hover:bg-indigo-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại trang danh sách</span>
          </Button>
        </div>
      </Wrapper>
    );
  }

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

  const totalPages = commentsData?.pagination?.totalPages || 1;
  const commentsList = commentsData?.comments || [];

  return (
    <Wrapper classNames={{ container: "max-w-6xl mx-auto px-4 sm:px-6" }}>
      <div className="flex flex-col gap-6 py-6">
        {/* Navigation & Header Bar */}
        <div className="flex flex-col gap-3.5 border-b border-slate-200/80 pb-5">
          {/* Top Row: Back button & Timestamp */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="-ml-2 gap-1.5 font-semibold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại danh sách</span>
            </Button>

            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
              Đăng ngày:{" "}
              {format(new Date(post.postedAt), "dd/MM/yyyy 'lúc' HH:mm")}
            </span>
          </div>

          {/* Main Title Row: Title + Badges & Facebook Action Button */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Chi Tiết Dư Luận & Luồng Bình Luận Mạng Xã Hội
              </h1>

              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "border bg-white px-2.5 py-0.5 text-xs font-bold shadow-2xs",
                    sentiment.color,
                    sentiment.border,
                  )}
                >
                  {sentiment.icon}
                  {post.sentimentLabel}
                </Badge>

                {isUrgent && (
                  <Badge className="animate-pulse gap-1 bg-rose-600 px-2.5 py-0.5 text-xs font-semibold text-white shadow-2xs hover:bg-rose-700">
                    <Flame className="h-3.5 w-3.5" />
                    Cấp bách / Cần chú ý
                  </Badge>
                )}

                <span className="rounded-md border border-slate-200/80 bg-slate-100/90 px-2.5 py-0.5 text-xs font-semibold text-slate-700 shadow-2xs">
                  Chủ đề: {post.topic}
                </span>

                <span className="ml-1 text-xs font-medium text-slate-500">
                  &bull; Tác giả bài đăng:{" "}
                  <strong className="font-semibold text-slate-800">
                    {post.author}
                  </strong>
                </span>
              </div>
            </div>

            {/* Quick Action: Open Facebook Link */}
            {post.postLink && (
              <Button
                onClick={() => window.open(post.postLink!, "_blank")}
                className="shrink-0 gap-2 self-start bg-indigo-600 font-semibold text-white shadow-sm hover:bg-indigo-700 lg:self-auto"
              >
                <span>Mở bài đăng gốc trên Facebook</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* 1. Crisis Alert Banner (if urgent) */}
        {isUrgent && (
          <div className="flex items-start gap-3.5 rounded-2xl border border-rose-200 bg-rose-50/80 p-4.5 text-rose-900 shadow-2xs">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
            <div className="text-xs leading-relaxed sm:text-sm">
              <span className="mb-0.5 block text-sm font-bold text-rose-800 sm:text-base">
                Cảnh báo dư luận tiêu cực cao
              </span>
              Bài viết ghi nhận phản ứng bức xúc hoặc chỉ số tiêu cực vượt
              ngưỡng cảnh báo an toàn. Nhà trường cần chủ động nắm bắt thông tin
              và đưa ra thông báo định hướng kịp thời.
            </div>
          </div>
        )}

        {/* 2. SECTION 1: Tổng quan bài đăng & Phân tích chuyên sâu từ AI */}
        <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Post Header Meta */}
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
                <User className="h-5 w-5 text-slate-500" />
              </div>
              <div>
                <span className="block text-base leading-tight font-bold text-slate-900">
                  {post.author}
                </span>
                <span className="text-xs text-slate-400">
                  Đăng trên Facebook &bull;{" "}
                  {format(new Date(post.postedAt), "dd/MM/yyyy 'lúc' HH:mm")}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-blue-700">
                <ThumbsUp className="h-3.5 w-3.5" />
                {post.reactionCount} lượt thích
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-orange-100 bg-orange-50 px-3 py-1.5 text-orange-700">
                <MessageSquare className="h-3.5 w-3.5" />
                {post.commentCount} bình luận
              </span>
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700">
                Chủ đề: {post.topic}
              </span>
            </div>
          </div>

          {/* Original Post Content */}
          <div>
            <h4 className="mb-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
              Nội dung bài viết gốc
            </h4>
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4.5 text-sm leading-relaxed whitespace-pre-wrap text-slate-800 italic sm:text-base">
              "{post.content}"
            </div>
          </div>

          {/* AI Insights: 2 Cards side-by-side on desktop */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* AI Summary Section */}
            <div className="flex flex-col rounded-xl border border-indigo-100 bg-indigo-50/40 p-5 shadow-2xs">
              <div className="mb-2.5 flex items-center gap-2 text-indigo-700">
                <Bot className="h-5 w-5" />
                <h3 className="text-xs font-bold tracking-wider uppercase">
                  AI Tóm tắt bài đăng
                </h3>
              </div>
              <p className="text-sm leading-relaxed font-medium text-slate-800">
                {post.aiSummary}
              </p>
            </div>

            {/* AI Comments Synthesis Section */}
            <div className="flex flex-col rounded-xl border border-amber-200/80 bg-amber-50/50 p-5 shadow-2xs">
              <div className="mb-2.5 flex items-center gap-2 text-amber-800">
                <Sparkles className="h-5 w-5 text-amber-600" />
                <h3 className="text-xs font-bold tracking-wider uppercase">
                  AI Tổng hợp dư luận từ bình luận
                </h3>
              </div>
              {commentsSummary ? (
                <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap text-slate-800">
                  {commentsSummary}
                </p>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Chưa có dữ liệu tổng hợp dư luận từ AI cho bài viết này.
                </p>
              )}
            </div>
          </div>

          {/* Sentiment Ratio Bar */}
          <div className="border-t border-slate-100 pt-4">
            <SentimentRatioBar
              stats={commentsData?.sentimentStats}
              totalComments={commentsData?.totalComments ?? post.commentCount}
            />
          </div>
        </div>

        {/* 3. SECTION 2: Luồng bình luận & Phản hồi sinh viên */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex flex-wrap items-center gap-2 text-lg font-bold text-slate-900 sm:text-xl">
                <MessageSquare className="h-5 w-5 text-indigo-600" />
                <span>Chi tiết Luồng Bình Luận Sinh Viên</span>
                <Badge
                  variant="secondary"
                  className="border border-indigo-200 bg-indigo-50 text-xs font-bold text-indigo-700"
                >
                  {commentsData?.totalComments ?? 0} đã thu thập
                </Badge>
                {post.commentCount > (commentsData?.totalComments ?? 0) && (
                  <span className="text-xs font-medium text-slate-500">
                    (trên tổng số {post.commentCount} lượt phản hồi trên
                    Facebook)
                  </span>
                )}
              </h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Tra cứu, lọc phản hồi theo cảm xúc và phân tích các ý kiến bức
                xúc hoặc quan ngại hàng đầu.
              </p>
            </div>

            {post.commentCount > (commentsData?.totalComments ?? 0) && (
              <div className="self-start rounded-lg border border-amber-200/80 bg-amber-50 px-2.5 py-1.5 text-[11px] font-medium text-amber-700 sm:self-center">
                *Một số bình luận có thể bị Facebook ẩn/spam hoặc cần quét sâu
                hơn
              </div>
            )}
          </div>

          {/* Filter Toolbar */}
          <CommentsFilterTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            onRefresh={handleTriggerCrawl}
            isRefreshing={isCrawling || isFetchingComments}
            totalComments={commentsData?.totalComments ?? post.commentCount}
            className="mb-4"
          />

          {/* Comments List */}
          <div className="min-h-[300px] space-y-3">
            {isLoadingComments ? (
              <div className="space-y-3 p-2">
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
              </div>
            ) : commentsList.length > 0 ? (
              commentsList.map((c) => (
                <CommentCard key={c.id || c.commentId} comment={c} />
              ))
            ) : !isCrawled ? (
              /* Empty state: Not crawled yet */
              <div className="my-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-4 py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 shadow-inner ring-1 ring-indigo-100">
                  <MessageSquare className="h-7 w-7" />
                </div>
                <h4 className="mb-1 text-base font-bold text-slate-800">
                  Chưa có dữ liệu bình luận chi tiết
                </h4>
                <p className="mb-5 max-w-sm text-xs leading-relaxed text-slate-500">
                  Hệ thống chưa tự động cào các bình luận của bài viết này. Bạn
                  có thể nhấn nút bên dưới để khởi chạy bộ quét bình luận theo
                  yêu cầu.
                </p>
                <Button
                  onClick={handleTriggerCrawl}
                  disabled={isCrawling}
                  className="gap-2 bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  <RefreshCw
                    className={cn("h-4 w-4", isCrawling && "animate-spin")}
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
              <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
                <p className="text-sm font-medium">
                  Không tìm thấy bình luận nào phù hợp với bộ lọc hiện tại.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTabChange("all")}
                  className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Xem tất cả bình luận
                </Button>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-slate-200/80 pt-4 text-xs">
              <span className="font-medium text-slate-500">
                Hiển thị trang{" "}
                <span className="font-bold text-slate-800">{page}</span> /{" "}
                {totalPages}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || isFetchingComments}
                  className="gap-1 border-slate-200 bg-white font-medium shadow-2xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Trang trước</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || isFetchingComments}
                  className="gap-1 border-slate-200 bg-white font-medium shadow-2xs"
                >
                  <span>Trang sau</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default PostDetailPage;
