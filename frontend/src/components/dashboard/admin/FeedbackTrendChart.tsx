/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/components/dashboard/FeedbackTrendChart.tsx
"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { FeedbackTrendDto } from "@/types/report";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

// Config color to Blue
const chartConfig = {
  count: {
    label: "Số lượng",
    color: "#3b82f6", // blue-500
  },
} satisfies ChartConfig;

interface Props {
  data?: FeedbackTrendDto[];
  isLoading: boolean;
}

export const FeedbackTrendChart = ({ data, isLoading }: Props) => {
  if (isLoading)
    return (
      <div className="h-[350px] w-full animate-pulse rounded-2xl bg-slate-200/60" />
    );

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200/50">
      <div className="mb-6 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <TrendingUp className="h-4 w-4" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-slate-900">
            Xu hướng góp ý
          </h3>
        </div>
        <p className="pl-10 text-sm font-medium text-slate-500">
          Số lượng góp ý theo ngày trong giai đoạn đã chọn
        </p>
      </div>

      <div className="flex-1">
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <AreaChart
            data={data || []}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-count)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-count)"
                  stopOpacity={0.0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickFormatter={(value) => value.slice(5)} // Show MM-DD only
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <ChartTooltip
              cursor={{
                stroke: "#cbd5e1",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  className="border-slate-100 bg-white/95 shadow-xl backdrop-blur-sm"
                />
              }
            />
            <Area
              dataKey="count"
              type="monotone"
              fill="url(#fillCount)"
              fillOpacity={1}
              stroke="var(--color-count)"
              strokeWidth={3}
              activeDot={{ r: 6, strokeWidth: 0, fill: "var(--color-count)" }}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
};
