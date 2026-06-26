import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchAllTransactions } from "@/lib/supabase/fetch-all";
import { addDays } from "@/lib/utils/format";
import type { EarningBar, EarningData } from "../data";
import { dayDiff, startOfMonday } from "../lib/paris-week";

const DAY_LABELS = [
  { short: "Lu", full: "Lundi" },
  { short: "Ma", full: "Mardi" },
  { short: "Me", full: "Mercredi" },
  { short: "Je", full: "Jeudi" },
  { short: "Ve", full: "Vendredi" },
  { short: "Sa", full: "Samedi" },
  { short: "Di", full: "Dimanche" },
] as const;

export async function getEarningInsights(now: Date = new Date()): Promise<EarningData> {
  const supabase = createAdminClient();

  const thisWeekStart = startOfMonday(now);
  const lastWeekStart = addDays(thisWeekStart, -7);

  const tx = await fetchAllTransactions(
    supabase,
    { sinceISO: lastWeekStart.toISOString(), montantPositif: true },
    ["montant", "paiement_at"],
  );

  const elapsedMs = now.getTime() - thisWeekStart.getTime();
  const lastWeekSamePointMs = lastWeekStart.getTime() + elapsedMs;

  const thisWeekByDay = new Array<number>(7).fill(0);
  const lastWeekByDay = new Array<number>(7).fill(0);
  let totalThisWeek = 0;
  let totalLastWeekElapsed = 0;

  for (const t of tx) {
    const paidAt = new Date(t.paiement_at);
    const ts = paidAt.getTime();
    const dayIndex = dayDiff(paidAt, thisWeekStart);
    if (dayIndex >= 0 && dayIndex < 7) {
      thisWeekByDay[dayIndex] = (thisWeekByDay[dayIndex] ?? 0) + t.montant;
      totalThisWeek += t.montant;
    } else if (dayIndex >= -7 && dayIndex < 0) {
      lastWeekByDay[dayIndex + 7] = (lastWeekByDay[dayIndex + 7] ?? 0) + t.montant;
      if (ts < lastWeekSamePointMs) totalLastWeekElapsed += t.montant;
    }
  }

  const todayIndex = Math.max(0, Math.min(6, dayDiff(now, thisWeekStart)));

  const bars: EarningBar[] = DAY_LABELS.map((lbl, i) => {
    const amount = thisWeekByDay[i] ?? 0;
    const amountLastWeek = lastWeekByDay[i] ?? 0;
    const changePct =
      amountLastWeek > 0
        ? Math.round(((amount - amountLastWeek) / amountLastWeek) * 100)
        : amount > 0
          ? 100
          : 0;
    return {
      label: lbl.short,
      fullLabel: lbl.full,
      amount,
      amountLastWeek,
      changePct,
      active: i === todayIndex,
      future: i > todayIndex,
    };
  });

  const variationPct =
    totalLastWeekElapsed > 0
      ? Math.round(((totalThisWeek - totalLastWeekElapsed) / totalLastWeekElapsed) * 100)
      : totalThisWeek > 0
        ? 100
        : 0;

  return {
    totalThisWeek,
    totalLastWeek: totalLastWeekElapsed,
    variationPct,
    bars,
  };
}
