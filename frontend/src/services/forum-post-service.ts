import axiosInstance from "@/config/axiosConfig";
import {
  ForumPostDetail,
  ForumPostFilter,
  ForumPostListItem,
  PaginatedResponse,
} from "@/types";

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
export const getForumPostById = async (
  id: string,
): Promise<ForumPostDetail> => {
  const response = await axiosInstance.get<ForumPostDetail>(
    `${forumPostBaseUrl}/${id}`,
  );
  return response;
};
export const voteForumPost = async (id: string): Promise<void> => {
  await axiosInstance.post(`${forumPostBaseUrl}/${id}/vote`);
};
export const unvoteForumPost = async (id: string) => {
  await axiosInstance.delete(`${forumPostBaseUrl}/${id}/vote`);
};
