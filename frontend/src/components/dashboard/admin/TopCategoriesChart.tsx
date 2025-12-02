/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import { useRouter } from "next/navigation"; // 1. Import router
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
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

// Config color
const chartConfig = {
  count: {
    label: "Số lượng",
    color: "hsl(221.2 83.2% 53.3%)",
  },
  label: {
    color: "hsl(var(--foreground))",
  },
} satisfies ChartConfig;

interface Props {
  data?: (TopCategoryDto & { categoryId?: string })[];
  isLoading: boolean;
}

export const TopCategoriesChart = ({ data, isLoading }: Props) => {
  const router = useRouter(); // 2. Init router

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
          <BarChart
            accessibilityLayer
            data={data || []}
            layout="vertical"
            margin={{
              right: 30,
              left: 10,
            }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />

            <YAxis
              dataKey="categoryName"
              type="category"
              tickLine={false}
              axisLine={false}
              width={140}
              tick={{ fontSize: 13, fill: "hsl(var(--foreground))" }}
              tickFormatter={(value) =>
                value.length > 20 ? `${value.slice(0, 20)}...` : value
              }
            />

            <XAxis dataKey="count" type="number" hide />

            <ChartTooltip
              cursor={{ fill: "transparent" }}
              content={<ChartTooltipContent indicator="line" />}
            />

            <Bar
              dataKey="count"
              layout="vertical"
              fill="var(--color-count)"
              radius={4}
              barSize={32}
              className="cursor-pointer"
              onClick={(entry: any) => {
                const id = entry.categoryId || entry.id;
                if (id) {
                  router.push(`/admin/feedbacks-management?categoryId=${id}`);
                }
              }}
            >
              <LabelList
                dataKey="count"
                position="right"
                offset={10}
                className="fill-foreground font-bold"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
