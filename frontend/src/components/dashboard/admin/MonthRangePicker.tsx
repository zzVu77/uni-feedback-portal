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
  isAfter,
  isBefore,
  isSameMonth,
  isValid,
  parseISO,
  startOfMonth,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
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
  const parseDate = (dateStr?: string, fallback = new Date()) => {
    if (!dateStr) return fallback;
    const parsed = parseISO(dateStr);
    return isValid(parsed) ? parsed : fallback;
  };

  const defaultFromDate = startOfMonth(new Date());
  const defaultToDate = endOfMonth(new Date());

  const [date, setDate] = React.useState<{ from: Date; to: Date }>({
    from: parseDate(defaultFrom, defaultFromDate),
    to: parseDate(defaultTo, defaultToDate),
  });

  React.useEffect(() => {
    if (defaultFrom && defaultTo) {
      const fromDate = parseDate(defaultFrom, defaultFromDate);
      const toDate = parseDate(defaultTo, defaultToDate);
      setDate({
        from: fromDate,
        to: toDate,
      });
      setFromViewYear(fromDate.getFullYear());
      setToViewYear(toDate.getFullYear());
    }
  }, [defaultFrom, defaultTo]);

  const [fromViewYear, setFromViewYear] = React.useState<number>(
    date.from.getFullYear(),
  );
  const [toViewYear, setToViewYear] = React.useState<number>(
    date.to.getFullYear(),
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

  const handleApply = () => {
    onUpdate({
      from: format(date.from, "yyyy-MM-dd"),
      to: format(date.to, "yyyy-MM-dd"),
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    const now = new Date();
    const resetFrom = startOfMonth(now);
    const resetTo = endOfMonth(now);
    setDate({ from: resetFrom, to: resetTo });
    setFromViewYear(resetFrom.getFullYear());
    setToViewYear(resetTo.getFullYear());

    onUpdate({
      from: format(resetFrom, "yyyy-MM-dd"),
      to: format(resetTo, "yyyy-MM-dd"),
    });
    setIsOpen(false);
  };

  const currentYear = new Date().getFullYear();

  // Disable logic
  const isFromMonthDisabled = (monthIndex: number, year: number) => {
    const d = new Date(year, monthIndex, 1);
    if (isAfter(d, date.to)) return true; // Cannot be after selected End date
    if (isAfter(d, new Date())) return true; // Cannot be in future
    return false;
  };

  const isToMonthDisabled = (monthIndex: number, year: number) => {
    const d = new Date(year, monthIndex, 1);
    if (isBefore(d, startOfMonth(date.from))) return true; // Cannot be before selected Start date
    if (isAfter(d, new Date())) return true; // Cannot be in future
    return false;
  };

  const getMonthState = (
    monthIndex: number,
    year: number,
    type: "from" | "to",
  ) => {
    const currentMonth = new Date(year, monthIndex, 1);
    const targetDate = type === "from" ? date.from : date.to;
    if (isSameMonth(currentMonth, targetDate)) return "selected";
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
              "w-full justify-start bg-white text-left font-normal text-slate-700 shadow-sm md:w-[280px]",
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
        <PopoverContent
          className="w-auto max-w-[95vw] p-0"
          align="center"
          side="bottom"
          collisionPadding={10}
        >
          <div className="flex items-center justify-between border-b bg-slate-50/50 px-4 py-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-slate-500 uppercase">
                Từ tháng
              </span>
              <span className="text-sm font-medium text-slate-900">
                {date?.from ? format(date.from, "MM/yyyy") : "---"}
              </span>
            </div>
            <div className="text-slate-300">-</div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-semibold text-slate-500 uppercase">
                Đến tháng
              </span>
              <span className="text-sm font-medium text-slate-900">
                {date?.to ? format(date.to, "MM/yyyy") : "---"}
              </span>
            </div>
          </div>

          <div className="flex max-h-[50vh] flex-col gap-4 overflow-y-auto p-3 sm:max-h-none sm:flex-row sm:overflow-visible">
            {/* FROM GRID */}
            <div className="flex w-[240px] flex-col gap-2">
              <span className="px-2 text-sm font-medium text-slate-700">
                Từ tháng
              </span>
              <div className="mb-2 flex items-center justify-between">
                <Button
                  variant="ghost"
                  disabled={fromViewYear === 1970}
                  size="icon"
                  className="h-7 w-7 hover:bg-slate-100"
                  onClick={() => setFromViewYear(fromViewYear - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-bold text-slate-900">
                  Năm {fromViewYear}
                </div>
                <Button
                  disabled={fromViewYear === currentYear}
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-slate-100"
                  onClick={() => setFromViewYear(fromViewYear + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => {
                  const state = getMonthState(index, fromViewYear, "from");
                  const isDisabled = isFromMonthDisabled(index, fromViewYear);
                  return (
                    <button
                      key={index}
                      disabled={isDisabled}
                      onClick={() => {
                        const newFrom = startOfMonth(
                          new Date(fromViewYear, index, 1),
                        );
                        setDate((prev) => ({ ...prev, from: newFrom }));
                      }}
                      className={cn(
                        "rounded-md border border-transparent px-2 py-2 text-xs font-medium transition-all",
                        isDisabled &&
                          "cursor-not-allowed text-slate-400 opacity-50",
                        !isDisabled &&
                          state === "default" &&
                          "text-slate-700 hover:border-slate-200 hover:bg-slate-100",
                        !isDisabled &&
                          state === "selected" &&
                          "scale-105 bg-blue-600 text-white shadow-md hover:bg-blue-700",
                      )}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="hidden border-l border-slate-100 sm:block"></div>

            {/* TO GRID */}
            <div className="flex w-[240px] flex-col gap-2">
              <span className="px-2 text-sm font-medium text-slate-700">
                Đến tháng
              </span>
              <div className="mb-2 flex items-center justify-between">
                <Button
                  variant="ghost"
                  disabled={toViewYear === 1970}
                  size="icon"
                  className="h-7 w-7 hover:bg-slate-100"
                  onClick={() => setToViewYear(toViewYear - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-bold text-slate-900">
                  Năm {toViewYear}
                </div>
                <Button
                  disabled={toViewYear === currentYear}
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-slate-100"
                  onClick={() => setToViewYear(toViewYear + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => {
                  const state = getMonthState(index, toViewYear, "to");
                  const isDisabled = isToMonthDisabled(index, toViewYear);
                  return (
                    <button
                      key={index}
                      disabled={isDisabled}
                      onClick={() => {
                        const newTo = endOfMonth(
                          new Date(toViewYear, index, 1),
                        );
                        setDate((prev) => ({ ...prev, to: newTo }));
                      }}
                      className={cn(
                        "rounded-md border border-transparent px-2 py-2 text-xs font-medium transition-all",
                        isDisabled &&
                          "cursor-not-allowed text-slate-400 opacity-50",
                        !isDisabled &&
                          state === "default" &&
                          "text-slate-700 hover:border-slate-200 hover:bg-slate-100",
                        !isDisabled &&
                          state === "selected" &&
                          "scale-105 bg-blue-600 text-white shadow-md hover:bg-blue-700",
                      )}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t bg-slate-50/50 p-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleClear}
            >
              Mặc định
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleApply}
              disabled={!date?.from || !date?.to}
            >
              Áp dụng
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
