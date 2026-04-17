import "server-only";
import { Store } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PerformanceRow } from "../data";

const DAY_MS = 24 * 60 * 60 * 1000;
const ROWS_LIMIT = 2;

function formatEuro(amount: number): string {
  return `€${Math.round(amount)}`;
}

function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "-";
  const abs = Math.abs(value).toFixed(2).replace(".", ",");
  return `${sign}${abs}%`;
}

export async function getPerformanceRows(now: Date = new Date()): Promise<PerformanceRow[]> {
  const supabase = createAdminClient();

  const thisWeekStart = new Date(now.getTime() - 7 * DAY_MS);
  const lastWeekStart = new Date(now.getTime() - 14 * DAY_MS);

  const [bornesRes, txRes] = await Promise.all([
    supabase.from("bornes").select("id, nom_lieu"),
    supabase
      .from("transactions")
      .select("borne_id, montant, paiement_at")
      .gte("paiement_at", lastWeekStart.toISOString()),
  ]);

  if (bornesRes.error) throw bornesRes.error;
  if (txRes.error) throw txRes.error;

  const thisWeekByBorne = new Map<string, number>();
  const lastWeekByBorne = new Map<string, number>();

  for (const tx of txRes.data) {
    const paidAt = new Date(tx.paiement_at).getTime();
    const amount = Number(tx.montant);
    const bucket = paidAt >= thisWeekStart.getTime() ? thisWeekByBorne : lastWeekByBorne;
    bucket.set(tx.borne_id, (bucket.get(tx.borne_id) ?? 0) + amount);
  }

  const scored = bornesRes.data.map((b) => {
    const thisWk = thisWeekByBorne.get(b.id) ?? 0;
    const lastWk = lastWeekByBorne.get(b.id) ?? 0;
    const delta = lastWk > 0 ? ((thisWk - lastWk) / lastWk) * 100 : thisWk > 0 ? 100 : 0;
    return { name: b.nom_lieu, thisWk, delta };
  });

  scored.sort((a, b) => a.delta - b.delta);

  return scored.slice(0, ROWS_LIMIT).map((r) => ({
    name: r.name,
    value: formatEuro(r.thisWk),
    percent: formatPercent(r.delta),
    brand: Store,
  }));
}
