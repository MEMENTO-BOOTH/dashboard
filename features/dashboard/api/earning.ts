import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { EarningBar, EarningData } from "../data";

const DAY_MS = 24 * 60 * 60 * 1000;
const BAR_LABELS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"] as const;
const MAX_BAR_HEIGHT = 120;

function startOfMonday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0=Sun..6=Sat
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function formatEuroShort(amount: number): string {
  if (amount >= 1000) return `€${(amount / 1000).toFixed(1)}K`;
  return `€${Math.round(amount)}`;
}

export async function getEarningInsights(now: Date = new Date()): Promise<EarningData> {
  const supabase = createAdminClient();

  const thisWeekStart = startOfMonday(now);
  const lastWeekStart = new Date(thisWeekStart.getTime() - 7 * DAY_MS);

  const { data, error } = await supabase
    .from("transactions")
    .select("montant, paiement_at")
    .gte("paiement_at", lastWeekStart.toISOString());

  if (error) throw error;

  const dayTotals = new Array<number>(7).fill(0);
  let thisWeekTotal = 0;
  let lastWeekTotal = 0;

  for (const tx of data) {
    const paidAt = new Date(tx.paiement_at);
    const dayIndex = Math.floor((paidAt.getTime() - thisWeekStart.getTime()) / DAY_MS);
    const amount = Number(tx.montant);
    if (dayIndex >= 0 && dayIndex < 7) {
      dayTotals[dayIndex] = (dayTotals[dayIndex] ?? 0) + amount;
      thisWeekTotal += amount;
    } else if (dayIndex >= -7 && dayIndex < 0) {
      lastWeekTotal += amount;
    }
  }

  const maxDay = Math.max(...dayTotals, 1);
  const todayIndex = Math.floor((now.getTime() - thisWeekStart.getTime()) / DAY_MS);

  const bars: EarningBar[] = BAR_LABELS.map((label, i) => ({
    label,
    height: Math.round(((dayTotals[i] ?? 0) / maxDay) * MAX_BAR_HEIGHT),
    active: i === todayIndex,
  }));

  const variationPct =
    lastWeekTotal > 0
      ? Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100)
      : thisWeekTotal > 0
        ? 100
        : 0;
  const variation = `${variationPct >= 0 ? "+" : ""}${variationPct}%`;

  const description =
    lastWeekTotal === 0
      ? "CA de cette semaine. Aucune donnée la semaine précédente."
      : variationPct >= 0
        ? "CA de cette semaine vs. semaine dernière — ça progresse."
        : "CA de cette semaine vs. semaine dernière — en baisse.";

  return {
    value: formatEuroShort(thisWeekTotal),
    variation,
    description,
    bars,
  };
}
