import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchAllTransactions } from "@/lib/supabase/fetch-all";
import {
  addDays,
  formatEUR,
  formatPct,
  formatPeriodRange,
  startOfMonday,
} from "@/lib/utils/format";
import type { PerformanceRow } from "../data";

const ROWS_LIMIT = 2;

export type PerformanceData = {
  worst: PerformanceRow[];
  best: PerformanceRow[];
  refRange: string;
  prevRange: string;
};

export async function getPerformanceRows(now: Date = new Date()): Promise<PerformanceData> {
  const supabase = createAdminClient();

  const currentMonday = startOfMonday(now);
  const refStart = addDays(currentMonday, -7);
  const refEnd = currentMonday;
  const prevStart = addDays(refStart, -7);

  const [bornesRes, tx] = await Promise.all([
    supabase.from("bornes").select("id, nom_lieu, logo_url"),
    fetchAllTransactions(
      supabase,
      {
        sinceISO: prevStart.toISOString(),
        untilISO: refEnd.toISOString(),
        montantPositif: true,
      },
      ["borne_id", "montant", "paiement_at"],
    ),
  ]);

  if (bornesRes.error) throw bornesRes.error;

  const refByBorne = new Map<string, number>();
  const prevByBorne = new Map<string, number>();

  for (const t of tx) {
    if (!t.borne_id) continue;
    const ts = new Date(t.paiement_at).getTime();
    if (ts >= refStart.getTime()) {
      refByBorne.set(t.borne_id, (refByBorne.get(t.borne_id) ?? 0) + t.montant);
    } else {
      prevByBorne.set(t.borne_id, (prevByBorne.get(t.borne_id) ?? 0) + t.montant);
    }
  }

  const scored = (bornesRes.data ?? []).map((b) => {
    const ref = refByBorne.get(b.id) ?? 0;
    const prev = prevByBorne.get(b.id) ?? 0;
    const delta = prev > 0 ? ((ref - prev) / prev) * 100 : ref > 0 ? 100 : 0;
    return { id: b.id, name: b.nom_lieu, logoUrl: b.logo_url, ref, delta };
  });

  const ascending = [...scored].sort((a, b) => a.delta - b.delta);
  const descending = [...scored].sort((a, b) => b.delta - a.delta);

  const toRow = (r: (typeof scored)[number]): PerformanceRow => ({
    id: r.id,
    name: r.name,
    logoUrl: r.logoUrl,
    value: formatEUR(r.ref),
    percent: formatPct(r.delta),
    deltaPct: r.delta,
  });

  return {
    worst: ascending.slice(0, ROWS_LIMIT).map(toRow),
    best: descending.slice(0, ROWS_LIMIT).map(toRow),
    refRange: formatPeriodRange(refStart, refEnd),
    prevRange: formatPeriodRange(prevStart, refStart),
  };
}
