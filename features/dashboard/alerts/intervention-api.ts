import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Assignee, BorneSummary, InterventionCandidate } from "./intervention-types";
import { PHYSICAL_ALERT_TYPES } from "./intervention-types";

export async function getAllBornesSummary(): Promise<BorneSummary[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bornes")
    .select("id, nom_lieu, logo_url")
    .order("nom_lieu");
  if (error) throw error;
  return data ?? [];
}

const PAPER_MAX_SHEETS = 50; // bornes proposées uniquement si ≤ 50 feuilles

// Alertes qui rendent la lecture du niveau papier non fiable.
// Si la borne a une de ces alertes actives, on n'ajoute pas l'issue "papier"
// (sinon on affiche "Papier 0/400" alors que c'est juste le capot ouvert).
const BLOCKS_PAPER_READING = new Set([
  "capot_ouvert",
  "imprimante_deconnectee",
  "fin_ruban",
  "bourrage_papier",
  "erreur_mecanique",
]);

export async function getInterventionCandidates(): Promise<InterventionCandidate[]> {
  const supabase = createAdminClient();

  const [bornesRes, alertesRes, heartbeatsRes] = await Promise.all([
    supabase.from("bornes").select("id, nom_lieu, logo_url"),
    supabase
      .from("alertes")
      .select("id, borne_id, type")
      .in("statut", ["ouverte", "assignee"])
      .eq("gravite", "critique"),
    supabase
      .from("heartbeats")
      .select("borne_id, feuilles_restantes, timestamp")
      .not("feuilles_restantes", "is", null)
      .order("timestamp", { ascending: false }),
  ]);

  if (bornesRes.error) throw bornesRes.error;
  if (alertesRes.error) throw alertesRes.error;
  if (heartbeatsRes.error) throw heartbeatsRes.error;

  const byBorne = new Map<string, InterventionCandidate>();
  for (const b of bornesRes.data ?? []) {
    byBorne.set(b.id, {
      borne_id: b.id,
      nom_lieu: b.nom_lieu,
      logo_url: b.logo_url,
      issues: [],
    });
  }

  const bornesBlocked = new Set<string>();
  for (const a of alertesRes.data ?? []) {
    if (!PHYSICAL_ALERT_TYPES.has(a.type)) continue;
    const c = byBorne.get(a.borne_id);
    if (c) c.issues.push({ kind: "alerte", alerte_id: a.id, type: a.type });
    if (BLOCKS_PAPER_READING.has(a.type)) bornesBlocked.add(a.borne_id);
  }

  // Dernier heartbeat par borne (ordered desc → first wins)
  const latestByBorne = new Map<string, number>();
  for (const h of heartbeatsRes.data ?? []) {
    if (latestByBorne.has(h.borne_id)) continue;
    if (h.feuilles_restantes === null) continue;
    latestByBorne.set(h.borne_id, h.feuilles_restantes);
  }
  for (const [borneId, sheets] of latestByBorne) {
    if (bornesBlocked.has(borneId)) continue;
    if (sheets > PAPER_MAX_SHEETS) continue;
    const c = byBorne.get(borneId);
    if (c) c.issues.push({ kind: "papier", sheets });
  }

  return [...byBorne.values()]
    .filter((c) => c.issues.length > 0)
    .sort((a, b) => a.nom_lieu.localeCompare(b.nom_lieu));
}

export async function getAssignees(): Promise<Assignee[]> {
  const supabase = createAdminClient();
  const { data: users, error } = await supabase
    .from("utilisateurs")
    // biome-ignore lint/suspicious/noExplicitAny: role_id + is_admin via migration, types.ts à regénérer
    .select("id, nom, logo_url, actif, is_admin, role_id" as any)
    .eq("actif", true)
    .order("nom");

  if (error) throw error;

  // biome-ignore lint/suspicious/noExplicitAny: cast tant que types.ts n'inclut pas is_admin/role_id
  const rows = (users ?? []) as any[];
  const roleIds = [...new Set(rows.map((u) => u.role_id).filter(Boolean))];

  const slugById = new Map<string, string>();
  if (roleIds.length > 0) {
    const { data: roles } = await supabase
      // biome-ignore lint/suspicious/noExplicitAny: table roles via migration, types.ts à regénérer
      .from("roles" as any)
      .select("id, slug")
      .in("id", roleIds);
    // biome-ignore lint/suspicious/noExplicitAny: cast tant que types.ts n'inclut pas roles
    for (const r of ((roles ?? []) as any[])) slugById.set(r.id, r.slug);
  }

  return rows.map((u) => ({
    id: u.id,
    nom: u.nom,
    logo_url: u.logo_url,
    role: u.is_admin ? "admin" : u.role_id ? (slugById.get(u.role_id) ?? "") : "",
  }));
}
