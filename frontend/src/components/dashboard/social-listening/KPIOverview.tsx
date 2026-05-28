import React from "react";
import { KPIOverviewData } from "@/types/social-listening";
import {
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  ThumbsUp,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
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
          iconColor: "text-emerald-500",
          ring: "ring-emerald-100",
        };
      case "Tiêu cực":
        return {
          bg: "bg-rose-50",
          text: "text-rose-600",
          iconColor: "text-rose-500",
          ring: "ring-rose-100",
        };
      case "Trung lập":
        return {
          bg: "bg-slate-100",
          text: "text-slate-600",
          iconColor: "text-slate-500",
          ring: "ring-slate-200",
        };
      case "Stress lo âu":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-600",
          iconColor: "text-yellow-500",
          ring: "ring-yellow-100",
        };
      default:
        return {
          bg: "bg-indigo-50",
          text: "text-indigo-600",
          iconColor: "text-indigo-500",
          ring: "ring-indigo-100",
        };
    }
  };

  const trendStyles = getSentimentStyles(dominantSentiment);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Card 1: Total Posts */}
      <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:shadow-md hover:ring-black/10">
        <div className="mb-5 flex items-center justify-between">
          <div className="rounded-xl bg-indigo-50/80 p-3 ring-1 ring-indigo-100/50 transition-transform group-hover:scale-110 group-hover:bg-indigo-100">
            <MessageSquare className="h-6 w-6 text-indigo-600" />
          </div>
          <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
            Tổng quan
          </span>
        </div>
        <p className="mb-1 text-[13px] font-bold tracking-wider text-slate-500 uppercase">
          Tổng số bài đăng
        </p>
        <h3 className="mb-3 text-3xl font-bold tracking-tight text-slate-900">
          {totalPosts.toLocaleString()}
        </h3>
        <div className="mt-auto flex items-center gap-4 border-t border-slate-100 pt-3 text-sm font-medium text-slate-600">
          <span className="tooltip-trigger flex items-center gap-1.5">
            <ThumbsUp className="h-4 w-4 text-slate-400" />
            <span className="font-bold text-slate-700">
              {totalReactions.toLocaleString()}
            </span>
          </span>
          <span className="tooltip-trigger flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4 text-slate-400" />
            <span className="font-bold text-slate-700">
              {totalComments.toLocaleString()}
            </span>
          </span>
        </div>
      </div>

      {/* Card 2: Dominant Trend */}
      <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:shadow-md hover:ring-black/10">
        <div className="mb-5 flex items-center justify-between">
          <div
            className={cn(
              "rounded-xl p-3 ring-1 transition-transform group-hover:scale-110",
              trendStyles.bg,
              trendStyles.ring,
            )}
          >
            <TrendingUp className={cn("h-6 w-6", trendStyles.iconColor)} />
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
              trendStyles.bg,
              trendStyles.text,
              trendStyles.ring,
            )}
          >
            Chủ đạo
          </span>
        </div>
        <p className="mb-1 text-[13px] font-bold tracking-wider text-slate-500 uppercase">
          Xu hướng phản hồi
        </p>
        <h3
          className={cn(
            "mb-3 text-3xl font-bold tracking-tight",
            trendStyles.text,
          )}
        >
          {dominantSentiment}
        </h3>
        <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-3 text-sm font-medium text-slate-600">
          <span className="line-clamp-1">{sentimentTrendText}</span>
        </div>
      </div>

      {/* Card 3: Negative Posts */}
      <div className="group flex flex-col rounded-2xl border border-rose-100 bg-white p-6 shadow-sm ring-1 ring-rose-500/5 transition-all duration-300 hover:shadow-md hover:ring-rose-500/10">
        <div className="mb-5 flex items-center justify-between">
          <div className="rounded-xl bg-rose-50/80 p-3 ring-1 ring-rose-100/50 transition-transform group-hover:scale-110 group-hover:bg-rose-100">
            <AlertTriangle className="h-6 w-6 text-rose-600" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-100 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-600">
            <AlertCircle className="h-3 w-3" /> Chú ý
          </span>
        </div>
        <p className="mb-1 text-[13px] font-bold tracking-wider text-rose-500/80 uppercase">
          Bài đăng tiêu cực và stress lo âu
        </p>
        <h3 className="mb-3 text-3xl font-bold tracking-tight text-rose-600">
          {negativePostsCount.toLocaleString()}
        </h3>
        <div className="mt-auto flex items-center gap-2 border-t border-rose-50 pt-3 text-sm font-medium text-rose-600/80">
          Cần rà soát các vấn đề tiêu cực này
        </div>
      </div>
    </div>
  );
};

export default KPIOverview;
