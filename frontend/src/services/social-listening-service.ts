import axiosInstance from "@/config/axiosConfig";
import {
  SocialListeningFilter,
  SocialListeningResponse,
  KPIOverviewData,
  SentimentTrendItem,
  TopicDistributionItem,
  ClassificationSentimentData,
  PostCountByDateItem,
  FeedbackPost,
} from "@/types/social-listening";

const socialListeningBaseUrl = "/social-listening";

export const getTrendingIssues = async (
  filter: SocialListeningFilter,
): Promise<SocialListeningResponse> => {
  const response = await axiosInstance.get<SocialListeningResponse>(
    `${socialListeningBaseUrl}/trending-issues`,
    {
      params: filter,
    },
  );
  return response;
};

export const getKPIOverview = async (
  filter: SocialListeningFilter,
): Promise<KPIOverviewData> => {
  const response = await axiosInstance.get<KPIOverviewData>(
    `${socialListeningBaseUrl}/kpi-overview`,
    {
      params: filter,
    },
  );
  return response;
};

export const getSentimentTrend = async (
  filter: SocialListeningFilter,
): Promise<SentimentTrendItem[]> => {
  const response = await axiosInstance.get<SentimentTrendItem[]>(
    `${socialListeningBaseUrl}/sentiment-trend`,
    {
      params: filter,
    },
  );
  return response;
};

export const getTopicDistribution = async (
  filter: SocialListeningFilter,
): Promise<TopicDistributionItem[]> => {
  const response = await axiosInstance.get<TopicDistributionItem[]>(
    `${socialListeningBaseUrl}/topic-distribution`,
    {
      params: filter,
    },
  );
  return response;
};

export const getClassificationSentiment = async (
  filter: SocialListeningFilter,
): Promise<ClassificationSentimentData[]> => {
  const response = await axiosInstance.get<ClassificationSentimentData[]>(
    "/social-listening/classification-sentiment",
    {
      params: filter,
    },
  );
  return response;
};

export const getPostCountByDate = async (
  filter: SocialListeningFilter,
): Promise<PostCountByDateItem[]> => {
  const response = await axiosInstance.get<PostCountByDateItem[]>(
    "/social-listening/post-count-by-date",
    {
      params: filter,
    },
  );
  return response;
};

export const getPostsBySentiment = async (
  filter: SocialListeningFilter,
): Promise<FeedbackPost[]> => {
  const response = await axiosInstance.get<FeedbackPost[]>(
    "/social-listening/posts-by-sentiment",
    {
      params: filter,
    },
  );
  return response;
};

export const getTopicBySentiment = async (
  filter: SocialListeningFilter,
): Promise<TopicDistributionItem[]> => {
  const response = await axiosInstance.get<TopicDistributionItem[]>(
    `${socialListeningBaseUrl}/topic-by-sentiment`,
    {
      params: filter,
    },
  );
  return response;
};
