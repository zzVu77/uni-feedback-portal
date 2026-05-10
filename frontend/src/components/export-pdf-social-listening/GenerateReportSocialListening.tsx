import {
  KPIOverviewData,
  PostCountByDateItem,
  TopicDistributionItem,
  ClassificationSentimentData,
  FeedbackPost,
} from "@/types/social-listening";
import { drawChart } from "./draw-chart";
import { ReportDoc } from "./ReportDoc";
import { pdf } from "@react-pdf/renderer";

export async function GenerateReportSocialListening(
  topicData: TopicDistributionItem[] | undefined,
  kpiData: KPIOverviewData | undefined,
  fromDate: string,
  toDate: string,
  classificationData: ClassificationSentimentData[] | undefined,
  postCountData: PostCountByDateItem[] | undefined,
  postsBySentimentData: FeedbackPost[] | undefined,
): Promise<Blob> {
  const { sentimentChartImage, postCountChartImage } = drawChart({
    classificationData,
    postCountData,
  });
  return await pdf(
    <ReportDoc
      topicData={topicData}
      kpiData={kpiData}
      fromDate={fromDate}
      toDate={toDate}
      postsBySentimentData={postsBySentimentData}
      sentimentChartImage={sentimentChartImage}
      postCountChartImage={postCountChartImage}
    />,
  ).toBlob();
}
