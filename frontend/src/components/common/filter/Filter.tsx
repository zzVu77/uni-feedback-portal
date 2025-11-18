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

  const currentValue = searchParams.get(config.param) || "all";

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
  // if (currentValue!== items.find(item=>item.value===currentValue)?.value) {
  //   c
  // }
  return (
    <Select onValueChange={handleChange} defaultValue={currentValue}>
      <SelectTrigger className="h-10 w-auto cursor-pointer rounded-lg border bg-white font-semibold shadow-sm focus-visible:border focus-visible:ring-0 md:min-w-[150px] lg:w-max">
        <Icon className="h-4 w-4 shrink-0 text-gray-500" />

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
