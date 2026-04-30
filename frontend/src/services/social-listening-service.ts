import axiosInstance from "@/config/axiosConfig";
import {
  SocialListeningFilter,
  SocialListeningResponse,
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
