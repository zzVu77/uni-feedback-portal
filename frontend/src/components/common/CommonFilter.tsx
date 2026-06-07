import { useCategoryOptionsData } from "@/hooks/filters/useCategoryOptions";
import React, { Suspense } from "react";
import Filter from "./filter/Filter";
import { useGetDepartmentOptions } from "@/hooks/queries/useDepartmentQueries";
import { FeedbackStatus, StaffFeedbackStatus } from "@/constants/data";

export const CategorySelection = () => {
  const { data } = useCategoryOptionsData("all");
  const categoryOptions = [
    { label: "Danh mục", value: "all" },
    ...(data || []),
  ];
  return (
    <Suspense fallback={null}>
      <Filter type="category" items={categoryOptions} />
    </Suspense>
  );
};

export const DepartmentSelection = () => {
  const { data } = useGetDepartmentOptions();
  const departmentOptions = [
    { label: "Phòng ban", value: "all" },
    ...(data || []),
  ];
  return (
    <Suspense fallback={null}>
      <Filter type="department" items={departmentOptions} />
    </Suspense>
  );
};

export const SortBySelection = () => {
  const sortByOptions = [
    { label: "Sắp xếp", value: "all" },
    { label: "Mới nhất", value: "new" },
    { label: "Nổi bật", value: "top" },
  ];
  return (
    <Suspense fallback={null}>
      <Filter type="sortBy" items={sortByOptions} />
    </Suspense>
  );
};
export const StatusSelection = ({
  type = "staff",
}: {
  type?: "staff" | "student";
}) => {
  const statusOptions = type === "staff" ? StaffFeedbackStatus : FeedbackStatus;
  return (
    <Suspense fallback={null}>
      <Filter type="status" items={statusOptions} />
    </Suspense>
  );
};

export const ReportStatusSelection = () => {
  const reportStatusOptions = [
    { label: "Trạng thái", value: "all" },
    { label: "Đang chờ tiếp nhận", value: "PENDING" },
    { label: "Đã xử lý", value: "RESOLVED" },
  ];
  return (
    <Suspense fallback={null}>
      <Filter type="status" items={reportStatusOptions} />
    </Suspense>
  );
};
export const ReportReasonSelection = () => {
  const reportReasonOptions = [
    { label: "Lý do báo cáo", value: "all" },
    { label: "Spam hoặc quảng cáo", value: "SPAM" },
    { label: "Quấy rối hoặc bắt nạt", value: "HARASSMENT" },
    { label: "Nội dung không phù hợp", value: "INAPPROPRIATE_CONTENT" },
    { label: "Ngôn từ thù địch", value: "HATE_SPEECH" },
    { label: "Khác", value: "OTHER" },
  ];
  return (
    <Suspense fallback={null}>
      <Filter type="reportReasonComment" items={reportReasonOptions} />
    </Suspense>
  );
};

export const UserRoleSelection = ({
  options,
}: {
  options?: { label: string; value: string }[];
}) => {
  const defaultOptions = [
    { label: "Phân quyền", value: "all" },
    { label: "Sinh viên", value: "STUDENT" },
    { label: "Nhân viên phòng ban", value: "DEPARTMENT_STAFF" },
    { label: "Cộng tác viên", value: "STAFF_ASSISTANT" },
    { label: "Quản trị viên", value: "ADMIN" },
  ];
  return (
    <Suspense fallback={null}>
      <Filter type="role" items={options || defaultOptions} />
    </Suspense>
  );
};

export const UserStatusSelection = () => {
  const statusOptions = [
    { label: "Trạng thái", value: "all" },
    { label: "Hoạt động", value: "ACTIVE" },
    { label: "Đã khóa", value: "DEACTIVATED" },
    { label: "Bị cấm", value: "BANNED" },
  ];
  return (
    <Suspense fallback={null}>
      <Filter type="status" items={statusOptions} />
    </Suspense>
  );
};

const CommonFilter = {
  CategorySelection,
  DepartmentSelection,
  SortBySelection,
  StatusSelection,
  ReportStatusSelection,
  ReportReasonSelection,
  UserRoleSelection,
  UserStatusSelection,
};

export default CommonFilter;
