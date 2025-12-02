/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/components/dashboard/FeedbackTrendChart.tsx
"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { FeedbackTrendDto } from "@/types/report";

// Config color to Blue (Tailwind blue-600 approx)
const chartConfig = {
  count: {
    label: "Số lượng",
    color: "hsl(221.2 83.2% 53.3%)", // Blue 600
  },
} satisfies ChartConfig;

interface Props {
  data?: FeedbackTrendDto[];
  isLoading: boolean;
}

export const FeedbackTrendChart = ({ data, isLoading }: Props) => {
  if (isLoading)
    return (
      <div className="h-[300px] w-full animate-pulse rounded-xl bg-gray-100" />
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Xu hướng góp ý</CardTitle>
        <CardDescription>
          Số lượng góp ý theo ngày trong giai đoạn đã chọn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <AreaChart
            data={data || []}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-count)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-count)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(5)} // Show MM-DD only
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="count"
              type="natural"
              fill="url(#fillCount)"
              fillOpacity={0.4}
              stroke="var(--color-count)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
