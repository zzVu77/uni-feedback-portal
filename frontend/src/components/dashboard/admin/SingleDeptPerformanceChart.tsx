"use client";

import { TopDepartmentStatsDto } from "@/types/report";
import { cn } from "@/lib/utils";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Cấu hình màu sắc Chart
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

const getPerformanceColor = (hours: number) => {
  if (hours === 0) return "fill-slate-400/80";
  if (hours <= 24) return "fill-emerald-400/80";
  if (hours <= 72) return "fill-amber-400/80";
  return "fill-rose-400/80";
};

interface Props {
  dept: TopDepartmentStatsDto;
  className?: string; // Cho phép override style container nếu cần
}

export const SingleDeptPerformanceChart = ({ dept, className }: Props) => {
  const chartData = [
    {
      month: "data",
      resolved: dept.resolvedCount,
      unresolved: dept.unresolvedCount,
    },
  ];

  const performanceColor = getPerformanceColor(dept.avgResolutionTimeHours);

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-lg p-2 transition-colors hover:bg-slate-50",
        className,
      )}
    >
      <div
        className="mb-2 line-clamp-1 h-5 w-full px-2 text-center text-sm font-medium"
        title={dept.departmentName}
      >
        {dept.departmentName}
      </div>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-full max-w-40"
      >
        <RadialBarChart
          data={chartData}
          endAngle={180}
          innerRadius={55}
          outerRadius={90}
        >
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 16}
                        className={cn("text-xl font-bold", performanceColor)}
                      >
                        {dept.avgResolutionTimeHours.toFixed(1)}h
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 4}
                        className="fill-muted-foreground text-[10px]"
                      >
                        Trung bình
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
          <RadialBar
            dataKey="unresolved"
            fill="var(--color-unresolved)"
            stackId="a"
            cornerRadius={5}
            className="stroke-transparent stroke-2"
          />
          <RadialBar
            dataKey="resolved"
            fill="var(--color-resolved)"
            stackId="a"
            cornerRadius={5}
            className="stroke-transparent stroke-2"
          />
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
};
