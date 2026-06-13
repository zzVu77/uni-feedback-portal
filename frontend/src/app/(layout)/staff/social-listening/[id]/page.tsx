"use client";
import HotIssuesTable from "@/components/dashboard/social-listening/HotIssuesTable";
import KPIOverview from "@/components/dashboard/social-listening/KPIOverview";
import SentimentTrendChart from "@/components/dashboard/social-listening/SentimentTrendChart";
import { SocialListeningDatePicker } from "@/components/dashboard/social-listening/SocialListeningDatePicker";
import TopicDistributionChart from "@/components/dashboard/social-listening/TopicDistributionChart";
import UrgentIssuesAlert from "@/components/dashboard/social-listening/UrgentIssuesAlert";
import { GenerateReportSocialListening } from "@/components/export-pdf-social-listening/GenerateReportSocialListening";
import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { useGetSocialDataSourceById } from "@/hooks/queries/useSocialDataSourceQueries";
import {
  useGetClassificationSentiment,
  useGetKPIOverview,
  useGetPostCountByDate,
  useGetPostsBySentiment,
  useGetSentimentTrend,
  useGetTopicBySentiment,
  useGetTopicDistribution,
  useGetTrendingIssues,
  useGetUrgentIssues,
} from "@/hooks/queries/useSocialListeningQueries";
import {
  ClassificationSentimentData,
  FeedbackPost,
  KPIOverviewData,
  PostCountByDateItem,
  SentimentLabel,
  SocialListeningFilter,
  TopicDistributionItem,
  SentimentTrendItem,
} from "@/types/social-listening";
import { format, startOfMonth, toDate } from "date-fns";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

const SocialListeningDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;

  const { data: dataSource, isLoading: isLoadingDataSource } =
    useGetSocialDataSourceById(id);

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
      groupUrl: dataSource?.url,
    };
  }, [searchParams, dataSource?.url]);

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
  const { data: urgentIssuesData, isLoading: isLoadingUrgent } =
    useGetUrgentIssues(filter);

  const results = trendingData?.results || [];

  const isLoading =
    isLoadingDataSource ||
    isLoadingTrending ||
    isLoadingKPI ||
    isLoadingTrend ||
    isLoadingTopic ||
    isLoadingClassification ||
    isLoadingPostCount ||
    isLoadingPostsBySentiment ||
    isLoadingTopicBySentiment ||
    isLoadingUrgent;

  const handleDateUpdate = useCallback(
    (newRange: Partial<SocialListeningFilter>) => {
      const urlParams = new URLSearchParams(searchParams.toString());

      if (newRange.startDate) {
        urlParams.set("startDate", newRange.startDate);
      } else {
        urlParams.delete("startDate");
      }

      if (newRange.endDate) {
        urlParams.set("endDate", newRange.endDate);
      } else {
        urlParams.delete("endDate");
      }

      urlParams.set("page", "1");

      router.push(`/staff/social-listening/${id}?${urlParams.toString()}`, {
        scroll: false,
      });
    },
    [router, searchParams, id],
  );

  const exportPdf = async (
    kpiData: KPIOverviewData | undefined,
    fromDate: string,
    toDate: string,
    classificationData: ClassificationSentimentData[] | undefined,
    postCountData: PostCountByDateItem[] | undefined,
    postsBySentimentData: FeedbackPost[] | undefined,
    topicBySentimentData: TopicDistributionItem[] | undefined,
    trendData: SentimentTrendItem[] | undefined,
  ) => {
    const blob = await GenerateReportSocialListening(
      kpiData,
      fromDate,
      toDate,
      classificationData,
      postCountData,
      postsBySentimentData,
      topicBySentimentData,
      trendData,
    );
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  if (isLoadingDataSource && !dataSource) {
    return (
      <Wrapper>
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="animate-in fade-in flex h-full w-full flex-col gap-6 duration-500 md:gap-8">
        {/* Page Header */}
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            onClick={() => {
              router.push("/staff/social-listening");
            }}
            className="-ml-4 w-fit text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between lg:items-center">
            <div className="flex-1 space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                {dataSource?.groupName || "Chi tiết Group"}
              </h1>
              <p className="flex max-w-3xl flex-wrap items-center gap-2 text-sm leading-relaxed text-slate-500 sm:text-base">
                <span>Dữ liệu được làm mới mỗi ngày một lần từ nguồn</span>
                {dataSource?.url && (
                  <a
                    href={dataSource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:underline"
                  >
                    Facebook Group <ExternalLink className="h-3 w-3" />
                  </a>
                )}
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
                    trendData,
                  )
                }
                className="h-10 w-full rounded-full bg-indigo-600 px-6 font-semibold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg sm:w-auto"
              >
                <Download className="mr-2 h-4 w-4" />
                Xuất báo cáo
              </Button>
            </div>
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

            {urgentIssuesData && urgentIssuesData.length > 0 && (
              <UrgentIssuesAlert issues={urgentIssuesData} />
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="min-h-[400px] lg:col-span-2">
                {trendData && <SentimentTrendChart data={trendData} />}
              </div>
              <div className="min-h-[400px] lg:col-span-1">
                {topicData && <TopicDistributionChart data={topicData} />}
              </div>
            </div>

            <div className="min-h-[500px]">
              <HotIssuesTable data={results} total={trendingData?.total || 0} />
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default SocialListeningDetailPage;
