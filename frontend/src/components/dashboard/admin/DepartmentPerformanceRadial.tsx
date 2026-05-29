"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TopDepartmentStatsDto } from "@/types/report";
import { Building2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SingleDeptPerformanceChart } from "./SingleDeptPerformanceChart";

const ITEMS_PER_PAGE = 6;

interface Props {
  data?: TopDepartmentStatsDto[];
  isLoading: boolean;
}

export function DepartmentPerformanceRadial({ data, isLoading }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { paginatedData, totalPages, totalItems } = useMemo(() => {
    if (!data) return { paginatedData: [], totalPages: 0, totalItems: 0 };

    const filtered = data.filter((dept) =>
      dept.departmentName.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const total = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const sliced = filtered.slice(start, end);

    return {
      paginatedData: sliced,
      totalPages: total,
      totalItems: filtered.length,
    };
  }, [data, searchTerm, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="h-[500px] w-full animate-pulse rounded-2xl bg-slate-200/60" />
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-200/50">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900">
              Hiệu suất phòng ban
            </h3>
            <p className="mt-0.5 text-sm font-medium text-slate-500">
              Trạng thái xử lý & Thời gian xử lý trung bình
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-[250px]">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Tìm tên phòng ban..."
            className="h-10 rounded-full border-slate-200 bg-slate-50 pl-9 transition-colors focus-visible:ring-indigo-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="flex-1 p-6">
        {paginatedData.length === 0 ? (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-slate-400">
            <Search className="mb-4 h-12 w-12 text-slate-200" />
            <p className="font-medium text-slate-500">
              Không tìm thấy phòng ban nào
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedData.map((dept, index) => (
              <Link
                key={index}
                className="cursor-pointer"
                href={`/admin/feedbacks-management?departmentId=${dept.departmentId}`}
              >
                <SingleDeptPerformanceChart dept={dept} />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-4 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
        <div className="flex flex-col gap-3 text-xs font-medium text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm"></div>
              <span>Đã xử lý</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-sm"></div>
              <span>Chưa xử lý</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-slate-400/80"></div>
              <span>N/A</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-400/80"></div>
              <span>&lt;24h (Tốt)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-amber-400/80"></div>
              <span>24-72h (TB)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-rose-400/80"></div>
              <span>&gt;72h (Kém)</span>
            </div>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex w-full items-center justify-between border-t border-slate-100/60 pt-2">
            <div className="text-xs font-medium text-slate-500">
              Hiển thị {paginatedData.length} / {totalItems} kết quả
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-100 hover:text-slate-900"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-[70px] text-center text-xs font-semibold text-slate-700">
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-100 hover:text-slate-900"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
