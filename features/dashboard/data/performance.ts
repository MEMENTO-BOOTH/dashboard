import { IceCream, LayoutGrid, type LucideIcon } from "lucide-react";

export type PerformanceRow = {
  name: string;
  value: string;
  percent: string;
  brand: LucideIcon;
};

export const PERFORMANCE_ROWS: PerformanceRow[] = [
  { name: "Bistrot Minot", value: "$120", percent: "56,32%", brand: IceCream },
  { name: "L'imaginaire", value: "$125", percent: "33,90%", brand: LayoutGrid },
];
