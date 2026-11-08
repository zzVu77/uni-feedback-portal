"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { PostCommentsSentimentStats } from "@/types/social-listening";

interface SentimentRatioBarProps {
  stats?: PostCommentsSentimentStats;
  totalComments?: number;
  className?: string;
}

export const SentimentRatioBar: React.FC<SentimentRatioBarProps> = ({
  stats,
  totalComments = 0,
  className,
}) => {
  if (!stats || totalComments === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border border-slate-200/80 bg-slate-50 p-3.5",
          className,
        )}
      >
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium">Phân bố cảm xúc bình luận</span>
          <span>Chưa có dữ liệu</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-slate-200" />
      </div>
    );
  }

  const { negative, stressAnxiety, neutral, positive } = stats;
  const negativeTotal = negative + stressAnxiety;
  const sumEvaluated = negativeTotal + neutral + positive;

  const negativePct =
    sumEvaluated > 0 ? Math.round((negativeTotal / sumEvaluated) * 100) : 0;
  const neutralPct =
    sumEvaluated > 0 ? Math.round((neutral / sumEvaluated) * 100) : 0;
  const positivePct =
    sumEvaluated > 0 ? Math.max(0, 100 - negativePct - neutralPct) : 0;

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5",
        className,
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
          Tỉ lệ cảm xúc cộng đồng
        </span>
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-xs font-bold",
            negativePct >= 60
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : negativePct >= 30
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700",
          )}
        >
          {negativePct}% Tiêu cực
        </span>
      </div>

      {/* Multi-segment progress bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-200 shadow-inner">
        {negativePct > 0 && (
          <div
            style={{ width: `${negativePct}%` }}
            className="group relative h-full bg-rose-500 transition-all duration-300"
            title={`Tiêu cực: ${negativeTotal} (${negativePct}%)`}
          />
        )}
        {neutralPct > 0 && (
          <div
            style={{ width: `${neutralPct}%` }}
            className="group relative h-full bg-sky-400 transition-all duration-300"
            title={`Trung lập: ${neutral} (${neutralPct}%)`}
          />
        )}
        {positivePct > 0 && (
          <div
            style={{ width: `${positivePct}%` }}
            className="group relative h-full bg-emerald-500 transition-all duration-300"
            title={`Tích cực: ${positive} (${positivePct}%)`}
          />
        )}
      </div>

      {/* Legend with counts */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] font-medium text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
          <span>Bức xúc / Tiêu cực:</span>
          <span className="font-bold text-rose-700">{negativeTotal}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-sky-400" />
          <span>Trung lập:</span>
          <span className="font-bold text-sky-700">{neutral}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          <span>Tích cực:</span>
          <span className="font-bold text-emerald-700">{positive}</span>
        </div>
      </div>
    </div>
  );
};
