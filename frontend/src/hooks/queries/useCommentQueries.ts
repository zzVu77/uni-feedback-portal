/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  deleteCommentById,
  getCommentsByPostID,
  postCommentByPostID,
} from "@/services/comment-service";
import { CommentPayload } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const COMMENT_QUERY_KEYS = "comments";

export const useGetCommentsByPostId = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [COMMENT_QUERY_KEYS, id],
    queryFn: () => getCommentsByPostID(id),
    retry: false,
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

// Renamed for clarity and properly returning the mutation object
export const useCreateComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CommentPayload) =>
      postCommentByPostID(postId, payload),
    onSuccess: () => {
      // Invalidate the query to refresh the comment list automatically
      queryClient.invalidateQueries({ queryKey: [COMMENT_QUERY_KEYS, postId] });
    },
    onError: () => {
      toast.error("Đã có lỗi xảy ra khi thêm bình luận.");
    },
    retry: false,
  });
};

export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCommentById(id),
    onSuccess: () => {
      toast.success("Xóa bình luận thành công!");
      queryClient.invalidateQueries({ queryKey: [COMMENT_QUERY_KEYS, postId] });
    },
    onError: () => {
      toast.error("Đã có lỗi xảy ra khi xóa bình luận.");
    },
    retry: false,
  });
};
