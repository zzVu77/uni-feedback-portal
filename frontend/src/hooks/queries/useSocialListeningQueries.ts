import { useQuery } from "@tanstack/react-query";
import { getTrendingIssues } from "@/services/social-listening-service";
import { SocialListeningFilter } from "@/types/social-listening";

export const SOCIAL_LISTENING_QUERY_KEYS = {
  trendingIssues: "social-listening-trending-issues",
};

export const useGetTrendingIssues = (filter: SocialListeningFilter) => {
  return useQuery({
    queryKey: [SOCIAL_LISTENING_QUERY_KEYS.trendingIssues, filter],
    queryFn: () => getTrendingIssues(filter),
    placeholderData: (previousData) => previousData,
  });
};
