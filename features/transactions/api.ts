import "server-only";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchAllTransactions, type TxLite } from "@/lib/supabase/fetch-all";
import { buildBorneDetail } from "./lib/borne-detail";
import { buildGlobalStats } from "./lib/global-stats";
import { DAY_MS } from "./lib/time";
import type { BorneCard, BorneRanking, BorneTransactionsDetail, GlobalStats } from "./lib/types";

export type {
  AvgCaBucket,
  BorneCard,
  BorneRanking,
  BorneTransactionsDetail,
  GlobalStats,
  PeriodStat,
} from "./lib/types";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getBornesForTransactions(): Promise<BorneCard[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bornes")
    .select("id, nom_lieu, logo_url")
    .order("nom_lieu");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getBorneCARanking(days = 30): Promise<BorneRanking> {
  const supabase = createAdminClient();
  const since = new Date(Date.now() - days * DAY_MS).toISOString();

  const [bornesRes, tx] = await Promise.all([
    supabase.from("bornes").select("id, nom_lieu"),
    fetchAllTransactions(supabase, { sinceISO: since, montantPositif: true }, [
      "borne_id",
      "montant",
    ]),
  ]);

  if (bornesRes.error) throw new Error(bornesRes.error.message);

  const totals = new Map<string, number>();
  for (const t of tx) {
    if (!t.borne_id) continue;
    totals.set(t.borne_id, (totals.get(t.borne_id) ?? 0) + t.montant);
  }

  const rows = (bornesRes.data ?? []).map((b) => ({
    label: b.nom_lieu,
    value: totals.get(b.id) ?? 0,
  }));
  const sortedDesc = [...rows].sort((a, b) => b.value - a.value);

  return {
    top: sortedDesc.slice(0, 5),
    bottom: sortedDesc.slice(-5).reverse(),
    allDesc: sortedDesc,
  };
}

export async function getGlobalTransactionStats(now: Date = new Date()): Promise<GlobalStats> {
  const supabase = createAdminClient();
  const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const since = new Date(firstOfThisMonth.getFullYear(), firstOfThisMonth.getMonth() - 9, 1);

  const tx = await fetchAllTransactions(
    supabase,
    { sinceISO: since.toISOString(), montantPositif: true },
    ["montant", "paiement_at", "flag"],
  );

  return buildGlobalStats(tx, now);
}

export async function getBorneTransactionsDetail(
  id: string,
  now: Date = new Date(),
): Promise<BorneTransactionsDetail> {
  if (!UUID_RE.test(id)) notFound();

  const supabase = createAdminClient();
  const borneRes = await supabase
    .from("bornes")
    .select("id, nom_lieu, logo_url, date_installation")
    .eq("id", id)
    .maybeSingle();
  if (borneRes.error) throw new Error(borneRes.error.message);
  if (!borneRes.data) notFound();

  const tx = (await fetchAllTransactions(supabase, { borneId: id }, [
    "id",
    "paiement_at",
    "montant",
    "impression_declenchee",
  ])) as Required<TxLite>[];

  return buildBorneDetail(borneRes.data, tx, now);
}
