import { useCategoryOptionsData } from "@/hooks/filters/useCategoryOptions";
import React, { Suspense } from "react";
import Filter from "./filter/Filter";
import { useGetDepartmentOptions } from "@/hooks/queries/useDepartmentQueries";
import { FeedbackStatus } from "@/constants/data";

export const CategorySelection = () => {
  const { data } = useCategoryOptionsData();
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
export const StatusSelection = () => {
  return (
    <Suspense fallback={null}>
      <Filter type="status" items={FeedbackStatus} />
    </Suspense>
  );
};
const CommonFilter = {
  CategorySelection,
  DepartmentSelection,
  SortBySelection,
  StatusSelection,
};

export default CommonFilter;
