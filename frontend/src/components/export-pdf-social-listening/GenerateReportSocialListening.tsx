import {
  KPIOverviewData,
  PostCountByDateItem,
  TopicDistributionItem,
  ClassificationSentimentData,
  FeedbackPost,
  SentimentTrendItem,
} from "@/types/social-listening";
import { drawChart } from "./draw-chart";
import { ReportDoc } from "./ReportDoc";
import { pdf } from "@react-pdf/renderer";

export async function GenerateReportSocialListening(
  kpiData: KPIOverviewData | undefined,
  fromDate: string,
  toDate: string,
  classificationData: ClassificationSentimentData[] | undefined,
  postCountData: PostCountByDateItem[] | undefined,
  postsBySentimentData: FeedbackPost[] | undefined,
  topicBySentimentData: TopicDistributionItem[] | undefined,
  trendData: SentimentTrendItem[] | undefined,
): Promise<Blob> {
  const { sentimentChartImage, postCountChartImage, trendChartImage } =
    drawChart({
      classificationData,
      postCountData,
      trendData,
    });
  return await pdf(
    <ReportDoc
      kpiData={kpiData}
      fromDate={fromDate}
      toDate={toDate}
      postsBySentimentData={postsBySentimentData}
      topicBySentimentData={topicBySentimentData}
      sentimentChartImage={sentimentChartImage}
      postCountChartImage={postCountChartImage}
      trendChartImage={trendChartImage}
    />,
  ).toBlob();
}
