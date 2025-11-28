/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  deleteCommentById,
  getCommentsByAnnouncementID,
  getCommentsByPostID,
  postCommentByAnnouncementID,
  postCommentByPostID,
  reportCommentById,
} from "@/services/comment-service";
import { CommentPayload } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const COMMENT_QUERY_KEYS = {
  COMMENTS_BY_POST_ID: "comments_by_post_id",
  COMMENTS_BY_ANNOUNCEMENT_ID: "comments_by_announcement_id",
};

// --- FEEDBACK POST HOOKS ---

export const useGetCommentsByPostId = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [COMMENT_QUERY_KEYS.COMMENTS_BY_POST_ID, id],
    queryFn: () => getCommentsByPostID(id),
    retry: false,
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

export const useCreateCommentByPostId = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CommentPayload) =>
      postCommentByPostID(postId, payload),
    onSuccess: () => {
      // Invalidate feedback comments
      queryClient.invalidateQueries({
        queryKey: [COMMENT_QUERY_KEYS.COMMENTS_BY_POST_ID, postId],
      });
    },
    onError: () => {
      toast.error("Đã có lỗi xảy ra khi thêm bình luận.");
    },
    retry: false,
  });
};

// --- ANNOUNCEMENT HOOKS ---

export const useGetCommentsByAnnouncementId = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [COMMENT_QUERY_KEYS.COMMENTS_BY_ANNOUNCEMENT_ID, id],
    queryFn: () => getCommentsByAnnouncementID(id),
    retry: false,
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

export const useCreateCommentByAnnouncementId = (announcementId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CommentPayload) =>
      postCommentByAnnouncementID(announcementId, payload),
    onSuccess: () => {
      // Invalidate announcement comments
      queryClient.invalidateQueries({
        queryKey: [
          COMMENT_QUERY_KEYS.COMMENTS_BY_ANNOUNCEMENT_ID,
          announcementId,
        ],
      });
    },
    onError: () => {
      toast.error("Đã có lỗi xảy ra khi thêm bình luận.");
    },
    retry: false,
  });
};

// Common Hooks
export const useDeleteComment = (
  postId: string,
  type: "feedback" | "announcement",
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCommentById(id),
    onSuccess: () => {
      toast.success("Xóa bình luận thành công!");
      // Determine the correct query key to invalidate based on type
      const queryKey =
        type === "feedback"
          ? [COMMENT_QUERY_KEYS.COMMENTS_BY_POST_ID, postId]
          : [COMMENT_QUERY_KEYS.COMMENTS_BY_ANNOUNCEMENT_ID, postId];

      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      toast.error("Đã có lỗi xảy ra khi xóa bình luận.");
    },
    retry: false,
  });
};

export const useReportComment = () => {
  return useMutation({
    mutationFn: (data: { id: string; reason: string }) =>
      reportCommentById(data.id, data.reason),
    onSuccess: () => {
      toast.success("Thao tác thành công!");
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      if (status === 400) {
        toast.error("Bạn đã báo cáo bình luận này trước đó.");
      } else toast.error("Đã có lỗi xảy ra khi báo cáo bình luận.");
    },
    retry: false,
  });
};
