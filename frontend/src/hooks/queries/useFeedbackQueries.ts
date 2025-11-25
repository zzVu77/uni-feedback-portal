/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createNewFeedback,
  deleteFeedbackById,
  forwardStaffFeedbackById,
  getAllFeedbacks,
  getAllFeedbacksOfAllDepartments,
  getAllStaffFeedbacks,
  getMyFeedbackById,
  getStaffFeedbackById,
  updateFeedbackById,
  updateStaffFeedbackStatusById,
} from "@/services/feedback-service";
import {
  FeedbackFilter,
  CreateFeedbackPayload,
  UpdateFeedbackStatusParams,
  ForwardFeedbackParams,
} from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const FEEDBACK_QUERY_KEYS = {
  student: {
    MY_FEEDBACKS: "my-feedbacks",
    MY_FEEDBACK_DETAIL: "my-feedback-detail",
  },
  staff: {
    STAFF_FEEDBACKS: "staff-feedbacks",
    STAFF_FEEDBACK_DETAIL: "staff-feedback-detail",
  },
  admin: {
    ALL_DEPARTMENTS_FEEDBACKS: "admin-all-departments-feedbacks",
  },
};
type FeedbackUpdateParams = {
  id: string;
  data: CreateFeedbackPayload;
};

// --- STUDENT HOOKS ---

export const useGetFeedbacks = (filters: FeedbackFilter) => {
  return useQuery({
    queryKey: [FEEDBACK_QUERY_KEYS.student.MY_FEEDBACKS, filters],
    queryFn: () => getAllFeedbacks(filters),
    retry: false,
    placeholderData: (previousData) => previousData,
  });
};

export const useGetMyFeedbackById = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [FEEDBACK_QUERY_KEYS.student.MY_FEEDBACK_DETAIL, id],
    queryFn: () => getMyFeedbackById(id),
    retry: false,
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

export const useCreateFeedback = () => {
  return useMutation({
    mutationFn: (data: CreateFeedbackPayload) => createNewFeedback(data),
    retry: false,
    onSuccess: () => {
      toast.success("Gửi góp ý thành công!");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    },
  });
};

export const useUpdateFeedbackById = () => {
  return useMutation({
    mutationFn: (params: FeedbackUpdateParams) =>
      updateFeedbackById(params.id, params.data),
    retry: false,
    onSuccess: () => {
      toast.success("Cập nhật góp ý thành công!");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    },
  });
};

export const useDeleteFeedbackById = () => {
  return useMutation({
    mutationFn: (id: string) => deleteFeedbackById(id),
    retry: false,
    onSuccess: () => {
      toast.success("Xoá góp ý thành công!");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    },
  });
};

// --- STAFF HOOKS ---

export const useGetStaffFeedbacks = (filters: FeedbackFilter) => {
  return useQuery({
    queryKey: [FEEDBACK_QUERY_KEYS.staff.STAFF_FEEDBACKS, filters],
    queryFn: () => getAllStaffFeedbacks(filters),
    retry: false,
    placeholderData: (previousData) => previousData,
  });
};

export const useGetStaffFeedbackById = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [FEEDBACK_QUERY_KEYS.staff.STAFF_FEEDBACK_DETAIL, id],
    queryFn: () => getStaffFeedbackById(id),
    retry: false,
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

export const useUpdateStaffFeedbackStatusById = () => {
  return useMutation({
    mutationFn: (params: UpdateFeedbackStatusParams) =>
      updateStaffFeedbackStatusById(params.id, params.status, params.note),
    retry: false,
    onSuccess: () => {
      toast.success("Cập nhật trạng thái góp ý thành công!");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    },
  });
};

export const useForwardStaffFeedbackById = () => {
  return useMutation({
    mutationFn: (params: ForwardFeedbackParams) =>
      forwardStaffFeedbackById(params.id, params.toDepartmentId, params.note),
    retry: false,
    onSuccess: () => {
      toast.success("Chuyển tiếp góp ý thành công!");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    },
  });
};

// --- ADMIN HOOKS  ---
export const useGetAllFeedbacksOfAllDepartments = (filters: FeedbackFilter) => {
  return useQuery({
    queryKey: [FEEDBACK_QUERY_KEYS.admin.ALL_DEPARTMENTS_FEEDBACKS, filters],
    queryFn: () => getAllFeedbacksOfAllDepartments(filters),
    retry: false,
    placeholderData: (previousData) => previousData,
  });
};
