"use client";
import { AddDataSourceDialog } from "@/components/dashboard/social-listening/add-data-source-dialog";
import { DataSourceCardGrid } from "@/components/dashboard/social-listening/data-source-card-grid";
import HotIssuesTable from "@/components/dashboard/social-listening/HotIssuesTable";
import KPIOverview from "@/components/dashboard/social-listening/KPIOverview";
import SentimentTrendChart from "@/components/dashboard/social-listening/SentimentTrendChart";
import { SocialListeningDatePicker } from "@/components/dashboard/social-listening/SocialListeningDatePicker";
import TopicDistributionChart from "@/components/dashboard/social-listening/TopicDistributionChart";
import UrgentIssuesAlert from "@/components/dashboard/social-listening/UrgentIssuesAlert";
import { GenerateReportSocialListening } from "@/components/export-pdf-social-listening/GenerateReportSocialListening";
import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { useGetSocialDataSources } from "@/hooks/queries/useSocialDataSourceQueries";
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
} from "@/types/social-listening";
import { format, startOfMonth, toDate } from "date-fns";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

const AdminSocialListeningPage = () => {
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
    const groupUrlParam = searchParams.get("groupUrl");

    const now = new Date();

    return {
      startDate: fromParam || format(startOfMonth(now), "yyyy-MM-dd"),
      endDate: toParam || format(toDate(now), "yyyy-MM-dd"),
      page: pageParam ? Number(pageParam) : 1,
      limit: limitParam ? Number(limitParam) : 10,
      sentimentLabel: sentimentLabelParam as SentimentLabel | undefined,
      topic: topicParam || undefined,
      groupUrl: groupUrlParam || undefined,
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
  const { data: urgentIssuesData, isLoading: isLoadingUrgent } =
    useGetUrgentIssues(filter);

  const { data: dataSourcesData, isLoading: isLoadingDataSources } =
    useGetSocialDataSources({ limit: 100 });

  const results = trendingData?.results || [];

  const isLoading =
    isLoadingTrending ||
    isLoadingKPI ||
    isLoadingTrend ||
    isLoadingTopic ||
    isLoadingClassification ||
    isLoadingPostCount ||
    isLoadingPostsBySentiment ||
    isLoadingTopicBySentiment ||
    isLoadingUrgent ||
    isLoadingDataSources;

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
    <Wrapper>
      {!filter.groupUrl ? (
        <div className="animate-in fade-in flex w-full flex-col items-center">
          {/* Hero Section */}
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <h1 className="bg-gradient-to-r from-indigo-600 to-blue-400 bg-clip-text pb-2 text-4xl font-extrabold tracking-tight text-slate-900 text-transparent sm:text-5xl lg:text-6xl">
              Lắng nghe sinh viên
            </h1>
            <p className="text-lg leading-relaxed text-slate-500">
              Chọn một nguồn dữ liệu để bắt đầu theo dõi và phân tích các vấn đề
              của sinh viên. Hệ thống tự động thu thập và đánh giá cảm xúc mỗi
              ngày.
            </p>
            <div className="mt-6 flex justify-center">
              <AddDataSourceDialog />
            </div>
          </div>

          {/* Cards Grid */}
          <DataSourceCardGrid
            dataSources={dataSourcesData?.results || []}
            isAdmin={true}
          />
        </div>
      ) : (
        <div className="animate-in fade-in flex h-full w-full flex-col gap-6 duration-500 md:gap-8">
          {/* Page Header */}
          <div className="flex flex-col gap-4">
            <Button
              variant="ghost"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("groupUrl");
                router.push(`${pathname}?${params.toString()}`);
              }}
              className="-ml-4 w-fit text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách
            </Button>

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between lg:items-center">
              <div className="flex-1 space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                  {dataSourcesData?.results?.find(
                    (g) => g.url === filter.groupUrl,
                  )?.groupName || "Chi tiết Group"}
                </h1>
                <p className="flex max-w-3xl flex-wrap items-center gap-2 text-sm leading-relaxed text-slate-500 sm:text-base">
                  <span>Dữ liệu được làm mới mỗi ngày một lần từ nguồn</span>
                  <a
                    href={filter.groupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:underline"
                  >
                    Facebook Group <ExternalLink className="h-3 w-3" />
                  </a>
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

              <div className="w-full overflow-hidden">
                <HotIssuesTable
                  data={results}
                  total={trendingData?.total || 0}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </Wrapper>
  );
};

export default AdminSocialListeningPage;
