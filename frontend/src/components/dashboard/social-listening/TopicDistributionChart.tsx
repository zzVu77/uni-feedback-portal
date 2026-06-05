import React from "react";
import { TopicDistributionItem } from "@/types/social-listening";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

interface TopicDistributionChartProps {
  data: TopicDistributionItem[];
}

// Deep, vibrant colors matching the premium style
const COLORS = [
  "#6366f1", // indigo-500
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#f43f5e", // rose-500
  "#8b5cf6", // violet-500
  "#0ea5e9", // sky-500
];

const TopicDistributionChart: React.FC<TopicDistributionChartProps> = ({
  data,
}) => {
  const chartData = data.map((item) => ({
    name: item.topic,
    value: item.count,
  }));

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-black/5">
      <div className="border-b border-slate-100 bg-slate-50/50 p-6">
        <h3 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          <PieChartIcon className="h-5 w-5 text-fuchsia-500" />
          Phân bổ chủ đề
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Tỷ lệ các vấn đề sinh viên quan tâm
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-center p-6 pb-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                cornerRadius={4}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="transition-all duration-300 outline-none hover:scale-[1.02] hover:opacity-80"
                    style={{
                      filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.05))",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "12px",
                  border: "1px solid #f1f5f9",
                  boxShadow:
                    "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                  padding: "10px 16px",
                  backdropFilter: "blur(4px)",
                }}
                itemStyle={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#334155",
                }}
                formatter={(value: number) => [`${value} phản hồi`, "Số lượng"]}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  paddingTop: "16px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#475569",
                  lineHeight: "24px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TopicDistributionChart;
