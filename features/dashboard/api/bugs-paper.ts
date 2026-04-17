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
const ACTIVE_STATUTS = ["ouverte", "assignee"] as const;

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
        .order("feuilles_restantes", { ascending: true })
        .limit(FULL_LIST_LIMIT),
      supabase
        .from("heartbeats")
        .select("borne_id", { count: "exact", head: true })
        .not("feuilles_restantes", "is", null),
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

  const allPaperBornes: PaperBorne[] = heartbeatsRes.data.flatMap((h) => {
    const borne = borneById.get(h.borne_id);
    if (!borne || h.feuilles_restantes === null) return [];
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
