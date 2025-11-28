/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getAllForumPosts,
  getForumPostById,
  unvoteForumPost,
  voteForumPost,
} from "@/services/forum-post-service";
import { ForumPostFilter, ForumPostListItem, PaginatedResponse } from "@/types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

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

export const useVoteForumPost = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => voteForumPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [FORUM_POST_QUERY_KEYS, id],
      });
      toast.success("Đã thích bài viết!");
    },
    onError: () => {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
    },
    retry: false,
  });
};

export const useUnvoteForumPost = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => unvoteForumPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [FORUM_POST_QUERY_KEYS, id],
      });
      toast.success("Đã bỏ thích bài viết!");
    },
    onError: () => {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
    },
    retry: false,
  });
};
