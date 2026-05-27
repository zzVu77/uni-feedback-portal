"use client";
import HotIssuesTable from "@/components/dashboard/social-listening/HotIssuesTable";
import KPIOverview from "@/components/dashboard/social-listening/KPIOverview";
import SentimentTrendChart from "@/components/dashboard/social-listening/SentimentTrendChart";
import { SocialListeningDatePicker } from "@/components/dashboard/social-listening/SocialListeningDatePicker";
import TopicDistributionChart from "@/components/dashboard/social-listening/TopicDistributionChart";
import { GenerateReportSocialListening } from "@/components/export-pdf-social-listening/GenerateReportSocialListening";
import { Button } from "@/components/ui/button";
import {
  useGetClassificationSentiment,
  useGetKPIOverview,
  useGetPostCountByDate,
  useGetPostsBySentiment,
  useGetSentimentTrend,
  useGetTopicBySentiment,
  useGetTopicDistribution,
  useGetTrendingIssues,
} from "@/hooks/queries/useSocialListeningQueries";
import {
  ClassificationSentimentData,
  FeedbackPost,
  KPIOverviewData,
  PostCountByDateItem,
  SentimentLabel,
  SocialListeningFilter,
  TopicDistributionItem,
} from "@/types/social-listening";
import { format, startOfMonth, toDate } from "date-fns";
import { Download } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

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
    const topicParam = searchParams.get("topic");

    const now = new Date();

    return {
      startDate: fromParam || format(startOfMonth(now), "yyyy-MM-dd"),
      endDate: toParam || format(toDate(now), "yyyy-MM-dd"),
      page: pageParam ? Number(pageParam) : 1,
      limit: limitParam ? Number(limitParam) : 10,
      sentimentLabel: sentimentLabelParam as SentimentLabel | undefined,
      topic: topicParam || undefined,
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
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-[1400px] space-y-6 lg:space-y-8">
        {/* Page Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between lg:items-center">
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Lắng nghe sinh viên
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Theo dõi và phân tích các vấn đề của sinh viên thông qua các bài
              đăng mạng xã hội để có những hành động kịp thời. Dữ liệu từ group
              "UTE - THẮC MẮC HỌC TẬP ®" và được làm mới mỗi ngày một lần.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <SocialListeningDatePicker
              onUpdate={handleDateUpdate}
              defaultStartDate={filter.startDate}
              defaultEndDate={filter.endDate}
              className="w-full sm:w-auto"
            />
            <Button
              variant="default"
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
              className="h-10 w-full bg-indigo-600 font-semibold text-white shadow-md transition-colors hover:bg-indigo-700 sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Content Area */}
        {isLoading && !trendingData ? (
          <div className="space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-2xl bg-slate-200/60"
                />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="h-[400px] animate-pulse rounded-2xl bg-slate-200/60 lg:col-span-2" />
              <div className="h-[400px] animate-pulse rounded-2xl bg-slate-200/60 lg:col-span-1" />
            </div>
            <div className="h-[600px] animate-pulse rounded-2xl bg-slate-200/60" />
          </div>
        ) : (
          <div className="animate-in fade-in space-y-6 duration-500 lg:space-y-8">
            {kpiData && <KPIOverview data={kpiData} />}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="min-h-[400px] lg:col-span-2">
                {trendData && <SentimentTrendChart data={trendData} />}
              </div>
              <div className="min-h-[400px] lg:col-span-1">
                {topicData && <TopicDistributionChart data={topicData} />}
              </div>
            </div>

            <div className="w-full overflow-hidden">
              <HotIssuesTable data={results} total={trendingData?.total || 0} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialListeningPage;
