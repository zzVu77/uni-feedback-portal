import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  AlertCircle,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  MessageSquare,
  MinusCircle,
  Sparkles,
  Tag,
  ThumbsUp,
  User,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

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

  const getSentimentInfo = (label: string) => {
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
                      <FileText className="h-8 w-8 text-slate-300" />
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

      {/* Modern Detail Modal */}
      <Dialog
        open={!!selectedPost}
        onOpenChange={(open) => !open && setSelectedPost(null)}
      >
        <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-[700px]">
          {selectedPost &&
            (() => {
              const sentiment = getSentimentInfo(selectedPost.sentimentLabel);
              return (
                <>
                  <div
                    className={cn(
                      "relative shrink-0 overflow-hidden px-8 py-6",
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
                      <div className="mb-2 flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className={cn(
                            "border bg-white px-3 py-1 font-bold shadow-sm",
                            sentiment.color,
                            sentiment.border,
                          )}
                        >
                          {sentiment.icon}
                          {selectedPost.sentimentLabel}
                        </Badge>
                        <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                          <CalendarDays className="h-4 w-4" />
                          {format(
                            new Date(selectedPost.postedAt),
                            "dd/MM/yyyy 'lúc' HH:mm",
                          )}
                        </span>
                      </div>

                      <DialogTitle className="text-2xl leading-tight font-bold text-slate-900">
                        Vấn đề phản hồi
                      </DialogTitle>
                      <DialogDescription className="mt-2 text-base font-medium text-slate-600">
                        Thuộc chủ đề:{" "}
                        <span className="ml-1 rounded-md border bg-white px-2 py-0.5 text-[12px] text-slate-800 shadow-sm md:text-[14px]">
                          {selectedPost.topic}
                        </span>
                      </DialogDescription>
                    </DialogHeader>
                  </div>

                  <div className="flex-1 space-y-8 overflow-y-auto bg-white p-8">
                    {/* AI Summary Section */}
                    <div className="relative">
                      <div className="absolute top-0 bottom-0 -left-3 w-1 rounded-full bg-indigo-200" />
                      <div className="pl-4">
                        <div className="mb-2.5 flex items-center gap-2 text-indigo-600">
                          <Bot className="h-5 w-5" />
                          <h4 className="text-base font-bold tracking-wider uppercase">
                            AI Tóm tắt
                          </h4>
                        </div>
                        <p className="text-[16px] leading-relaxed font-medium text-slate-800">
                          {selectedPost.aiSummary}
                        </p>
                      </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Original Content Section */}
                    <div>
                      <div className="mb-3 flex items-center gap-2 text-slate-500">
                        <User className="h-5 w-5 text-amber-500" />
                        <h4 className="text-sm font-bold tracking-wider text-amber-600 uppercase">
                          Nội dung gốc
                        </h4>
                      </div>
                      <div className="relative rounded-xl border border-amber-100 bg-amber-50/30 p-5 shadow-inner">
                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-slate-700 italic">
                          "{selectedPost.content}"
                        </p>
                      </div>
                    </div>

                    {/* Actions & Metrics */}
                    <div className="flex flex-col items-center justify-between gap-4 pt-4 sm:flex-row">
                      <div className="flex items-center gap-6 rounded-xl border border-slate-100 bg-slate-50 p-3 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <ThumbsUp className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              Lượt thích
                            </span>
                            <span className="text-sm font-bold text-slate-700">
                              {selectedPost.reactionCount}
                            </span>
                          </div>
                        </div>
                        <div className="h-8 w-px bg-slate-200" />
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                            <MessageSquare className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              Bình luận
                            </span>
                            <span className="text-sm font-bold text-slate-700">
                              {selectedPost.commentCount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {selectedPost.postLink && (
                        <Button
                          onClick={() =>
                            window.open(selectedPost.postLink!, "_blank")
                          }
                          size="lg"
                          className="w-full bg-indigo-600 text-white shadow-md transition-transform hover:bg-indigo-700 active:scale-95 sm:w-auto"
                        >
                          Mở bài đăng gốc
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HotIssuesTable;
