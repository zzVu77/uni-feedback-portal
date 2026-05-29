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

  return (
    <div
      className={cn(
        "group flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-md",
        className,
      )}
    >
      <div
        className="mb-2 line-clamp-1 h-5 w-full px-2 text-center text-sm font-semibold tracking-tight text-slate-700 transition-colors group-hover:text-indigo-600"
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
    </div>
  );
};
