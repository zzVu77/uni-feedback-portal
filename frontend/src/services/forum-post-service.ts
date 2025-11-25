import axiosInstance from "@/config/axiosConfig";
import { ForumPostFilter, ForumPostListItem, PaginatedResponse } from "@/types";

export const forumPostBaseUrl = "/forum/posts";
export const getAllForumPosts = async (
  filter: ForumPostFilter,
): Promise<PaginatedResponse<ForumPostListItem>> => {
  const response = await axiosInstance.get<
    PaginatedResponse<ForumPostListItem>
  >(forumPostBaseUrl, {
    params: filter,
  });
  return response;
};
