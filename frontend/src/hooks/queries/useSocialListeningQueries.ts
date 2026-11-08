import {
  getClassificationSentiment,
  getKPIOverview,
  getPostById,
  getPostComments,
  getPostCountByDate,
  getPostsBySentiment,
  getSentimentTrend,
  getTopicBySentiment,
  getTopicDistribution,
  getTrendingIssues,
  getUrgentIssues,
  triggerCrawlPostComments,
} from "@/services/social-listening-service";
import {
  GetPostCommentsParams,
  SocialListeningFilter,
} from "@/types/social-listening";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const SOCIAL_LISTENING_QUERY_KEYS = {
  trendingIssues: "social-listening-trending-issues",
  postDetail: "social-listening-post-detail",
  kpiOverview: "social-listening-kpi-overview",
  sentimentTrend: "social-listening-sentiment-trend",
  topicDistribution: "social-listening-topic-distribution",
  classificationSentiment: "social-listening-classification-sentiment",
  postCountByDate: "social-listening-post-count-by-date",
  postsBySentiment: "social-listening-posts-by-sentiment",
  topicBySentiment: "social-listening-topic-by-sentiment",
  urgentIssues: "social-listening-urgent-issues",
  postComments: "social-listening-post-comments",
};

export const useGetTrendingIssues = (filter: SocialListeningFilter) => {
  return useQuery({
    queryKey: [SOCIAL_LISTENING_QUERY_KEYS.trendingIssues, filter],
    queryFn: () => getTrendingIssues(filter),
    placeholderData: keepPreviousData,
  });
};

export const useGetKPIOverview = (filter: SocialListeningFilter) => {
  return useQuery({
    queryKey: [SOCIAL_LISTENING_QUERY_KEYS.kpiOverview, filter],
    queryFn: () => getKPIOverview(filter),
    placeholderData: keepPreviousData,
  });
};

export const useGetSentimentTrend = (filter: SocialListeningFilter) => {
  return useQuery({
    queryKey: [SOCIAL_LISTENING_QUERY_KEYS.sentimentTrend, filter],
    queryFn: () => getSentimentTrend(filter),
    placeholderData: keepPreviousData,
  });
};

export const useGetTopicDistribution = (filter: SocialListeningFilter) => {
  return useQuery({
    queryKey: [SOCIAL_LISTENING_QUERY_KEYS.topicDistribution, filter],
    queryFn: () => getTopicDistribution(filter),
    placeholderData: keepPreviousData,
  });
};

export const useGetClassificationSentiment = (
  filter: SocialListeningFilter,
) => {
  return useQuery({
    queryKey: [SOCIAL_LISTENING_QUERY_KEYS.classificationSentiment, filter],
    queryFn: () => getClassificationSentiment(filter),
    placeholderData: keepPreviousData,
  });
};

export const useGetPostCountByDate = (filter: SocialListeningFilter) => {
  return useQuery({
    queryKey: [SOCIAL_LISTENING_QUERY_KEYS.postCountByDate, filter],
    queryFn: () => getPostCountByDate(filter),
    placeholderData: keepPreviousData,
  });
};

export const useGetPostsBySentiment = (filter: SocialListeningFilter) => {
  return useQuery({
    queryKey: [SOCIAL_LISTENING_QUERY_KEYS.postsBySentiment, filter],
    queryFn: () => getPostsBySentiment(filter),
    placeholderData: keepPreviousData,
  });
};
export const useGetTopicBySentiment = (filter: SocialListeningFilter) => {
  return useQuery({
    queryKey: [SOCIAL_LISTENING_QUERY_KEYS.topicBySentiment, filter],
    queryFn: () => getTopicBySentiment(filter),
    placeholderData: keepPreviousData,
  });
};

export const useGetUrgentIssues = (filter: SocialListeningFilter) => {
  return useQuery({
    queryKey: [SOCIAL_LISTENING_QUERY_KEYS.urgentIssues, filter],
    queryFn: () => getUrgentIssues(filter),
    placeholderData: keepPreviousData,
  });
};

export const useGetPostById = (postId: string | null | undefined) => {
  return useQuery({
    queryKey: [SOCIAL_LISTENING_QUERY_KEYS.postDetail, postId],
    queryFn: () => getPostById(postId!),
    enabled: Boolean(postId),
  });
};

export const useGetPostComments = (
  postId: string | null | undefined,
  params?: GetPostCommentsParams,
) => {
  return useQuery({
    queryKey: [SOCIAL_LISTENING_QUERY_KEYS.postComments, postId, params],
    queryFn: () => getPostComments(postId!, params),
    enabled: Boolean(postId),
    placeholderData: keepPreviousData,
  });
};

export const useTriggerCrawlComments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => triggerCrawlPostComments(postId),
    onSuccess: (_data, postId) => {
      void queryClient.invalidateQueries({
        queryKey: [SOCIAL_LISTENING_QUERY_KEYS.postComments, postId],
      });
      void queryClient.invalidateQueries({
        queryKey: [SOCIAL_LISTENING_QUERY_KEYS.trendingIssues],
      });
      void queryClient.invalidateQueries({
        queryKey: [SOCIAL_LISTENING_QUERY_KEYS.urgentIssues],
      });
    },
  });
};
