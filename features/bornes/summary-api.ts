import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

const FEUILLES_MAX = 400;

export type BorneSummary = {
  id: string;
  nom_lieu: string;
  logo_url: string | null;
  statut: string;
  lastActivityAt: string | null;
  isOffline: boolean; // pas de heartbeat depuis > 24 h
  feuillesRestantes: number | null;
  feuillesMax: number;
  caWeek: number;
  dailyCa7d: { label: string; ca: number }[];
};

const DAY_FR_SHORT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export async function getBorneSummary(id: string): Promise<BorneSummary | null> {
  const supabase = createAdminClient();

  const since7Ms = Date.now() - 6 * 86_400_000;

  const [borneRes, heartbeatRes, txRes] = await Promise.all([
    supabase.from("bornes").select("id, nom_lieu, logo_url, statut").eq("id", id).maybeSingle(),
    supabase
      .from("heartbeats")
      .select("feuilles_restantes, timestamp")
      .eq("borne_id", id)
      .order("timestamp", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("transactions")
      .select("montant, paiement_at")
      .eq("borne_id", id)
      .gte("paiement_at", new Date(since7Ms).toISOString()),
  ]);

  if (borneRes.error || !borneRes.data) return null;

  const tx = txRes.data ?? [];
  const dayMap = new Map<string, number>();

  for (const t of tx) {
    const amount = Number(t.montant ?? 0);
    const d = new Date(t.paiement_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    dayMap.set(key, (dayMap.get(key) ?? 0) + amount);
  }

  const dailyCa7d: { label: string; ca: number }[] = [];
  let caWeek = 0;
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const ca = dayMap.get(key) ?? 0;
    caWeek += ca;
    dailyCa7d.push({ label: DAY_FR_SHORT[d.getDay()] ?? "", ca });
  }

  const lastActivityAt = heartbeatRes.data?.timestamp ?? null;
  const isOffline =
    lastActivityAt === null ||
    Date.now() - new Date(lastActivityAt).getTime() > 24 * 60 * 60 * 1000;

  return {
    id: borneRes.data.id,
    nom_lieu: borneRes.data.nom_lieu,
    logo_url: borneRes.data.logo_url,
    statut: borneRes.data.statut,
    lastActivityAt,
    isOffline,
    feuillesRestantes: heartbeatRes.data?.feuilles_restantes ?? null,
    feuillesMax: FEUILLES_MAX,
    caWeek,
    dailyCa7d,
  };
}
