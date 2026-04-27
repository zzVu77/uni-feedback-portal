import React, { useMemo } from "react";
import { FeedbackPost } from "@/types/dashboard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";

interface SentimentTrendChartProps {
  data: FeedbackPost[];
}

const SentimentTrendChart: React.FC<SentimentTrendChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    // Group by full date string (YYYY-MM-DD) for reliable sorting
    const grouped = data.reduce(
      (
        acc: Record<
          string,
          {
            dateStr: string;
            displayDate: string;
            positive: number;
            negative: number;
          }
        >,
        curr,
      ) => {
        const dateKey = format(curr.posted_at, "yyyy-MM-dd");
        if (!acc[dateKey]) {
          acc[dateKey] = {
            dateStr: dateKey,
            displayDate: format(curr.posted_at, "dd/MM"),
            positive: 0,
            negative: 0,
          };
        }
        if (curr.sentiment_label === "Tích cực") {
          acc[dateKey].positive += 1;
        } else if (curr.sentiment_label === "Tiêu cực") {
          acc[dateKey].negative += 1;
        }
        return acc;
      },
      {},
    );

    return Object.values(grouped).sort((a, b) =>
      a.dateStr.localeCompare(b.dateStr),
    );
  }, [data]);

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900">
          Xu hướng cảm xúc
        </h3>
        <p className="text-sm text-slate-500">
          Thống kê số lượng phản hồi theo thời gian
        </p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
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
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "1px solid #f1f5f9",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              }}
            />
            <Legend verticalAlign="top" align="right" iconType="circle" />
            <Line
              type="monotone"
              dataKey="positive"
              name="Tích cực"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="negative"
              name="Tiêu cực"
              stroke="#f43f5e"
              strokeWidth={2}
              dot={{ r: 4, fill: "#f43f5e", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentTrendChart;
