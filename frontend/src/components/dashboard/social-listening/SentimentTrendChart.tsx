import React from "react";
import { SentimentTrendItem } from "@/types/social-listening";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
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
    color: "#10b981", // emerald-500
  },
  neutral: {
    label: "Trung lập",
    color: "#3b82f6", // blue-500
  },
  negative: {
    label: "Tiêu cực",
    color: "#f43f5e", // rose-500
  },
  stressAnxiety: {
    label: "Stress lo âu",
    color: "#eab308", // yellow-500
  },
} satisfies ChartConfig;

const SentimentTrendChart: React.FC<SentimentTrendChartProps> = ({ data }) => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-black/5">
      <div className="border-b border-slate-100 bg-slate-50/50 p-6">
        <h3 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          <TrendingUp className="h-5 w-5 text-indigo-500" />
          Xu hướng cảm xúc
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Theo dõi sự biến động của các luồng ý kiến theo thời gian
        </p>
      </div>

      <div className="flex-1 p-6 pb-2">
        <div className="h-[300px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="displayDate"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={12}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                  tickMargin={12}
                />
                <ChartTooltip
                  cursor={{
                    stroke: "#cbd5e1",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                  content={
                    <ChartTooltipContent className="border-slate-100 bg-white/95 shadow-xl backdrop-blur-sm" />
                  }
                />
                <ChartLegend
                  verticalAlign="bottom"
                  align="center"
                  content={<ChartLegendContent className="mt-4 font-medium" />}
                />
                <Line
                  type="monotone"
                  dataKey="positive"
                  stroke="var(--color-positive)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 6,
                    strokeWidth: 0,
                    fill: "var(--color-positive)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="neutral"
                  stroke="var(--color-neutral)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 6,
                    strokeWidth: 0,
                    fill: "var(--color-neutral)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="negative"
                  stroke="var(--color-negative)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 6,
                    strokeWidth: 0,
                    fill: "var(--color-negative)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="stressAnxiety"
                  stroke="var(--color-stressAnxiety)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 6,
                    strokeWidth: 0,
                    fill: "var(--color-stressAnxiety)",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default SentimentTrendChart;
