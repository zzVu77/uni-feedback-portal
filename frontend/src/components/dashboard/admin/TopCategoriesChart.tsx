/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/components/dashboard/TopCategoriesChart.tsx
"use client";

import { Bar, BarChart, CartesianGrid, XAxis, LabelList } from "recharts";
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
import { TopCategoryDto } from "@/types/report";

// Config color to Blue (Tailwind blue-600 approx)
const chartConfig = {
  count: {
    label: "Số lượng",
    color: "hsl(221.2 83.2% 53.3%)", // Blue 600
  },
} satisfies ChartConfig;

interface Props {
  data?: TopCategoryDto[];
  isLoading: boolean;
}

export const TopCategoriesChart = ({ data, isLoading }: Props) => {
  if (isLoading)
    return (
      <div className="h-[300px] w-full animate-pulse rounded-xl bg-gray-100" />
    );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Danh mục hàng đầu</CardTitle>
        <CardDescription>Các vấn đề được phản ánh nhiều nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data || []} margin={{ top: 20 }}>
            <CartesianGrid className="mt-10 py-10" vertical={false} />
            <XAxis
              dataKey="categoryName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                value.length > 10 ? `${value.slice(0, 10)}...` : value
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="count"
              className="mt-10 py-10"
              fill="var(--color-count)"
              radius={8}
            >
              <LabelList
                position="insideTop"
                offset={12}
                className="fill-white font-semibold"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
