/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getAllForumPosts,
  getForumPostById,
} from "@/services/forum-post-service";
import { ForumPostFilter, ForumPostListItem, PaginatedResponse } from "@/types";
import {
  useInfiniteQuery, // Changed from useQuery
  useQuery,
} from "@tanstack/react-query";

export const FORUM_POST_QUERY_KEYS = "forum-posts";

// Refactored to Infinite Query
export const useGetInfiniteForumPosts = (filters: ForumPostFilter) => {
  return useInfiniteQuery<PaginatedResponse<ForumPostListItem>>({
    queryKey: [FORUM_POST_QUERY_KEYS, filters],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      // Merge pageParam with existing filters
      return await getAllForumPosts({
        ...filters,
        page: pageParam as number,
        pageSize: 10,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      // Calculate loaded items count
      const loadedItems = allPages.flatMap((page) => page.results).length;

      // Check if there are more items to load
      if (loadedItems < lastPage.total) {
        return allPages.length + 1;
      }
      return undefined;
    },
    retry: false,
    placeholderData: (previousData) => previousData,
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
