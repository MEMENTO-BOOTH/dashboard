export const MONTH_FR_LONG = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export const MONTH_FR_SHORT = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Jun",
  "Jul",
  "Aoû",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

export function formatDayMonth(d: Date): string {
  return `${d.getDate()} ${(MONTH_FR_SHORT[d.getMonth()] ?? "").toLowerCase()}.`;
}

export function formatMonthYear(d: Date): string {
  return `${MONTH_FR_LONG[d.getMonth()] ?? ""} ${d.getFullYear()}`;
}

export function trendValue(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return ((current - previous) / previous) * 100;
}

export function trimLeadingZeros<T extends { ca: number }>(rows: T[]): T[] {
  const firstNonZero = rows.findIndex((r) => r.ca > 0);
  if (firstNonZero <= 0) return rows;
  return rows.slice(firstNonZero);
}
