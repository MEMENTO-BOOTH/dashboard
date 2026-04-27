export type PerformanceRow = {
  id: string;
  name: string;
  value: string;
  percent: string;
  deltaPct: number;
  logoUrl: string | null;
};

export const PERFORMANCE_ROWS: PerformanceRow[] = [];
