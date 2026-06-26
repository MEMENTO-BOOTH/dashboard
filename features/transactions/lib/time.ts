import type { TxLite } from "@/lib/supabase/fetch-all";

export const DAY_MS = 24 * 60 * 60 * 1000;

const PARIS_YMD_FMT = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Paris",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function parisYMD(d: Date): { year: number; month: number; day: number } {
  let year = 0;
  let month = 0;
  let day = 0;
  for (const p of PARIS_YMD_FMT.formatToParts(d)) {
    if (p.type === "year") year = Number(p.value);
    else if (p.type === "month") month = Number(p.value);
    else if (p.type === "day") day = Number(p.value);
  }
  return { year, month, day };
}

const PARIS_HOUR_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  hour: "2-digit",
  minute: "2-digit",
  weekday: "short",
  hourCycle: "h23",
});

export function parisParts(d: Date): { hour: number; minute: number; weekday: string } {
  let hour = 0;
  let minute = 0;
  let weekday = "";
  for (const p of PARIS_HOUR_FORMATTER.formatToParts(d)) {
    if (p.type === "hour") hour = Number(p.value);
    else if (p.type === "minute") minute = Number(p.value);
    else if (p.type === "weekday") weekday = p.value.toLowerCase();
  }
  return { hour, minute, weekday };
}

export function dayKey(d: Date): string {
  const { year, month, day } = parisYMD(d);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function monthKey(d: Date): string {
  const { year, month } = parisYMD(d);
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function weekKey(d: Date): string {
  const { year, month, day } = parisYMD(d);
  const probe = new Date(Date.UTC(year, month - 1, day, 12));
  const weekday = probe.getUTCDay();
  const offset = weekday === 0 ? -6 : 1 - weekday;
  const monday = new Date(Date.UTC(year, month - 1, day + offset));
  return `${monday.getUTCFullYear()}-${String(monday.getUTCMonth() + 1).padStart(2, "0")}-${String(monday.getUTCDate()).padStart(2, "0")}`;
}

export function hourBucket(d: Date): number | null {
  const { hour, minute } = parisParts(d);
  const mins = hour * 60 + minute;
  let offset: number;
  if (mins >= 9 * 60) offset = mins - 9 * 60;
  else if (mins < 3 * 60) offset = mins + 15 * 60;
  else return null;
  return Math.min(11, Math.floor(offset / 90));
}

const WEEKEND_DAYS = new Set(["ven.", "sam.", "dim."]);

export function isWeekendParis(d: Date): boolean {
  return WEEKEND_DAYS.has(parisParts(d).weekday);
}

export function isLiveTx(t: TxLite): boolean {
  return !t.flag || t.flag !== "historical_nayax";
}
