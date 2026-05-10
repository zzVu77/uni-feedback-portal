import { useQuery } from "@tanstack/react-query";
import {
  getClassificationSentiment,
  getKPIOverview,
  getPostCountByDate,
  getSentimentTrend,
  getTopicDistribution,
  getTrendingIssues,
  getPostsBySentiment,
} from "@/services/social-listening-service";
import { SocialListeningFilter } from "@/types/social-listening";

export const SOCIAL_LISTENING_QUERY_KEYS = {
  trendingIssues: "social-listening-trending-issues",
  kpiOverview: "social-listening-kpi-overview",
  sentimentTrend: "social-listening-sentiment-trend",
  topicDistribution: "social-listening-topic-distribution",
  classificationSentiment: "social-listening-classification-sentiment",
  postCountByDate: "social-listening-post-count-by-date",
  postsBySentiment: "social-listening-posts-by-sentiment",
};

export const useGetTrendingIssues = (filter: SocialListeningFilter) => {
  return useQuery({
    queryKey: [SOCIAL_LISTENING_QUERY_KEYS.trendingIssues, filter],
    queryFn: () => getTrendingIssues(filter),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetKPIOverview = (filter: SocialListeningFilter) => {
  return useQuery({
    queryKey: [SOCIAL_LISTENING_QUERY_KEYS.kpiOverview, filter],
    queryFn: () => getKPIOverview(filter),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetSentimentTrend = (filter: SocialListeningFilter) => {
  return useQuery({
    queryKey: [SOCIAL_LISTENING_QUERY_KEYS.sentimentTrend, filter],
    queryFn: () => getSentimentTrend(filter),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetTopicDistribution = (filter: SocialListeningFilter) => {
  return useQuery({
    queryKey: [SOCIAL_LISTENING_QUERY_KEYS.topicDistribution, filter],
    queryFn: () => getTopicDistribution(filter),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetClassificationSentiment = (
  filter: SocialListeningFilter,
) => {
  return useQuery({
    queryKey: [SOCIAL_LISTENING_QUERY_KEYS.classificationSentiment, filter],
    queryFn: () => getClassificationSentiment(filter),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetPostCountByDate = (filter: SocialListeningFilter) => {
  return useQuery({
    queryKey: [SOCIAL_LISTENING_QUERY_KEYS.postCountByDate, filter],
    queryFn: () => getPostCountByDate(filter),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetPostsBySentiment = (filter: SocialListeningFilter) => {
  return useQuery({
    queryKey: [SOCIAL_LISTENING_QUERY_KEYS.postsBySentiment, filter],
    queryFn: () => getPostsBySentiment(filter),
    placeholderData: (previousData) => previousData,
  });
};
