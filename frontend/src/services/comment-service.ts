import axiosInstance from "@/config/axiosConfig";
import { Comment, CommentPayload, PaginatedResponse } from "@/types";

const commentBaseUrl = "/comments";
export const getCommentsByPostID = async (
  id: string,
): Promise<PaginatedResponse<Comment>> => {
  const response = await axiosInstance.get<PaginatedResponse<Comment>>(
    `${commentBaseUrl}/post/${id}`,
  );
  return response;
};
export const postCommentByPostID = async (
  postId: string,
  payload: CommentPayload,
) => {
  await axiosInstance.post(`${commentBaseUrl}/post/${postId}`, {
    ...payload,
  });
};
export const deleteCommentById = async (id: string) => {
  await axiosInstance.delete(`${commentBaseUrl}/${id}`);
};
