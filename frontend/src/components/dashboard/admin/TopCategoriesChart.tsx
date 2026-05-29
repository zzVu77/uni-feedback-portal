/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/components/dashboard/TopCategoriesChart.tsx
"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TopCategoryDto } from "@/types/report";
import { Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

// Config color to Violet
const chartConfig = {
  count: {
    label: "Số lượng",
    color: "#8b5cf6", // violet-500
  },
  label: {
    color: "#64748b", // slate-500
  },
} satisfies ChartConfig;

interface Props {
  data?: TopCategoryDto[];
  isLoading: boolean;
  type?: "admin" | "staff";
}

export const TopCategoriesChart = ({ data, isLoading, type }: Props) => {
  const router = useRouter();

  if (isLoading)
    return (
      <div className="h-[300px] w-full animate-pulse rounded-2xl bg-slate-200/60" />
    );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200/50">
      <div className="mb-6 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
            <Layers className="h-4 w-4" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-slate-900">
            Danh mục hàng đầu
          </h3>
        </div>
        <p className="pl-10 text-sm font-medium text-slate-500">
          Các vấn đề được phản ánh nhiều nhất
        </p>
      </div>

      <div className="flex-1">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data || []}
            layout="vertical"
            margin={{
              right: 30,
              left: -10, // pull slightly left for aesthetics
            }}
          >
            <CartesianGrid
              horizontal={false}
              strokeDasharray="4 4"
              stroke="#e2e8f0"
            />

            <YAxis
              dataKey="categoryName"
              type="category"
              tickLine={false}
              axisLine={false}
              width={140}
              tick={{ fontSize: 13, fill: "#475569", fontWeight: 500 }}
              tickFormatter={(value) =>
                value.length > 20 ? `${value.slice(0, 20)}...` : value
              }
            />

            <XAxis dataKey="count" type="number" hide />

            <ChartTooltip
              cursor={{ fill: "rgba(241, 245, 249, 0.5)" }} // slate-100/50
              content={
                <ChartTooltipContent
                  indicator="line"
                  className="border-slate-100 bg-white/95 shadow-xl backdrop-blur-sm"
                />
              }
            />

            <Bar
              dataKey="count"
              layout="vertical"
              fill="var(--color-count)"
              radius={[0, 4, 4, 0]}
              barSize={24}
              className="cursor-pointer transition-opacity hover:opacity-80"
              onClick={(entry: any) => {
                const id = entry.categoryId || entry.id;
                if (id) {
                  router.push(
                    `/${type === "staff" ? "staff/list-feedbacks" : "admin/feedbacks-management"}?categoryId=${id}`,
                  );
                }
              }}
            >
              <LabelList
                dataKey="count"
                position="right"
                offset={12}
                className="fill-slate-600 font-bold"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};
