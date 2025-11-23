import { useCategoryOptionsData } from "@/hooks/filters/useCategoryOptions";
import React, { Suspense } from "react";
import Filter from "./filter/Filter";
import { useGetDepartmentOptions } from "@/hooks/queries/useDepartmentQueries";

export const CategorySelection = () => {
  const { data } = useCategoryOptionsData();
  const categoryOptions = [{ label: "Tất cả", value: "all" }, ...(data || [])];
  return (
    <Suspense fallback={null}>
      <Filter type="category" items={categoryOptions} />
    </Suspense>
  );
};

export const DepartmentSelection = () => {
  const { data } = useGetDepartmentOptions();
  const departmentOptions = [
    { label: "Tất cả", value: "all" },
    ...(data || []),
  ];
  return (
    <Suspense fallback={null}>
      <Filter type="department" items={departmentOptions} />
    </Suspense>
  );
};

const CommonFilter = {
  CategorySelection,
  DepartmentSelection,
};

export default CommonFilter;
