/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getAllForumPosts,
  getForumPostById,
} from "@/services/forum-post-service";
import { ForumPostFilter, ForumPostListItem, PaginatedResponse } from "@/types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const FORUM_POST_QUERY_KEYS = "forum-posts";

export const useGetAllForumPost = (
  filters: ForumPostFilter,
  options?: UseQueryOptions<PaginatedResponse<ForumPostListItem>>,
) => {
  return useQuery({
    queryKey: [FORUM_POST_QUERY_KEYS, filters],
    queryFn: () => getAllForumPosts(filters),
    retry: false,
    placeholderData: (previousData) => previousData,
    ...options,
  });
};
export const useGetForumPostById = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [FORUM_POST_QUERY_KEYS, id],
    queryFn: () => getForumPostById(id),
    placeholderData: (previousData) => previousData,
    retry: false,
    ...options,
  });
};
