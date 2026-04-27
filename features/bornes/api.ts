import "server-only";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Alerte, BorneDetail, BorneTableRow } from "./schemas";

const FEUILLES_MAX = 400;
const ACTIVE_STATUTS = ["ouverte", "assignee"] as const;

export async function getBornesWithLatestState(): Promise<BorneTableRow[]> {
  const supabase = createAdminClient();
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [bornesRes, heartbeatsRes, alertesRes, txRes, partenairesRes] = await Promise.all([
    supabase
      .from("bornes")
      .select("id, code, nom_lieu, logo_url, statut, partenaire_id")
      .order("nom_lieu"),
    supabase.from("heartbeats").select("borne_id, timestamp, feuilles_restantes"),
    supabase
      .from("alertes")
      .select("id, borne_id, type, message, gravite, statut, timestamp")
      .in("statut", ACTIVE_STATUTS)
      .order("timestamp", { ascending: false }),
    supabase
      .from("transactions")
      .select("borne_id, montant, paiement_at")
      .gte("paiement_at", dayAgo),
    supabase.from("partenaires").select("id, telephone, logo_url"),
  ]);

  if (bornesRes.error) throw bornesRes.error;
  if (heartbeatsRes.error) throw heartbeatsRes.error;
  if (alertesRes.error) throw alertesRes.error;
  if (txRes.error) throw txRes.error;
  if (partenairesRes.error) throw partenairesRes.error;

  const hbByBorne = new Map(heartbeatsRes.data.map((h) => [h.borne_id, h]));
  const alertByBorne = new Map<string, Alerte>();
  for (const a of alertesRes.data) {
    if (!alertByBorne.has(a.borne_id)) alertByBorne.set(a.borne_id, a);
  }
  const caByBorne = new Map<string, number>();
  for (const t of txRes.data) {
    caByBorne.set(t.borne_id, (caByBorne.get(t.borne_id) ?? 0) + Number(t.montant));
  }
  const partenaireById = new Map(partenairesRes.data.map((p) => [p.id, p]));

  return bornesRes.data.map<BorneTableRow>((b) => {
    const hb = hbByBorne.get(b.id);
    const alert = alertByBorne.get(b.id) ?? null;
    const partenaire = b.partenaire_id ? partenaireById.get(b.partenaire_id) : null;
    return {
      id: b.id,
      name: b.nom_lieu,
      subtitle: partenaire?.telephone ?? b.code,
      statut: b.statut,
      logoUrl: b.logo_url ?? partenaire?.logo_url ?? null,
      alert,
      lastActivityAt: hb?.timestamp ?? null,
      caToday: caByBorne.get(b.id) ?? 0,
      feuillesRestantes: hb?.feuilles_restantes ?? null,
      feuillesMax: FEUILLES_MAX,
    };
  });
}

export async function getBornePaperHistory(id: string) {
  const supabase = createAdminClient();
  const since = new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("paper_history")
    .select("feuilles_restantes, recorded_at")
    .eq("borne_id", id)
    .gte("recorded_at", since)
    .order("recorded_at", { ascending: true })
    .limit(730);

  if (error) throw error;
  return data ?? [];
}

export async function getBorneHoraires(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("horaires")
    .select("id, jour, ouverture, fermeture, ferme")
    .eq("borne_id", id)
    .order("jour");
  if (error) throw error;
  return data ?? [];
}

export async function getBorneUpdates(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("updates_bornes")
    .select(
      "id, statut, message_erreur, mise_a_jour_at, created_at, updates(version, notes, publiee_at)",
    )
    .eq("borne_id", id)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return data ?? [];
}

export async function getBorneHeartbeat(id: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("heartbeats")
    .select(
      "version_agent, version_dslrbooth, version_cash_interface, serial_imprimante, serial_appareil_photo, imprimante_statut, mode_coupe, ssid_wifi, disque_libre_go",
    )
    .eq("borne_id", id)
    .maybeSingle();

  return {
    versionAgent: data?.version_agent ?? null,
    versionDslrbooth: data?.version_dslrbooth ?? null,
    versionCashInterface: data?.version_cash_interface ?? null,
    serialImprimante: data?.serial_imprimante ?? null,
    serialAppareilPhoto: data?.serial_appareil_photo ?? null,
    imprimanteStatut: data?.imprimante_statut ?? null,
    modeCoupe: data?.mode_coupe ?? null,
    ssidWifi: data?.ssid_wifi ?? null,
    disqueLibreGo: data?.disque_libre_go ?? null,
  };
}

export async function getBorneDetail(id: string): Promise<BorneDetail> {
  const supabase = createAdminClient();

  const { data: borne, error } = await supabase
    .from("bornes")
    .select("*, partenaires(nom, telephone)")
    .eq("id", id)
    .single();

  if (error || !borne) notFound();

  return {
    id: borne.id,
    code: borne.code,
    nom_lieu: borne.nom_lieu,
    adresse: borne.adresse,
    ville: borne.ville,
    statut: borne.statut,
    date_installation: borne.date_installation,
    derniere_maintenance: borne.derniere_maintenance,
    logo_url: borne.logo_url,
    nayax_device_serial: borne.nayax_device_serial,
    setup_done: borne.setup_done,
    partenaire_nom: borne.partenaires?.nom ?? null,
    partenaire_telephone: borne.partenaires?.telephone ?? null,
  };
}

export async function getBorneById(id: string): Promise<BorneTableRow> {
  const supabase = createAdminClient();
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [borneRes, hbRes, alerteRes, txRes] = await Promise.all([
    supabase
      .from("bornes")
      .select("id, code, nom_lieu, logo_url, statut, partenaire_id")
      .eq("id", id)
      .single(),
    supabase
      .from("heartbeats")
      .select("borne_id, timestamp, feuilles_restantes")
      .eq("borne_id", id)
      .maybeSingle(),
    supabase
      .from("alertes")
      .select("id, borne_id, type, message, gravite, statut, timestamp")
      .eq("borne_id", id)
      .in("statut", ACTIVE_STATUTS)
      .order("timestamp", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("transactions").select("montant").eq("borne_id", id).gte("paiement_at", dayAgo),
  ]);

  if (borneRes.error || !borneRes.data) notFound();

  const b = borneRes.data;
  const ca = (txRes.data ?? []).reduce((sum, t) => sum + Number(t.montant), 0);

  return {
    id: b.id,
    name: b.nom_lieu,
    subtitle: b.code,
    statut: b.statut,
    logoUrl: b.logo_url,
    alert: alerteRes.data ?? null,
    lastActivityAt: hbRes.data?.timestamp ?? null,
    caToday: ca,
    feuillesRestantes: hbRes.data?.feuilles_restantes ?? null,
    feuillesMax: FEUILLES_MAX,
  };
}
