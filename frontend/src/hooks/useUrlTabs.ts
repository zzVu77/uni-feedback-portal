// hooks/useUrlTabs.ts
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
/**
 * Custom Hook to manage tab state based on URL search params.
 * @template T - Union type of valid tab values, e.g., "all" | "feedback" | "forum"
 * @param {string} paramName - Name of the param in the URL, e.g., 'tab'
 * @param {readonly T[]} validTabs - Array of valid tab values (use `readonly` to ensure the array is not modified)
 * @param {T} defaultValue - Default tab value if URL param is missing or invalid
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

  // 1. Get current tab value from URL
  const rawTabValue = searchParams.get(paramName);

  // 2. Cast and validate
  // Use assertion `as T` safely because we check `validTabs.includes`
  const currentTabValue: T = validTabs.includes(rawTabValue as T)
    ? (rawTabValue as T)
    : defaultValue;

  // 3. Function to update URL when tab changes
  const handleTabChange = useCallback(
    (value: T) => {
      // TypeScript ensures `value` is one of `T`

      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set(paramName, value);

      // Update URL
      router.push(`?${newSearchParams.toString()}`, { scroll: false });
    },
    [router, searchParams, paramName],
  );

  return {
    currentTabValue,
    handleTabChange,
  };
}
