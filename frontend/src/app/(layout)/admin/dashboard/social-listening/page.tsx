"use client";

import React, { useState, useMemo } from "react";
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
import { useGetTrendingIssues } from "@/hooks/queries/useSocialListeningQueries";
import { SocialListeningFilter } from "@/types/social-listening";
import { MonthRangePicker } from "@/components/dashboard/admin/MonthRangePicker";
import { ReportFilter } from "@/types/report";
import { startOfMonth, endOfMonth, format } from "date-fns";

const SocialListeningPage = () => {
  const [filter, setFilter] = useState<SocialListeningFilter>({
    page: 1,
    limit: 100, // Fetch more for charts to show a better overview
    topic: undefined,
    startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    endDate: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });

  const { data, isLoading } = useGetTrendingIssues(filter);

  const results = data?.results || [];

  // Get unique topics for the filter from current results
  const topics = useMemo(() => {
    const uniqueTopics = Array.from(new Set(results.map((p) => p.topic)));
    return ["Tất cả", ...uniqueTopics];
  }, [results]);

  const handleTopicChange = (value: string) => {
    setFilter((prev) => ({
      ...prev,
      topic: value === "Tất cả" ? undefined : value,
    }));
  };

  const handleDateUpdate = (range: ReportFilter) => {
    setFilter((prev) => ({
      ...prev,
      startDate: range.from,
      endDate: range.to,
    }));
  };

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
              Theo dõi và phân tích các vấn đề của sinh viên thông qua các bài
              đăng mạng xã hội để có những hành động kịp thời và hiệu quả
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row md:items-center">
            <MonthRangePicker
              onUpdate={handleDateUpdate}
              defaultFrom={filter.startDate}
              defaultTo={filter.endDate}
            />
            <div className="w-full md:w-48">
              <Select
                value={filter.topic || "Tất cả"}
                onValueChange={handleTopicChange}
              >
                <SelectTrigger className="rounded-lg border-slate-200 bg-white shadow-sm">
                  <SelectValue placeholder="Chủ đề" />
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
        </div>

        {isLoading && !data ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-xl bg-gray-200"
                />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="h-80 animate-pulse rounded-xl bg-gray-200 lg:col-span-2" />
              <div className="h-80 animate-pulse rounded-xl bg-gray-200 lg:col-span-1" />
            </div>
            <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
          </div>
        ) : (
          <>
            {/* Row 2: KPI Overview */}
            <KPIOverview data={results} />

            {/* Row 3: Charts Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <SentimentTrendChart data={results} />
              </div>
              <div className="lg:col-span-1">
                <TopicDistributionChart data={results} />
              </div>
            </div>

            {/* Row 4: Hot Issues Table */}
            <HotIssuesTable data={results} />
          </>
        )}
      </div>
    </div>
  );
};

export default SocialListeningPage;
