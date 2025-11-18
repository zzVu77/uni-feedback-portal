import {
  ArrowDownNarrowWide,
  BellDot,
  Building,
  Hourglass,
  LayoutGrid,
} from "lucide-react";
import type { ElementType } from "react";

export interface FilterDefinition {
  param: string;
  placeholder: string;
  icon: ElementType;
}

export type FilterType =
  | "status"
  | "department"
  | "category"
  | "sort"
  | "notificationStatus";

export const filtersConfig: Record<FilterType, FilterDefinition> = {
  status: {
    param: "status",
    placeholder: "Trạng thái",
    icon: Hourglass,
  },
  department: {
    param: "departmentId",
    placeholder: "Phòng ban",
    icon: Building,
  },
  category: {
    param: "category",
    placeholder: "Danh mục",
    icon: LayoutGrid,
  },
  sort: {
    param: "sort",
    placeholder: "Sắp xếp",
    icon: ArrowDownNarrowWide,
  },
  notificationStatus: {
    param: "isRead",
    placeholder: "Trạng thái",
    icon: BellDot,
  },
};
