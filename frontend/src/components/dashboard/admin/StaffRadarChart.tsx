"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { RadarStatsDto, ReportFilter } from "@/types/report";
import { useMemo } from "react";

// Config màu sắc: Blue (Resolved) & Red (Unresolved)
const chartConfig = {
  resolved: {
    label: "Đã xử lý",
    color: "hsl(221.2 83.2% 53.3%)", // Blue tone
  },
  unresolved: {
    label: "Chưa xử lý",
    color: "hsl(0 84.2% 60.2%)", // Red tone
  },
} satisfies ChartConfig;

interface Props {
  data?: RadarStatsDto[];
  isLoading: boolean;
  filter: ReportFilter; // Nhận filter để hiển thị năm
}

export function StaffRadarChart({ data, isLoading, filter }: Props) {
  // Lấy năm từ filter để hiển thị lên UI
  const displayYear = useMemo(() => {
    if (filter.to) return new Date(filter.to).getFullYear();
    return new Date().getFullYear();
  }, [filter.to]);

  if (isLoading) {
    return (
      <div className="h-[350px] w-full animate-pulse rounded-xl bg-gray-100" />
    );
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="items-center pb-4">
        <CardTitle>Tổng quan năm {displayYear}</CardTitle>
        <CardDescription>
          So sánh trạng thái xử lý theo từng tháng
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] w-full"
        >
          <RadarChart data={data || []}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              // Có thể format lại tên tháng cho ngắn gọn nếu cần (Jan, Feb...)
              tickFormatter={(val) => val.replace("Tháng ", "T")}
            />
            <PolarGrid />

            <Radar
              dataKey="resolved"
              fill="var(--color-resolved)"
              fillOpacity={0.5}
              stroke="var(--color-resolved)"
              strokeWidth={2}
            />

            <Radar
              dataKey="unresolved"
              fill="var(--color-unresolved)"
              fillOpacity={0.5}
              stroke="var(--color-unresolved)"
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 border-t pt-4 text-sm">
        <div className="text-muted-foreground flex w-full items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm border border-[hsl(221.2,83.2%,53.3%)] bg-[hsl(221.2,83.2%,53.3%)] opacity-50"></div>
            <span>Đã xử lý </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm border border-[hsl(0,84.2%,60.2%)] bg-[hsl(0,84.2%,60.2%)] opacity-50"></div>
            <span>Chưa xử lý </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
