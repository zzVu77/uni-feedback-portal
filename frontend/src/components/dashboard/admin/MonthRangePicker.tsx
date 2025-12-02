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
  parseISO,
  isValid,
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
  defaultFrom?: string;
  defaultTo?: string;
}

export function MonthRangePicker({
  onUpdate,
  className,
  defaultFrom,
  defaultTo,
}: MonthRangePickerProps) {
  // Helper để parse date string an toàn
  const parseDate = (dateStr?: string, fallback = new Date()) => {
    if (!dateStr) return fallback;
    const parsed = parseISO(dateStr);
    return isValid(parsed) ? parsed : fallback;
  };

  const [date, setDate] = React.useState<{ from: Date; to: Date }>({
    from: parseDate(defaultFrom, startOfMonth(new Date())),
    to: parseDate(defaultTo, endOfMonth(new Date())),
  });

  React.useEffect(() => {
    if (defaultFrom && defaultTo) {
      setDate({
        from: parseDate(defaultFrom),
        to: parseDate(defaultTo),
      });
      setViewYear(parseDate(defaultFrom).getFullYear());
    }
  }, [defaultFrom, defaultTo]);

  const [viewYear, setViewYear] = React.useState<number>(
    date.from.getFullYear(),
  );
  const [isOpen, setIsOpen] = React.useState(false);

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
    const selectedDate = new Date(viewYear, monthIndex, 1);
    const isRangeSelected = !isSameMonth(date.from, date.to);

    let newRange = { ...date };

    if (isRangeSelected) {
      // Case 1: There is a range -> Reset selection from the beginning
      newRange = {
        from: startOfMonth(selectedDate),
        to: endOfMonth(selectedDate),
      };
      setDate(newRange);
    } else {
      // Case 2: Choose the end month
      const currentFrom = date.from;
      if (isBefore(selectedDate, currentFrom)) {
        newRange = {
          from: startOfMonth(selectedDate),
          to: endOfMonth(currentFrom),
        };
      } else {
        newRange = {
          from: startOfMonth(currentFrom),
          to: endOfMonth(selectedDate),
        };
      }
      setDate(newRange);
    }

    // Trigger update immediately
    onUpdate({
      from: format(newRange.from, "yyyy-MM-dd"),
      to: format(newRange.to, "yyyy-MM-dd"),
    });
  };

  const currentYear = new Date().getFullYear();

  // Helper tính style
  const getMonthState = (monthIndex: number) => {
    const currentMonth = new Date(viewYear, monthIndex, 1);
    const isStart = isSameMonth(currentMonth, date.from);
    const isEnd = isSameMonth(currentMonth, date.to);

    if (isStart || isEnd) return "selected";
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
              "justify-start border-blue-200 bg-blue-50 text-left font-normal text-blue-700 hover:bg-blue-100 hover:text-blue-800",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
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
            <div className="mb-4 flex items-center justify-between">
              <Button
                variant="ghost"
                disabled={viewYear === 1970}
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
                disabled={viewYear === currentYear}
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-slate-100"
                onClick={() => setViewYear(viewYear + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {months.map((month, index) => {
                const state = getMonthState(index);
                return (
                  <button
                    key={index}
                    onClick={() => handleMonthSelect(index)}
                    className={cn(
                      "rounded-md border border-transparent px-2 py-2 text-sm font-medium transition-all",
                      state === "default" &&
                        "text-slate-700 hover:border-slate-200 hover:bg-slate-100",
                      state === "selected" &&
                        "scale-105 bg-blue-600 text-white shadow-md hover:bg-blue-700",
                      state === "in-range" &&
                        "bg-blue-100 text-blue-700 hover:bg-blue-200",
                    )}
                  >
                    {month}
                  </button>
                );
              })}
            </div>

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
                  const now = new Date();
                  const newRange = {
                    from: startOfMonth(now),
                    to: endOfMonth(now),
                  };
                  setDate(newRange);
                  setViewYear(now.getFullYear());
                  setIsOpen(false);

                  // Update URL
                  onUpdate({
                    from: format(newRange.from, "yyyy-MM-dd"),
                    to: format(newRange.to, "yyyy-MM-dd"),
                  });
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
