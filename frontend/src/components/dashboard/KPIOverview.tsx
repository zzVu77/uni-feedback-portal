import React from "react";
import { FeedbackPost } from "@/types/dashboard";
import { MessageSquare, Activity, AlertTriangle } from "lucide-react";

interface KPIOverviewProps {
  data: FeedbackPost[];
}

const KPIOverview: React.FC<KPIOverviewProps> = ({ data }) => {
  // Logic remains unchanged as per mandates
  const totalFeedbacks = data.length;

  const avgSentiment =
    data.length > 0
      ? (data.reduce((acc, curr) => acc + curr.sentiment_score, 0) /
          data.length) *
        10
      : 0;

  const urgentIssues = data.filter(
    (post) => post.sentiment_label === "Tiêu cực" && post.engagement_score > 50,
  ).length;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Total Feedbacks Card */}
      <div className="flex items-start justify-between rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <div>
          <p className="mb-1 text-sm font-medium">Tổng số bài đăng</p>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
            {totalFeedbacks.toLocaleString()}
          </h3>
        </div>
        <div className="rounded-lg bg-blue-50 p-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
        </div>
      </div>

      {/* Average Sentiment Card */}
      <div className="flex items-start justify-between rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <div>
          <p className="mb-1 text-sm font-medium">Điểm cảm xúc trung bình</p>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
            {avgSentiment.toFixed(1)}/10
          </h3>
        </div>
        <div className="rounded-lg bg-emerald-50 p-2">
          <Activity className="h-5 w-5 text-emerald-600" />
        </div>
      </div>

      {/* Urgent Issues Card */}
      <div className="flex items-start justify-between rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <div>
          <p className="mb-1 text-sm font-medium">Bài đăng tiêu cực</p>
          <h3 className="text-2xl font-semibold tracking-tight text-rose-600">
            {urgentIssues}
          </h3>
        </div>
        <div className="rounded-lg bg-rose-50 p-2">
          <AlertTriangle className="h-5 w-5 text-rose-600" />
        </div>
      </div>
    </div>
  );
};

export default KPIOverview;
