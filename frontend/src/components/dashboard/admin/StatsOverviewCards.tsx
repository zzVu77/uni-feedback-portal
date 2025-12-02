// src/components/dashboard/StatsOverviewCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsOverviewDto } from "@/types/report";
import { Activity, CheckCircle2, Clock, XCircle } from "lucide-react";

interface Props {
  data?: StatsOverviewDto;
  isLoading: boolean;
}

export const StatsOverviewCards = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  const items = [
    {
      title: "Tổng số góp ý",
      value: data?.totalFeedbacks || 0,
      icon: Activity,
      color: "text-blue-600", // Blue tone
      desc: "Tổng tiếp nhận toàn thời gian",
    },
    {
      title: "Đang chờ xử lý",
      value: data?.pendingCount || 0,
      icon: Clock,
      color: "text-red-500", // Red tone (Warning/Action needed)
      desc: "Cần xử lý ngay",
    },
    {
      title: "Đã giải quyết",
      value: data?.resolvedCount || 0,
      icon: CheckCircle2,
      color: "text-blue-500", // Blue tone (Success)
      desc: "Đã đóng thành công",
    },
    {
      title: "Đã từ chối",
      value: data?.rejectedCount || 0,
      icon: XCircle,
      color: "text-red-600", // Red tone (Negative)
      desc: "Không hợp lệ hoặc spam",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-muted-foreground text-xs">{item.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
