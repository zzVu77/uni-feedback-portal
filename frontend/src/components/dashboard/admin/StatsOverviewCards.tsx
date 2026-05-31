// src/components/dashboard/StatsOverviewCards.tsx
import { StatsOverviewDto } from "@/types/report";
import { Activity, CheckCircle2, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  data?: StatsOverviewDto;
  isLoading: boolean;
}

export const StatsOverviewCards = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[120px] w-full animate-pulse rounded-2xl bg-slate-200/60"
          />
        ))}
      </div>
    );
  }

  const items = [
    {
      title: "Tổng số góp ý",
      value: data?.totalFeedbacks || 0,
      icon: Activity,
      desc: "Tổng tiếp nhận toàn thời gian",
      styles: {
        bg: "bg-indigo-50",
        text: "text-indigo-600",
        iconColor: "text-indigo-500",
        ring: "ring-indigo-100",
      },
    },
    {
      title: "Đang chờ xử lý",
      value: data?.pendingCount || 0,
      icon: Clock,
      desc: "Cần xử lý ngay",
      styles: {
        bg: "bg-amber-50",
        text: "text-amber-600",
        iconColor: "text-amber-500",
        ring: "ring-amber-100",
      },
    },
    {
      title: "Đã giải quyết",
      value: data?.resolvedCount || 0,
      icon: CheckCircle2,
      desc: "Đã đóng thành công",
      styles: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        iconColor: "text-emerald-500",
        ring: "ring-emerald-100",
      },
    },
    {
      title: "Đã từ chối",
      value: data?.rejectedCount || 0,
      icon: XCircle,
      desc: "Không hợp lệ hoặc spam",
      styles: {
        bg: "bg-rose-50",
        text: "text-rose-600",
        iconColor: "text-rose-500",
        ring: "ring-rose-100",
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md",
            "animate-in fade-in slide-in-from-bottom-4 fill-mode-both",
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium tracking-tight text-slate-500">
              {item.title}
            </h3>
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ring-1 transition-transform duration-300 group-hover:scale-110",
                item.styles.bg,
                item.styles.iconColor,
                item.styles.ring,
              )}
            >
              <item.icon className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-1">
            <div
              className={cn(
                "text-3xl font-bold tracking-tight",
                item.styles.text,
              )}
            >
              {item.value.toLocaleString()}
            </div>
            <p className="text-xs font-medium text-slate-400">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
