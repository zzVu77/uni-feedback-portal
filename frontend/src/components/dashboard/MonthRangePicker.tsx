"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ReportFilter } from "@/types/report";
import {
  endOfMonth,
  format,
  isBefore,
  isSameMonth,
  isWithinInterval,
  startOfMonth,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  XCircle,
} from "lucide-react";
import * as React from "react";

interface MonthRangePickerProps {
  onUpdate: (range: ReportFilter) => void;
  className?: string;
}

export function MonthRangePicker({
  onUpdate,
  className,
}: MonthRangePickerProps) {
  const [date, setDate] = React.useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const [viewYear, setViewYear] = React.useState<number>(
    new Date().getFullYear(),
  );
  const [isOpen, setIsOpen] = React.useState(false);

  // Danh sách tháng hiển thị
  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const handleMonthSelect = (monthIndex: number) => {
    // Create date object for the selected month
    const selectedDate = new Date(viewYear, monthIndex, 1);

    const isRangeSelected = !isSameMonth(date.from, date.to); // Check if currently a range is selected

    if (isRangeSelected) {
      // Case 1: Selecting a new start month after a range is already selected
      const newFrom = startOfMonth(selectedDate);
      const newTo = endOfMonth(selectedDate);

      setDate({ from: newFrom, to: newTo });
      // Not triggering onUpdate yet, wait for user to finish selection or close popover
    } else {
      // Case 2: Selecting the end month after a single month is selected (e.g., Jan)
      const currentFrom = date.from;

      if (isBefore(selectedDate, currentFrom)) {
        // If user selects a month BEFORE the start month (e.g., currently selecting Feb, clicks on Jan)
        // -> Reverse: Jan is From, Feb is To
        setDate({
          from: startOfMonth(selectedDate),
          to: endOfMonth(currentFrom),
        });
      } else {
        // User selects a month AFTER the start month (e.g., currently selecting Jan, clicks on Mar)
        // -> Jan is From, Mar is To
        setDate({
          from: startOfMonth(currentFrom),
          to: endOfMonth(selectedDate),
        });
      }

      // After selecting the end month, you might want to automatically close the popover
      // But to let the user confirm visually, keep the popover open and update data immediately
    }
  };

  // Apply changes when closing Popover or when user wants to see results
  React.useEffect(() => {
    onUpdate({
      from: format(date.from, "yyyy-MM-dd"),
      to: format(date.to, "yyyy-MM-dd"),
    });
  }, [date, onUpdate]);

  // Helper to calculate style for each month cell
  const getMonthState = (monthIndex: number) => {
    const currentMonth = new Date(viewYear, monthIndex, 1);

    // 1. Check if it is the start or end point
    const isStart = isSameMonth(currentMonth, date.from);
    const isEnd = isSameMonth(currentMonth, date.to);

    if (isStart || isEnd) return "selected";

    // 2. Check if it is WITHIN the interval
    // Note: interval must consider start of from and end of to for accuracy
    if (isWithinInterval(currentMonth, { start: date.from, end: date.to })) {
      return "in-range";
    }

    return "default";
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start border-blue-200 bg-blue-50 text-left font-normal text-blue-700 hover:bg-blue-100 md:w-[280px]",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {/* Display smart Label */}
            {isSameMonth(date.from, date.to) ? (
              format(date.from, "MM/yyyy")
            ) : (
              <>
                {format(date.from, "MM/yyyy")} - {format(date.to, "MM/yyyy")}
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="w-[320px] p-4">
            {/* Header: Điều hướng Năm */}
            <div className="mb-4 flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-slate-100"
                onClick={() => setViewYear(viewYear - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-base font-bold text-slate-900">
                Năm {viewYear}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-slate-100"
                onClick={() => setViewYear(viewYear + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Grid: 12 Months */}
            <div className="grid grid-cols-3 gap-3">
              {months.map((month, index) => {
                const state = getMonthState(index);
                return (
                  <button
                    key={index}
                    onClick={() => handleMonthSelect(index)}
                    className={cn(
                      "rounded-md border border-transparent px-2 py-2 text-sm font-medium transition-all",

                      // Default
                      state === "default" &&
                        "text-slate-700 hover:border-slate-200 hover:bg-slate-100",

                      // Selected (Start/End) -> Dark Blue
                      state === "selected" &&
                        "scale-105 bg-blue-600 text-white shadow-md hover:bg-blue-700",

                      // In Range (In between) -> Light Blue
                      state === "in-range" &&
                        "bg-blue-100 text-blue-700 hover:bg-blue-200",
                    )}
                  >
                    {month}
                  </button>
                );
              })}
            </div>

            {/* Footer: Quick Actions */}
            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <span className="text-muted-foreground text-xs">
                {isSameMonth(date.from, date.to)
                  ? "Chọn tháng kết thúc..."
                  : "Đã chọn khoảng thời gian"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-red-500 hover:bg-red-50 hover:text-red-700"
                onClick={() => {
                  // Reset về tháng hiện tại
                  const now = new Date();
                  setDate({ from: startOfMonth(now), to: endOfMonth(now) });
                  setViewYear(now.getFullYear());
                  setIsOpen(false);
                }}
              >
                <XCircle className="mr-1 h-3 w-3" />
                Đặt lại
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
