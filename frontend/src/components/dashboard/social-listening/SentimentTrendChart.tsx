import React from "react";
import { SentimentTrendItem } from "@/types/social-listening";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

interface SentimentTrendChartProps {
  data: SentimentTrendItem[];
}

const chartConfig = {
  positive: {
    label: "Tích cực",
    color: "#34d399",
  },
  neutral: {
    label: "Trung lập",
    color: "#7dd3fc",
  },
  negative: {
    label: "Tiêu cực",
    color: "#fb7185",
  },
} satisfies ChartConfig;

const SentimentTrendChart: React.FC<SentimentTrendChartProps> = ({ data }) => {
  return (
    <div className="h-full rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900">
          Xu hướng cảm xúc
        </h3>
        <p className="text-sm text-slate-500">
          Thống kê số lượng phản hồi theo thời gian
        </p>
      </div>
      <div className="h-[300px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend
              verticalAlign="bottom"
              align="center"
              content={<ChartLegendContent />}
            />
            <Line
              type="monotone"
              dataKey="positive"
              stroke="var(--color-positive)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="neutral"
              stroke="var(--color-neutral)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="negative"
              stroke="var(--color-negative)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default SentimentTrendChart;
