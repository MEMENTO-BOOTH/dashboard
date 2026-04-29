import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const PAGE_SIZE = 1000;

type Admin = SupabaseClient<Database>;

export type TxFilters = {
  sinceISO?: string;
  untilISO?: string;
  borneId?: string;
};

export type TxLite = {
  id?: string;
  borne_id: string | null;
  montant: number;
  paiement_at: string;
  impression_declenchee?: boolean | null;
  flag?: string | null;
};

type TxColumn = "id" | "borne_id" | "montant" | "paiement_at" | "impression_declenchee" | "flag";

function buildPageQuery(supabase: Admin, filters: TxFilters, select: string, from: number) {
  let q = supabase
    .from("transactions")
    .select(select)
    .order("paiement_at", { ascending: true })
    .range(from, from + PAGE_SIZE - 1);

  if (filters.sinceISO) q = q.gte("paiement_at", filters.sinceISO);
  if (filters.untilISO) q = q.lt("paiement_at", filters.untilISO);
  if (filters.borneId) q = q.eq("borne_id", filters.borneId);

  return q;
}

function normalizeRow(row: TxLite): TxLite {
  return {
    id: row.id,
    borne_id: row.borne_id ?? null,
    montant: Number(row.montant ?? 0),
    paiement_at: row.paiement_at,
    impression_declenchee: row.impression_declenchee ?? null,
    flag: row.flag ?? null,
  };
}

export async function fetchAllTransactions(
  supabase: Admin,
  filters: TxFilters = {},
  columns: readonly TxColumn[] = ["borne_id", "montant", "paiement_at"],
): Promise<TxLite[]> {
  const select = columns.join(", ");
  const all: TxLite[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await buildPageQuery(supabase, filters, select, from);
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) break;

    for (const row of data as unknown as TxLite[]) all.push(normalizeRow(row));
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return all;
}
