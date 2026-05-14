"use client";
import HotIssuesTable from "@/components/dashboard/social-listening/HotIssuesTable";
import KPIOverview from "@/components/dashboard/social-listening/KPIOverview";
import SentimentTrendChart from "@/components/dashboard/social-listening/SentimentTrendChart";
import { SocialListeningDatePicker } from "@/components/dashboard/social-listening/SocialListeningDatePicker";
import TopicDistributionChart from "@/components/dashboard/social-listening/TopicDistributionChart";
import { Button } from "@/components/ui/button";
import {
  useGetKPIOverview,
  useGetSentimentTrend,
  useGetTopicDistribution,
  useGetTrendingIssues,
  useGetClassificationSentiment,
  useGetPostCountByDate,
  useGetPostsBySentiment,
  useGetTopicBySentiment,
} from "@/hooks/queries/useSocialListeningQueries";
import {
  SocialListeningFilter,
  SentimentLabel,
  TopicDistributionItem,
  KPIOverviewData,
  ClassificationSentimentData,
  PostCountByDateItem,
  FeedbackPost,
} from "@/types/social-listening";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { GenerateReportSocialListening } from "@/components/export-pdf-social-listening/GenerateReportSocialListening";

const SocialListeningPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filter = useMemo((): SocialListeningFilter => {
    const fromParam = searchParams.get("startDate");
    const toParam = searchParams.get("endDate");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const sentimentLabelParam = searchParams.get("sentimentLabel");

    const now = new Date();

    return {
      startDate: fromParam || format(startOfMonth(now), "yyyy-MM-dd"),
      endDate: toParam || format(endOfMonth(now), "yyyy-MM-dd"),
      page: pageParam ? Number(pageParam) : 1,
      limit: limitParam ? Number(limitParam) : 10,
      sentimentLabel: sentimentLabelParam as SentimentLabel | undefined,
    };
  }, [searchParams]);

  const { data: trendingData, isLoading: isLoadingTrending } =
    useGetTrendingIssues(filter);

  const { data: kpiData, isLoading: isLoadingKPI } = useGetKPIOverview(filter);

  const { data: trendData, isLoading: isLoadingTrend } =
    useGetSentimentTrend(filter);

  const { data: topicData, isLoading: isLoadingTopic } =
    useGetTopicDistribution(filter);

  const { data: classificationData, isLoading: isLoadingClassification } =
    useGetClassificationSentiment(filter);

  const { data: postCountData, isLoading: isLoadingPostCount } =
    useGetPostCountByDate(filter);
  const { data: postsBySentimentData, isLoading: isLoadingPostsBySentiment } =
    useGetPostsBySentiment(filter);
  const { data: topicBySentimentData, isLoading: isLoadingTopicBySentiment } =
    useGetTopicBySentiment(filter);

  const results = trendingData?.results || [];

  const isLoading =
    isLoadingTrending ||
    isLoadingKPI ||
    isLoadingTrend ||
    isLoadingTopic ||
    isLoadingClassification ||
    isLoadingPostCount ||
    isLoadingPostsBySentiment ||
    isLoadingTopicBySentiment;

  const handleDateUpdate = useCallback(
    (newRange: Partial<SocialListeningFilter>) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newRange.startDate) {
        params.set("startDate", newRange.startDate);
      } else {
        params.delete("startDate");
      }

      if (newRange.endDate) {
        params.set("endDate", newRange.endDate);
      } else {
        params.delete("endDate");
      }

      params.set("page", "1");

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );
  const exportPdf = async (
    kpiData: KPIOverviewData | undefined,
    fromDate: string,
    toDate: string,
    classificationData: ClassificationSentimentData[] | undefined,
    postCountData: PostCountByDateItem[] | undefined,
    postsBySentimentData: FeedbackPost[] | undefined,
    topicBySentimentData: TopicDistributionItem[] | undefined,
  ) => {
    const blob = await GenerateReportSocialListening(
      kpiData,
      fromDate,
      toDate,
      classificationData,
      postCountData,
      postsBySentimentData,
      topicBySentimentData,
    );
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Phân tích bài đăng sinh viên trên mạng xã hội
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Theo dõi và phân tích các vấn đề của sinh viên thông qua các bài
              đăng mạng xã hội để có những hành động kịp thời và hiệu quả. Dữ
              liệu được thu thập từ group Facebook "UTE - THẮC MẮC HỌC TẬP ®
              (Trường Đại học Công nghệ Kỹ thuật TP.HCM - HCMUTE)". Dữ liệu được
              làm mới 3 ngày một lần để đảm bảo tính cập nhật và chính xác.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-col md:items-center">
            <SocialListeningDatePicker
              onUpdate={handleDateUpdate}
              defaultStartDate={filter.startDate}
              defaultEndDate={filter.endDate}
            />
            <Button
              variant="primary"
              onClick={() =>
                exportPdf(
                  kpiData,
                  filter.startDate || "",
                  filter.endDate || "",
                  classificationData,
                  postCountData,
                  postsBySentimentData,
                  topicBySentimentData,
                )
              }
              size="sm"
            >
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {isLoading && !trendingData ? (
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
            {kpiData && <KPIOverview data={kpiData} />}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="h-full lg:col-span-2">
                {trendData && <SentimentTrendChart data={trendData} />}
              </div>
              <div className="lg:col-span-1">
                {topicData && <TopicDistributionChart data={topicData} />}
              </div>
            </div>

            <HotIssuesTable data={results} total={trendingData?.total || 0} />
          </>
        )}
      </div>
    </div>
  );
};

export default SocialListeningPage;
