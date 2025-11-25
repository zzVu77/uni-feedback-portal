import axiosInstance from "@/config/axiosConfig";
import { Comment, CommentPayload, PaginatedResponse } from "@/types";

const commentBaseUrl = "/comments";
// Feedback Post Comments services
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
// Announcement Comments services
export const getCommentsByAnnouncementID = async (
  id: string,
): Promise<PaginatedResponse<Comment>> => {
  const response = await axiosInstance.get<PaginatedResponse<Comment>>(
    `${commentBaseUrl}/announcement/${id}`,
  );
  return response;
};
export const postCommentByAnnouncementID = async (
  announcementId: string,
  payload: CommentPayload,
) => {
  await axiosInstance.post(`${commentBaseUrl}/announcement/${announcementId}`, {
    ...payload,
  });
};
// General services
export const deleteCommentById = async (id: string) => {
  await axiosInstance.delete(`${commentBaseUrl}/${id}`);
};
export const reportCommentById = async (id: string, reason: string) => {
  await axiosInstance.post(`${commentBaseUrl}/report/${id}`, { reason });
};
