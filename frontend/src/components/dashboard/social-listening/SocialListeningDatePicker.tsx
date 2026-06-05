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
import { format, parseISO, startOfMonth, startOfDay } from "date-fns";
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
  // Default dates: First day of current month to current day
  const defaultFrom = startOfMonth(new Date());
  const defaultTo = startOfDay(new Date());

  const parseDate = (dateStr?: string, fallback?: Date) => {
    if (!dateStr) return fallback;
    return parseISO(dateStr);
  };

  const [isOpen, setIsOpen] = React.useState(false);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: parseDate(defaultStartDate, defaultFrom),
    to: parseDate(defaultEndDate, defaultTo),
  });

  React.useEffect(() => {
    if (defaultStartDate || defaultEndDate) {
      setDate({
        from: parseDate(defaultStartDate, defaultFrom),
        to: parseDate(defaultEndDate, defaultTo),
      });
    }
  }, [defaultStartDate, defaultEndDate]);

  const handleApply = () => {
    onUpdate({
      startDate: date?.from ? format(date.from, "yyyy-MM-dd") : undefined,
      endDate: date?.to ? format(date.to, "yyyy-MM-dd") : undefined,
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    setDate({ from: defaultFrom, to: defaultTo });
    onUpdate({
      startDate: format(defaultFrom, "yyyy-MM-dd"),
      endDate: format(defaultTo, "yyyy-MM-dd"),
    });
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

        <PopoverContent
          className="w-auto max-w-[95vw] p-0"
          align="center"
          side="bottom"
          collisionPadding={10}
          avoidCollisions={true}
        >
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

          <div className="flex max-h-[50vh] flex-col gap-4 overflow-y-auto p-3 sm:max-h-none sm:flex-row sm:overflow-visible">
            <div className="flex flex-col gap-1">
              <span className="px-2 text-sm font-medium text-slate-700">
                Ngày bắt đầu
              </span>
              <Calendar
                mode="single"
                defaultMonth={date?.from}
                selected={date?.from}
                onSelect={(d) => setDate((prev) => ({ ...prev, from: d }))}
                disabled={[
                  { after: new Date() },
                  ...(date?.to ? [{ after: date.to }] : []),
                ]}
              />
            </div>
            <div className="hidden border-l border-slate-100 sm:block"></div>
            <div className="flex flex-col gap-1">
              <span className="px-2 text-sm font-medium text-slate-700">
                Ngày kết thúc
              </span>
              <Calendar
                mode="single"
                defaultMonth={date?.to}
                selected={date?.to}
                onSelect={(d) =>
                  setDate((prev) => ({ ...prev, from: prev?.from, to: d }))
                }
                disabled={[
                  { after: new Date() },
                  ...(date?.from ? [{ before: date.from }] : []),
                ]}
              />
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
