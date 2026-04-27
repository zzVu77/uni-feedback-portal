"use client";

import React, { useState, useMemo } from "react";
import { mockFeedbackPosts } from "@/lib/mock-data";
import KPIOverview from "@/components/dashboard/KPIOverview";
import SentimentTrendChart from "@/components/dashboard/SentimentTrendChart";
import TopicDistributionChart from "@/components/dashboard/TopicDistributionChart";
import HotIssuesTable from "@/components/dashboard/HotIssuesTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SocialListeningPage = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>("Tất cả");

  // Get unique topics for the filter
  const topics = useMemo(() => {
    const uniqueTopics = Array.from(
      new Set(mockFeedbackPosts.map((p) => p.topic)),
    );
    return ["Tất cả", ...uniqueTopics];
  }, []);

  // Filter logic
  const filteredData = useMemo(() => {
    if (selectedTopic === "Tất cả") return mockFeedbackPosts;
    return mockFeedbackPosts.filter((post) => post.topic === selectedTopic);
  }, [selectedTopic]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header & Filters */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Phân tích bài đăng sinh viên trên mạng xã hội
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Theo dõi và phân tích các vấn đề của sinh viên thông qua các mạng
              xã hội để có những hành động kịp thời và hiệu quả
            </p>
          </div>

          <div className="w-full md:w-64">
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="rounded-lg border-slate-200 bg-white shadow-sm">
                <SelectValue placeholder="Lọc theo chủ đề" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 2: KPI Overview */}
        <KPIOverview data={filteredData} />

        {/* Row 3: Charts Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SentimentTrendChart data={filteredData} />
          </div>
          <div className="lg:col-span-1">
            <TopicDistributionChart data={filteredData} />
          </div>
        </div>

        {/* Row 4: Hot Issues Table */}
        <HotIssuesTable data={filteredData} />
      </div>
    </div>
  );
};

export default SocialListeningPage;
