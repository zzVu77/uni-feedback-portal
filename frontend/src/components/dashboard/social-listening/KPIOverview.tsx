import React from "react";
import { KPIOverviewData } from "@/types/social-listening";
import { MessageSquare, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPIOverviewProps {
  data: KPIOverviewData;
}

const KPIOverview: React.FC<KPIOverviewProps> = ({ data }) => {
  const {
    totalPosts,
    totalReactions,
    totalComments,
    negativePostsCount,
    dominantSentiment,
    sentimentTrendText,
  } = data;

  const getSentimentStyles = (sentiment: string) => {
    switch (sentiment) {
      case "Tích cực":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-600",
          iconColor: "text-emerald-600",
        };
      case "Tiêu cực":
        return {
          bg: "bg-rose-50",
          text: "text-rose-600",
          iconColor: "text-rose-600",
        };
      case "Trung lập":
        return {
          bg: "bg-slate-50",
          text: "text-slate-600",
          iconColor: "text-slate-600",
        };
      default:
        return {
          bg: "bg-blue-50",
          text: "text-blue-600",
          iconColor: "text-blue-600",
        };
    }
  };

  const trendStyles = getSentimentStyles(dominantSentiment);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Card 1: Total Posts */}
      <div className="flex items-start justify-between rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <div>
          <p className="mb-1 text-sm font-medium text-slate-500">
            Tổng số bài đăng
          </p>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
            {totalPosts.toLocaleString()}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {totalReactions.toLocaleString()} tương tác,{" "}
            {totalComments.toLocaleString()} bình luận
          </p>
        </div>
        <div className="rounded-lg bg-blue-50 p-2.5">
          <MessageSquare className="h-5 w-5 text-blue-600" />
        </div>
      </div>

      {/* Card 2: Dominant Trend */}
      <div className="flex items-start justify-between rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <div>
          <p className="mb-1 text-sm font-medium text-slate-500">
            Xu hướng phản hồi
          </p>
          <h3
            className={cn(
              "text-2xl font-semibold tracking-tight",
              trendStyles.text,
            )}
          >
            {dominantSentiment}
          </h3>
          <p className="mt-1 text-xs text-slate-500">{sentimentTrendText}</p>
        </div>
        <div className={cn("rounded-lg p-2.5", trendStyles.bg)}>
          <TrendingUp className={cn("h-5 w-5", trendStyles.iconColor)} />
        </div>
      </div>

      {/* Card 3: Negative Posts */}
      <div className="flex items-start justify-between rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <div>
          <p className="mb-1 text-sm font-medium text-slate-500">
            Bài đăng tiêu cực
          </p>
          <h3 className="text-2xl font-semibold tracking-tight text-rose-600">
            {negativePostsCount.toLocaleString()}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Cần lưu ý các vấn đề tiêu cực này
          </p>
        </div>
        <div className="rounded-lg bg-rose-50 p-2.5">
          <AlertTriangle className="h-5 w-5 text-rose-600" />
        </div>
      </div>
    </div>
  );
};

export default KPIOverview;
