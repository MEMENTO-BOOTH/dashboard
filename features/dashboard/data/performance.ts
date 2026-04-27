import type { LucideIcon } from "lucide-react";

export type PerformanceRow = {
  id: string;
  name: string;
  value: string;
  percent: string;
  deltaPct: number; // raw delta % for conditional arrow/color
  logoUrl: string | null;
  brand: LucideIcon; // fallback icon if no logoUrl
};

export const PERFORMANCE_ROWS: PerformanceRow[] = [];
