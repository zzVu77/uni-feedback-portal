"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building, Hourglass } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  typeOfFilter: "status" | "department";
  items: { label: string; value: string }[];
  filterName?: string;
};

const Filter = ({ typeOfFilter, items, filterName }: Props) => {
  const router = useRouter();
  const filterParams = useSearchParams();
  const currentValue = filterParams.get(typeOfFilter) || "";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(filterParams.toString());
    if (value) {
      params.set(typeOfFilter, value);
    } else {
      params.delete(typeOfFilter);
    }
    if (typeOfFilter === "status") {
      params.delete("page");
    }
    router.replace(`?${params.toString()}`);
  };

  return (
    <Select onValueChange={handleChange} defaultValue={currentValue}>
      <SelectTrigger className="md:mim-w-[150px] h-10 w-max min-w-[100px] cursor-pointer rounded-lg border-[1px] font-semibold shadow-sm focus-visible:border-[1px] focus-visible:ring-0">
        {typeOfFilter === "status" ? (
          <Hourglass />
        ) : (
          <Building className="pointer-events-none h-4 w-4 text-gray-500" />
        )}
        <SelectValue
          placeholder={
            filterName ??
            typeOfFilter.charAt(0).toUpperCase() + typeOfFilter.slice(1)
          }
        />
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
