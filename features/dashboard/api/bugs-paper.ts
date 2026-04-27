import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Bug, PaperBorne } from "../data";
import { formatBugTime } from "../lib/format";

type Result = {
  bugs: Bug[];
  totalBugs: number;
  allBugs: Bug[];
  paperBornes: PaperBorne[];
  totalPaperBornes: number;
  allPaperBornes: PaperBorne[];
};

const PREVIEW_LIMIT = 3;
const FULL_LIST_LIMIT = 200;
const PAPER_MAX_SHEETS = 80; // bornes affichées uniquement si ≤ 80 feuilles restantes
const ACTIVE_STATUTS = ["ouverte", "assignee"] as const;

// Alertes physiques qui rendent la lecture du niveau papier non fiable.
// Si une borne a ce type d'alerte active, on l'exclut du widget "Papier à changer"
// (sinon on affiche "0 feuilles" alors que c'est juste le capot ouvert).
const BLOCKS_PAPER_READING = new Set([
  "capot_ouvert",
  "imprimante_deconnectee",
  "fin_ruban",
  "bourrage_papier",
  "erreur_mecanique",
]);

export async function getBugsAndPaperBornes(): Promise<Result> {
  const supabase = createAdminClient();

  const [alertesRes, alertesCountRes, heartbeatsRes, heartbeatsCountRes, bornesRes] =
    await Promise.all([
      supabase
        .from("alertes")
        .select("id, borne_id, type, timestamp")
        .in("statut", ACTIVE_STATUTS)
        .eq("gravite", "critique")
        .order("timestamp", { ascending: false })
        .limit(FULL_LIST_LIMIT),
      supabase
        .from("alertes")
        .select("id", { count: "exact", head: true })
        .in("statut", ACTIVE_STATUTS)
        .eq("gravite", "critique"),
      supabase
        .from("heartbeats")
        .select("borne_id, feuilles_restantes")
        .not("feuilles_restantes", "is", null)
        .lte("feuilles_restantes", PAPER_MAX_SHEETS)
        .order("feuilles_restantes", { ascending: true })
        .limit(FULL_LIST_LIMIT),
      supabase
        .from("heartbeats")
        .select("borne_id", { count: "exact", head: true })
        .not("feuilles_restantes", "is", null)
        .lte("feuilles_restantes", PAPER_MAX_SHEETS),
      supabase.from("bornes").select("id, nom_lieu, logo_url"),
    ]);

  if (alertesRes.error) throw alertesRes.error;
  if (alertesCountRes.error) throw alertesCountRes.error;
  if (heartbeatsRes.error) throw heartbeatsRes.error;
  if (heartbeatsCountRes.error) throw heartbeatsCountRes.error;
  if (bornesRes.error) throw bornesRes.error;

  const borneById = new Map(bornesRes.data.map((b) => [b.id, b]));

  const allBugs: Bug[] = alertesRes.data.map((a) => {
    const borne = borneById.get(a.borne_id);
    return {
      id: a.id,
      title: a.type,
      place: borne?.nom_lieu ?? "—",
      time: formatBugTime(a.timestamp),
      avatar: borne?.logo_url ?? null,
    };
  });

  // Bornes avec alertes physiques empêchant la lecture fiable du papier → à exclure
  const bornesBlocked = new Set<string>();
  for (const a of alertesRes.data) {
    if (BLOCKS_PAPER_READING.has(a.type)) bornesBlocked.add(a.borne_id);
  }

  const allPaperBornes: PaperBorne[] = heartbeatsRes.data.flatMap((h) => {
    const borne = borneById.get(h.borne_id);
    if (!borne || h.feuilles_restantes === null) return [];
    if (bornesBlocked.has(borne.id)) return [];
    return [
      { id: borne.id, name: borne.nom_lieu, avatar: borne.logo_url, sheets: h.feuilles_restantes },
    ];
  });

  return {
    bugs: allBugs.slice(0, PREVIEW_LIMIT),
    totalBugs: alertesCountRes.count ?? allBugs.length,
    allBugs,
    paperBornes: allPaperBornes.slice(0, PREVIEW_LIMIT),
    totalPaperBornes: heartbeatsCountRes.count ?? allPaperBornes.length,
    allPaperBornes,
  };
}
