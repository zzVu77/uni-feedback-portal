"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SocialListeningFilter } from "@/types/social-listening";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

interface SocialListeningDatePickerProps {
  onUpdate: (range: Partial<SocialListeningFilter>) => void;
  className?: string;
  defaultStartDate?: string;
  defaultEndDate?: string;
}

export function SocialListeningDatePicker({
  onUpdate,
  className,
  defaultStartDate,
  defaultEndDate,
}: SocialListeningDatePickerProps) {
  const parseDate = (dateStr?: string) => {
    if (!dateStr) return undefined;
    return parseISO(dateStr);
  };

  const [isOpen, setIsOpen] = React.useState(false);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: parseDate(defaultStartDate),
    to: parseDate(defaultEndDate),
  });

  React.useEffect(() => {
    setDate({
      from: parseDate(defaultStartDate),
      to: parseDate(defaultEndDate),
    });
  }, [defaultStartDate, defaultEndDate]);

  const handleApply = () => {
    onUpdate({
      startDate: date?.from ? format(date.from, "yyyy-MM-dd") : undefined,
      endDate: date?.to ? format(date.to, "yyyy-MM-dd") : undefined,
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    setDate(undefined);
    onUpdate({ startDate: undefined, endDate: undefined });
    setIsOpen(false);
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
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy")} -{" "}
                  {format(date.to, "dd/MM/yyyy")}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy")
              )
            ) : (
              <span>Chọn khoảng thời gian</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="end">
          <div className="flex items-center justify-between border-b bg-slate-50/50 px-4 py-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-slate-500 uppercase">
                Từ ngày
              </span>
              <span className="text-sm font-medium text-slate-900">
                {date?.from ? format(date.from, "dd/MM/yyyy") : "---"}
              </span>
            </div>
            <div className="text-slate-300">-</div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-semibold text-slate-500 uppercase">
                Đến ngày
              </span>
              <span className="text-sm font-medium text-slate-900">
                {date?.to ? format(date.to, "dd/MM/yyyy") : "---"}
              </span>
            </div>
          </div>

          <div className="p-3">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
            />

            {/* Footer */}
            <div className="mt-2 flex items-center justify-between border-t pt-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleClear}
              >
                Xóa
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
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
