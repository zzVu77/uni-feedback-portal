"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { filtersConfig, FilterType } from "./filters.config";

type Props = {
  type: FilterType;
  items: { label: string; value: string }[];
};

const Filter = ({ type, items }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const config = filtersConfig[type];
  const Icon = config.icon;

  const currentValue = searchParams.get(config.param) || "";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(config.param, value);
    } else {
      params.delete(config.param);
    }

    // params.delete("page");

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Select onValueChange={handleChange} defaultValue={currentValue}>
      <SelectTrigger className="md:mim-w-[150px] h-10 w-max min-w-[100px] cursor-pointer rounded-lg border-[1px] bg-white font-semibold shadow-sm focus-visible:border-[1px] focus-visible:ring-0">
        <Icon className="h-4 w-4 flex-shrink-0 text-gray-500" />

        <SelectValue placeholder={config.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Filter;
