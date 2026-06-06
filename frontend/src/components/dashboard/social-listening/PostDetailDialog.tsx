import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { FeedbackPost } from "@/types/social-listening";
import { format } from "date-fns";
import {
  AlertCircle,
  Bot,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  MinusCircle,
  ThumbsUp,
  User,
} from "lucide-react";
import React from "react";

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
  if (!post) return null;

  const sentiment = getSentimentInfo(post.sentimentLabel);

  return (
    <Dialog open={!!post} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-[700px]">
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
                  {post.sentimentLabel}
                </Badge>
                <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                  <CalendarDays className="h-4 w-4" />
                  {format(new Date(post.postedAt), "dd/MM/yyyy 'lúc' HH:mm")}
                </span>
              </div>

              <DialogTitle className="text-2xl leading-tight font-bold text-slate-900">
                Vấn đề phản hồi
              </DialogTitle>
              <DialogDescription className="mt-2 text-base font-medium text-slate-600">
                Thuộc chủ đề:{" "}
                <span className="ml-1 rounded-md border bg-white px-2 py-0.5 text-[12px] text-slate-800 shadow-sm md:text-[14px]">
                  {post.topic}
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
                  {post.aiSummary}
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
                  "{post.content}"
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
                      {post.reactionCount}
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
                      {post.commentCount}
                    </span>
                  </div>
                </div>
              </div>

              {post.postLink && (
                <Button
                  onClick={() => window.open(post.postLink!, "_blank")}
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
      </DialogContent>
    </Dialog>
  );
};
