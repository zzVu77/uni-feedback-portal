import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { FeedbackPost, FeedbackTopic } from "@/types/social-listening";
import { format } from "date-fns";
import {
  Bot,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileTextIcon,
  MessageSquare,
  Sparkles,
  Tag,
  ThumbsUp,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { PostDetailDialog, getSentimentInfo } from "./PostDetailDialog";

interface HotIssuesTableProps {
  data: FeedbackPost[];
  total: number;
}

const HotIssuesTable: React.FC<HotIssuesTableProps> = ({ data, total }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedPost, setSelectedPost] = React.useState<FeedbackPost | null>(
    null,
  );

  const activeTab = searchParams.get("sentimentLabel") || "Tất cả";
  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const selectedTopic = searchParams.get("topic") || "all";

  const handleTopicChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") {
      params.set("topic", val);
    } else {
      params.delete("topic");
    }
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const pageCount = total ? Math.ceil(total / limit) : 0;

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "Tất cả") {
      params.delete("sentimentLabel");
    } else {
      params.set("sentimentLabel", tab);
    }
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-black/5">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-5 border-b border-slate-100 bg-slate-50/50 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Vấn đề tiêu biểu
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {activeTab === "Tất cả"
              ? "Theo dõi và phân tích các phản hồi nổi bật nhất trên mạng xã hội."
              : `Các vấn đề ${activeTab.toLowerCase()} đang được thảo luận sôi nổi.`}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Topic Filter */}
          <Select value={selectedTopic} onValueChange={handleTopicChange}>
            <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:ring-indigo-500 sm:w-[220px]">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-slate-400" />
                <SelectValue placeholder="Tất cả chủ đề" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-xl">
              <SelectItem value="all" className="font-medium">
                Tất cả chủ đề
              </SelectItem>
              {Object.values(FeedbackTopic).map((topic) => (
                <SelectItem key={topic} value={topic} className="font-medium">
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Premium Segmented Control */}
          <div className="inline-flex items-center rounded-xl bg-slate-200/50 p-1.5 shadow-inner">
            {[
              "Tất cả",
              "Tiêu cực",
              "Stress lo âu",
              "Tích cực",
              "Trung lập",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={cn(
                  "relative flex items-center justify-center rounded-lg px-2 py-2 text-xs font-semibold transition-all duration-300 md:px-4 md:text-sm",
                  activeTab === tab
                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50"
                    : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-700",
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full flex-1 overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="border-slate-100 bg-white hover:bg-white">
              <TableHead className="w-[35%] py-4 pl-8 font-semibold text-slate-600">
                Tóm tắt vấn đề (AI)
              </TableHead>
              <TableHead className="w-[15%] font-semibold text-slate-600">
                Chủ đề
              </TableHead>
              <TableHead className="w-[15%] font-semibold text-slate-600">
                Phân loại
              </TableHead>
              <TableHead className="w-[15%] font-semibold text-slate-600">
                Tương tác
              </TableHead>
              <TableHead className="w-[10%] font-semibold text-slate-600">
                Ngày đăng
              </TableHead>
              <TableHead className="w-[10%] pr-8 text-right font-semibold text-slate-600">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((post) => {
                const sentiment = getSentimentInfo(post.sentimentLabel);
                return (
                  <TableRow
                    key={post.postId}
                    className="group relative cursor-pointer border-b border-slate-100/50 transition-all duration-200 hover:bg-slate-50/80"
                    onClick={() => setSelectedPost(post)}
                  >
                    <TableCell className="py-5 pl-8">
                      <div className="flex w-full max-w-[250px] items-start gap-3 md:max-w-[350px] lg:max-w-[400px]">
                        <Bot className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500 opacity-70" />
                        <p
                          className="line-clamp-2 leading-relaxed font-medium text-slate-800 transition-colors group-hover:text-indigo-900"
                          title={post.aiSummary}
                        >
                          {post.aiSummary}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="py-5">
                      <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-100/80 px-2.5 py-1 text-sm font-medium text-slate-600">
                        <Tag className="h-3 w-3 text-slate-400" />
                        {post.topic}
                      </div>
                    </TableCell>

                    <TableCell className="py-5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "border px-2.5 py-1 font-semibold shadow-sm",
                          sentiment.bg,
                          sentiment.color,
                          sentiment.border,
                        )}
                      >
                        {sentiment.icon}
                        {post.sentimentLabel}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-5">
                      <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                        <div
                          className="tooltip-trigger flex items-center gap-1.5"
                          title="Lượt thích"
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <ThumbsUp className="h-3.5 w-3.5" />
                          </div>
                          {post.reactionCount}
                        </div>
                        <div
                          className="tooltip-trigger flex items-center gap-1.5"
                          title="Bình luận"
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                            <MessageSquare className="h-3.5 w-3.5" />
                          </div>
                          {post.commentCount}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-5">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                        {format(new Date(post.postedAt), "dd/MM")}
                      </div>
                    </TableCell>

                    <TableCell className="py-5 pr-8 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (post.postLink)
                            window.open(post.postLink, "_blank");
                        }}
                        className="font-semibold text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        Chi tiết <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <div className="mb-4 rounded-full bg-slate-50 p-4">
                      <FileTextIcon className="h-8 w-8 text-slate-300" />
                    </div>
                    <p className="text-base font-medium text-slate-600">
                      Không có dữ liệu phản hồi.
                    </p>
                    <p className="text-sm">
                      Hãy thử thay đổi bộ lọc để xem các kết quả khác.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <p className="text-sm font-medium text-slate-500">
            Hiển thị trang{" "}
            <span className="font-bold text-slate-700">{currentPage}</span> trên
            tổng số{" "}
            <span className="font-bold text-slate-700">{pageCount}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 w-8 border-slate-200 p-0 shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= pageCount}
              className="h-8 w-8 border-slate-200 p-0 shadow-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <PostDetailDialog
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
};

export default HotIssuesTable;
