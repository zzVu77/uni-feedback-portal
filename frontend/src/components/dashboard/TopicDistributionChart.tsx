import React, { useMemo } from "react";
import { FeedbackPost } from "@/types/social-listening";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TopicDistributionChartProps {
  data: FeedbackPost[];
}

const COLORS = ["#6366f1", "#3b82f6", "#10b981", "#64748b", "#f59e0b"];

const TopicDistributionChart: React.FC<TopicDistributionChartProps> = ({
  data,
}) => {
  const chartData = useMemo(() => {
    const counts = data.reduce((acc: Record<string, number>, curr) => {
      acc[curr.topic] = (acc[curr.topic] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900">
          Phân bổ chủ đề
        </h3>
        <p className="text-sm text-slate-500">
          Tỷ lệ các vấn đề sinh viên quan tâm
        </p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="transition-opacity outline-none hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "1px solid #f1f5f9",
                boxShadow:
                  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                padding: "8px 12px",
              }}
              itemStyle={{ fontSize: "12px", color: "#475569" }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "12px",
                color: "#64748b",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopicDistributionChart;
