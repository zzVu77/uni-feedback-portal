"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { filtersConfig, FilterType } from "./filters.config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

type Props = {
  type: FilterType;
  items: { label: string; value: string }[];
};

const Filter = ({ type, items }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const config = filtersConfig[type];
  const Icon = config.icon;

  const currentValue = searchParams.get(config.param) || "all";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete(config.param);
    } else {
      params.set(config.param, value);
    }

    // Reset page to 1 when filter changes
    params.delete("page");

    router.replace(`?${params.toString()}`, { scroll: false });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-10 w-auto min-w-[100px] justify-between rounded-lg border bg-white px-3 py-2 font-semibold shadow-sm hover:bg-slate-50 md:min-w-[150px] lg:w-max"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Icon className="h-4 w-4 shrink-0 text-gray-500" />
            <span className="truncate">
              {currentValue
                ? items.find((item) => item.value === currentValue)?.label ||
                  config.placeholder
                : config.placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder={`Tìm ${config.placeholder.toLowerCase()}...`}
          />
          <CommandList>
            <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={() => handleChange(item.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentValue === item.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Filter;
