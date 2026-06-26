import type { TxLite } from "@/lib/supabase/fetch-all";
import { MONTH_FR_SHORT, trendValue, trimLeadingZeros } from "./format";
import { DAY_MS, dayKey, monthKey, parisYMD, weekKey } from "./time";
import type { PeriodStat } from "./types";

export function aggregateByDay(tx: TxLite[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const t of tx) {
    const k = dayKey(new Date(t.paiement_at));
    map.set(k, (map.get(k) ?? 0) + t.montant);
  }
  return map;
}

export function aggregateByMonth(tx: TxLite[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const t of tx) {
    const k = monthKey(new Date(t.paiement_at));
    map.set(k, (map.get(k) ?? 0) + t.montant);
  }
  return map;
}

export function aggregateByWeek(tx: TxLite[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const t of tx) {
    const k = weekKey(new Date(t.paiement_at));
    map.set(k, (map.get(k) ?? 0) + t.montant);
  }
  return map;
}

export function aggregateByYear(tx: TxLite[]): Map<number, number> {
  const map = new Map<number, number>();
  for (const t of tx) {
    const { year } = parisYMD(new Date(t.paiement_at));
    map.set(year, (map.get(year) ?? 0) + t.montant);
  }
  return map;
}

export function buildLast30Days(now: Date, dayMap: Map<string, number>) {
  const rows: { label: string; ca: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    rows.push({
      label: `${String(d.getDate()).padStart(2, "0")} ${MONTH_FR_SHORT[d.getMonth()] ?? ""}`,
      ca: dayMap.get(dayKey(d)) ?? 0,
    });
  }
  return rows;
}

export function buildLast8Months(now: Date, monthMap: Map<string, number>) {
  const rows: { label: string; ca: number }[] = [];
  for (let i = 8; i >= 1; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    rows.push({ label: MONTH_FR_SHORT[d.getMonth()] ?? "", ca: monthMap.get(monthKey(d)) ?? 0 });
  }
  return trimLeadingZeros(rows);
}

export function buildLast8Weeks(now: Date, weekMap: Map<string, number>) {
  const parts = weekKey(now).split("-").map(Number);
  const y = parts[0] ?? 1970;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  const rows: { label: string; ca: number }[] = [];
  for (let i = 8; i >= 1; i--) {
    const ws = new Date(Date.UTC(y, m - 1, d - 7 * i));
    const wsY = ws.getUTCFullYear();
    const wsM = ws.getUTCMonth() + 1;
    const wsD = ws.getUTCDate();
    rows.push({
      label: `${String(wsD).padStart(2, "0")} ${MONTH_FR_SHORT[wsM - 1] ?? ""}`,
      ca:
        weekMap.get(`${wsY}-${String(wsM).padStart(2, "0")}-${String(wsD).padStart(2, "0")}`) ?? 0,
    });
  }
  return trimLeadingZeros(rows);
}

export function buildYears(now: Date, yearMap: Map<number, number>) {
  const years = Array.from(yearMap.keys()).sort();
  if (years.length === 0) return [{ label: String(now.getFullYear()), ca: 0 }];
  return years.map((y) => ({ label: String(y), ca: yearMap.get(y) ?? 0 }));
}

export function rollingPeriod(tx: TxLite[], now: Date, days: number): PeriodStat {
  const from = now.getTime() - days * DAY_MS;
  const prevFrom = from - days * DAY_MS;
  let ca = 0;
  let count = 0;
  let prevCa = 0;
  for (const t of tx) {
    const ts = new Date(t.paiement_at).getTime();
    if (ts >= from) {
      ca += t.montant;
      count += 1;
    } else if (ts >= prevFrom) {
      prevCa += t.montant;
    }
  }
  return { ca, count, trend: trendValue(ca, prevCa) };
}
