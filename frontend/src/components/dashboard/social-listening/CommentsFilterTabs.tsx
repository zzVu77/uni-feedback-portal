"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Flame,
  MessageCircle,
  RefreshCw,
  Sparkles,
  ThumbsUp,
} from "lucide-react";
import React from "react";

export type CommentFilterType =
  | "all"
  | "negative"
  | "top_concern"
  | "positive_neutral";

interface CommentsFilterTabsProps {
  activeTab: CommentFilterType;
  onTabChange: (tab: CommentFilterType) => void;
  sortBy: "reactions" | "date";
  onSortChange: (sort: "reactions" | "date") => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  totalComments?: number;
  className?: string;
}

export const CommentsFilterTabs: React.FC<CommentsFilterTabsProps> = ({
  activeTab,
  onTabChange,
  sortBy,
  onSortChange,
  onRefresh,
  isRefreshing = false,
  totalComments = 0,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 border-b border-slate-200/80 pb-2",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Quick filter tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onTabChange("all")}
            className={cn(
              "flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              activeTab === "all"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800",
            )}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Tất cả</span>
            {totalComments > 0 && (
              <span
                className={cn(
                  "py-0.2 ml-1 rounded-full px-1.5 text-[10px]",
                  activeTab === "all"
                    ? "bg-indigo-700/60 text-white"
                    : "bg-slate-200 text-slate-700",
                )}
              >
                {totalComments}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange("negative")}
            className={cn(
              "flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              activeTab === "negative"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700",
            )}
          >
            <Flame className="h-3.5 w-3.5 text-rose-400" />
            <span>Tiêu cực & Bức xúc</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("top_concern")}
            className={cn(
              "flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              activeTab === "top_concern"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700",
            )}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Bằng chứng cụ thể</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("positive_neutral")}
            className={cn(
              "flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              activeTab === "positive_neutral"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700",
            )}
          >
            <span>Tích cực / Trung lập</span>
          </button>
        </div>

        {/* Sort & Re-crawl actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Sort selector */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => onSortChange("reactions")}
              className={cn(
                "flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-all",
                sortBy === "reactions"
                  ? "bg-slate-100 font-bold text-slate-800"
                  : "text-slate-500 hover:text-slate-800",
              )}
              title="Sắp xếp theo nhiều tương tác nhất"
            >
              <ThumbsUp className="h-3 w-3" />
              <span>Nhiều like</span>
            </button>
            <button
              type="button"
              onClick={() => onSortChange("date")}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium transition-all",
                sortBy === "date"
                  ? "bg-slate-100 font-bold text-slate-800"
                  : "text-slate-500 hover:text-slate-800",
              )}
              title="Sắp xếp theo mới nhất"
            >
              Mới nhất
            </button>
          </div>

          {/* Re-crawl button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-8 gap-1.5 border-slate-200 bg-white px-2.5 text-xs text-slate-700 shadow-2xs hover:bg-slate-50"
            title="Quét lại hoặc nạp bình luận mới"
          >
            <RefreshCw
              className={cn(
                "h-3.5 w-3.5 text-indigo-600",
                isRefreshing && "animate-spin",
              )}
            />
            <span className="hidden sm:inline">Quét lại</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
