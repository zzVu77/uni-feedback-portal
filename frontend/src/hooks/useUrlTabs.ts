// hooks/useUrlTabs.ts
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
/**
 * Custom Hook để quản lý trạng thái tab dựa trên URL search params.
 * * @template T - Union type của các giá trị tab hợp lệ, ví dụ: "all" | "feedback" | "forum"
 * @param {string} paramName - Tên của param trong URL, ví dụ: 'tab'
 * @param {readonly T[]} validTabs - Mảng các giá trị tab hợp lệ (sử dụng `readonly` để đảm bảo mảng không thay đổi)
 * @param {T} defaultValue - Giá trị mặc định của tab
 * @returns {{
 * currentTabValue: T,
 * handleTabChange: (value: T) => void
 * }}
 */
export function useUrlTabs<T extends string>(
  paramName: string,
  validTabs: readonly T[],
  defaultValue: T,
) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Lấy giá trị hiện tại từ URL
  const rawTabValue = searchParams.get(paramName);

  // 2. Ép kiểu và kiểm tra tính hợp lệ
  // Sử dụng assertion `as T` an toàn vì chúng ta kiểm tra `validTabs.includes`
  const currentTabValue: T = validTabs.includes(rawTabValue as T)
    ? (rawTabValue as T)
    : defaultValue;

  // 3. Hàm cập nhật URL khi tab thay đổi
  const handleTabChange = useCallback(
    (value: T) => {
      // TypeScript đảm bảo `value` là một trong các `T`

      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set(paramName, value);

      // Cập nhật URL
      router.push(`?${newSearchParams.toString()}`, { scroll: false });
    },
    [router, searchParams, paramName],
  );

  return {
    currentTabValue,
    handleTabChange,
  };
}
