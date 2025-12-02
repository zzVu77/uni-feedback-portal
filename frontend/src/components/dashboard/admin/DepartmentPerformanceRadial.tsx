"use client";
import { useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TopDepartmentStatsDto } from "@/types/report";
import { cn } from "@/lib/utils";

// Cấu hình màu sắc Chart
const chartConfig = {
  resolved: {
    label: "Đã xử lý",
    color: "hsl(221.2 83.2% 53.3%)", // Blue tone
  },
  unresolved: {
    label: "Chưa xử lý",
    color: "hsl(0 84.2% 60.2%)", // Red tone
  },
} satisfies ChartConfig;

const ITEMS_PER_PAGE = 6;

interface Props {
  data?: TopDepartmentStatsDto[];
  isLoading: boolean;
}

const getPerformanceColor = (hours: number) => {
  if (hours === 0) return "fill-slate-400/80";
  if (hours <= 24) return "fill-emerald-400/80";
  if (hours <= 72) return "fill-amber-400/80";
  return "fill-rose-400/80";
};

const SingleDeptChart = ({ dept }: { dept: TopDepartmentStatsDto }) => {
  const chartData = [
    {
      month: "data",
      resolved: dept.resolvedCount,
      unresolved: dept.unresolvedCount,
    },
  ];

  const performanceColor = getPerformanceColor(dept.avgResolutionTimeHours);

  return (
    <div className="flex flex-col items-center rounded-lg p-2 transition-colors hover:bg-slate-50">
      <div
        className="mb-2 line-clamp-1 h-5 w-full px-2 text-center text-sm font-medium"
        title={dept.departmentName}
      >
        {dept.departmentName}
      </div>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-full max-w-40"
      >
        <RadialBarChart
          data={chartData}
          endAngle={180}
          innerRadius={55}
          outerRadius={90}
        >
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 16}
                        className={cn("text-xl font-bold", performanceColor)}
                      >
                        {dept.avgResolutionTimeHours.toFixed(1)}h
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 4}
                        className="fill-muted-foreground text-[10px]"
                      >
                        Trung bình
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
          <RadialBar
            dataKey="unresolved"
            fill="var(--color-unresolved)"
            stackId="a"
            cornerRadius={5}
            className="stroke-transparent stroke-2"
          />
          <RadialBar
            dataKey="resolved"
            fill="var(--color-resolved)"
            stackId="a"
            cornerRadius={5}
            className="stroke-transparent stroke-2"
          />
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
};

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
      <div className="h-[500px] w-full animate-pulse rounded-xl bg-gray-100" />
    );
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="space-y-4 pb-2">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <CardTitle>Hiệu suất phòng ban</CardTitle>
            <CardDescription>
              Trạng thái xử lý & Thời gian trung bình
            </CardDescription>
          </div>

          <div className="relative w-full md:w-[250px]">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              type="search"
              placeholder="Tìm tên phòng ban..."
              className="bg-muted/30 h-9 pl-9"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="min-h-[300px] flex-1 pb-4">
        {paginatedData.length === 0 ? (
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center py-10">
            <Search className="mb-2 h-10 w-10 opacity-20" />
            <p>Không tìm thấy phòng ban nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedData.map((dept, index) => (
              <SingleDeptChart key={index} dept={dept} />
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-4 border-t pt-4 text-xs">
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[hsl(221.2,83.2%,53.3%)]"></div>
              <span>Đã xử lý</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[hsl(0,84.2%,60.2%)]"></div>
              <span>Chưa xử lý</span>
            </div>
          </div>

          <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-[10px]">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-slate-400"></div>
              <span>N/A</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span>&lt;24h (Tốt)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
              <span>24-72h (TB)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-rose-500"></div>
              <span>&gt;72h (Kém)</span>
            </div>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="mt-2 flex w-full items-center justify-between">
            <div className="text-muted-foreground">
              Hiển thị {paginatedData.length} / {totalItems} kết quả
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-[60px] text-center text-sm font-medium">
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
