"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { DateRange } from "react-day-picker";

export function DateRangePicker({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const parseDate = (dateStr?: string | null) => {
    if (!dateStr) return undefined;
    try {
      return parseISO(dateStr);
    } catch {
      return undefined;
    }
  };

  const currentFrom = searchParams.get("from");
  const currentTo = searchParams.get("to");

  const [isOpen, setIsOpen] = React.useState(false);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: parseDate(currentFrom),
    to: parseDate(currentTo),
  });

  React.useEffect(() => {
    setDate({
      from: parseDate(searchParams.get("from")),
      to: parseDate(searchParams.get("to")),
    });
  }, [searchParams]);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (date?.from) {
      params.set("from", format(date.from, "yyyy-MM-dd"));
    } else {
      params.delete("from");
    }
    if (date?.to) {
      params.set("to", format(date.to, "yyyy-MM-dd"));
    } else {
      params.delete("to");
    }
    params.delete("page");
    router.replace(`?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  const handleClear = () => {
    setDate(undefined);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("from");
    params.delete("to");
    params.delete("page");
    router.replace(`?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start bg-white text-left font-normal text-slate-700 shadow-sm md:w-[260px]",
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
          className="z-[100] flex max-h-[85vh] w-auto max-w-[95vw] flex-col overflow-hidden p-0 max-sm:!fixed max-sm:!top-1/2 max-sm:!left-1/2 max-sm:!w-[90vw] max-sm:!-translate-x-1/2 max-sm:!-translate-y-1/2"
          align="center"
          side="bottom"
          collisionPadding={10}
          avoidCollisions={true}
        >
          <div className="flex flex-none items-center justify-between border-b bg-slate-50/50 px-4 py-3">
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

          <div className="flex flex-1 touch-pan-y flex-col gap-4 overflow-y-auto p-3">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              disabled={{ after: new Date() }}
              className="hidden sm:flex"
            />
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
              disabled={{ after: new Date() }}
              className="flex justify-center sm:hidden"
            />
          </div>

          {/* Footer */}
          <div className="flex flex-none items-center justify-between border-t bg-slate-50/50 p-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleClear}
            >
              Xóa lọc
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-indigo-600 text-white hover:bg-indigo-700"
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
