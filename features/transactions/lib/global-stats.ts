import type { TxLite } from "@/lib/supabase/fetch-all";
import { addDays, startOfMonday } from "@/lib/utils/format";
import {
  formatDayMonth,
  formatMonthYear,
  MONTH_FR_SHORT,
  trendValue,
  trimLeadingZeros,
} from "./format";
import { DAY_MS, hourBucket, isLiveTx, isWeekendParis, monthKey, parisParts } from "./time";
import type { GlobalStats, SalesBreakdown } from "./types";

function buildMonthlyBars(tx: TxLite[], now: Date) {
  const map = new Map<string, number>();
  for (const t of tx) {
    const k = monthKey(new Date(t.paiement_at));
    map.set(k, (map.get(k) ?? 0) + t.montant);
  }
  const bars: { month: string; ca: number }[] = [];
  for (let i = 8; i >= 1; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    bars.push({ month: MONTH_FR_SHORT[d.getMonth()] ?? "", ca: map.get(monthKey(d)) ?? 0 });
  }
  return trimLeadingZeros(bars);
}

function computeWeekTrend(tx: TxLite[], now: Date): number | null {
  const monday = startOfMonday(now);
  const refStart = addDays(monday, -7).getTime();
  const prevStart = addDays(monday, -14).getTime();
  let ref = 0;
  let prev = 0;
  for (const t of tx) {
    const ts = new Date(t.paiement_at).getTime();
    if (ts >= refStart && ts < monday.getTime()) ref += t.montant;
    else if (ts >= prevStart && ts < refStart) prev += t.montant;
  }
  return trendValue(ref, prev);
}

function peakHourOf(hourSums: number[]): number | null {
  let maxCa = 0;
  let peakHour: number | null = null;
  for (let h = 0; h < 24; h++) {
    const v = hourSums[h] ?? 0;
    if (v > maxCa) {
      maxCa = v;
      peakHour = h;
    }
  }
  return peakHour;
}

function computeSalesBreakdown(tx: TxLite[], now: Date): SalesBreakdown {
  const thirtyDaysAgo = now.getTime() - 30 * DAY_MS;
  const out: SalesBreakdown = {
    totalSales30d: 0,
    weekendCa: 0,
    weekdayCa: 0,
    hourlyBars: new Array(12).fill(0),
    peakHour: null,
  };
  const hourSumsAllLive = new Array(24).fill(0);
  for (const t of tx) {
    const d = new Date(t.paiement_at);
    const live = isLiveTx(t);
    if (live) {
      const { hour } = parisParts(d);
      hourSumsAllLive[hour] = (hourSumsAllLive[hour] ?? 0) + t.montant;
    }
    if (d.getTime() < thirtyDaysAgo) continue;
    out.totalSales30d += t.montant;
    if (isWeekendParis(d)) out.weekendCa += t.montant;
    else out.weekdayCa += t.montant;
    if (live) {
      const b = hourBucket(d);
      if (b !== null) out.hourlyBars[b] = (out.hourlyBars[b] ?? 0) + t.montant;
    }
  }
  out.peakHour = peakHourOf(hourSumsAllLive);
  return out;
}

export function buildGlobalStats(tx: TxLite[], now: Date): GlobalStats {
  const monthlyBars = buildMonthlyBars(tx, now);
  const caLastMonth = monthlyBars.at(-1)?.ca ?? 0;
  const trendLastMonth = trendValue(caLastMonth, monthlyBars.at(-2)?.ca ?? 0);
  const trendWeek = computeWeekTrend(tx, now);
  const sales = computeSalesBreakdown(tx, now);

  const monday = startOfMonday(now);
  const refStart = addDays(monday, -7);
  const refEndIncl = addDays(monday, -1);
  const prevStart = addDays(monday, -14);
  const prevEndIncl = addDays(monday, -8);
  const monthRef = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const monthPrev = new Date(now.getFullYear(), now.getMonth() - 2, 1);

  return {
    caLastMonth,
    trendLastMonth,
    profitLineData: monthlyBars.map((m) => m.ca),
    monthlyBars,
    trendWeek,
    trendMonth: trendLastMonth,
    lastMonthCa: caLastMonth,
    weekRefLabel: `${formatDayMonth(refStart)} → ${formatDayMonth(refEndIncl)}`,
    weekPrevLabel: `${formatDayMonth(prevStart)} → ${formatDayMonth(prevEndIncl)}`,
    monthRefLabel: formatMonthYear(monthRef),
    monthPrevLabel: formatMonthYear(monthPrev),
    ...sales,
  };
}
