// src/components/dashboard/admin/SingleDeptPerformanceChart.tsx
"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { TopDepartmentStatsDto } from "@/types/report";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

const chartConfig = {
  resolved: {
    label: "Đã xử lý",
    color: "#10b981", // emerald-500
  },
  unresolved: {
    label: "Chưa xử lý",
    color: "#f43f5e", // rose-500
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
  className?: string;
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
  const total = dept.resolvedCount + dept.unresolvedCount;
  const resolutionRate =
    total > 0 ? Math.round((dept.resolvedCount / total) * 100) : 0;

  return (
    <div
      className={cn(
        "group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-slate-200/50 transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-100 hover:bg-slate-50/50 hover:shadow-lg hover:ring-indigo-100",
        className,
      )}
    >
      <div className="mb-2 flex w-full items-center justify-between px-1">
        <div
          className="line-clamp-1 flex-1 text-sm font-bold tracking-tight text-slate-700 transition-colors group-hover:text-indigo-700"
          title={dept.departmentName}
        >
          {dept.departmentName}
        </div>
        <div className="ml-2 flex shrink-0 items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-700">
          {total} góp ý
        </div>
      </div>

      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-full max-w-[140px] transition-transform duration-300 group-hover:scale-105"
      >
        <RadialBarChart
          data={chartData}
          endAngle={180}
          innerRadius={55}
          outerRadius={90}
        >
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                className="border-slate-100 bg-white/95 shadow-xl backdrop-blur-sm"
              />
            }
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
                        className="fill-slate-400 text-[10px] font-medium"
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

      <div className="mt-1 flex w-full justify-between rounded-xl border border-slate-100/50 bg-slate-50/50 p-2 transition-colors group-hover:border-slate-200/50">
        <div className="flex flex-col items-start px-2">
          <span className="text-[10px] font-medium tracking-wider text-emerald-600/70 uppercase">
            Đã xử lý
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-emerald-600">
              {dept.resolvedCount}
            </span>
            <span className="text-[10px] font-medium text-emerald-600/50">
              ({resolutionRate}%)
            </span>
          </div>
        </div>
        <div className="w-[1px] bg-slate-200/60" />
        <div className="flex flex-col items-end px-2">
          <span className="text-[10px] font-medium tracking-wider text-rose-600/70 uppercase">
            Chưa xử lý
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-rose-600">
              {dept.unresolvedCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
