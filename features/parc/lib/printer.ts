import type { PaymentRow } from "./activity";

export type AlerteGravite = "info" | "warning" | "critique";
export type AlerteStatut = "ouverte" | "assignee" | "resolue";

export type RawAlerte = {
  timestamp: string;
  type: string;
  message: string | null;
  gravite: AlerteGravite;
  statut: AlerteStatut;
};

export type PrinterEvent = {
  timestamp: string;
  papier_restant: number | null;
  photos_sorties: number;
  statut: string;
  erreur: boolean;
};

export type RawPrinterLog = {
  timestamp: string;
  feuilles_restantes: number | null;
  photos_sorties: number;
  imprimante_statut: string;
};

const STATUTS_NORMAUX = new Set([
  "En veille",
  "Mode veille prolongée",
  "Impression en cours",
  "Impression",
  "Refroidissement",
  "Refroidissement tête",
  "Refroidissement moteur",
]);

export function buildPrinterLog(rows: RawPrinterLog[]): PrinterEvent[] {
  return rows
    .map((r) => ({
      timestamp: r.timestamp,
      papier_restant: r.feuilles_restantes,
      photos_sorties: r.photos_sorties,
      statut: r.imprimante_statut,
      erreur: !STATUTS_NORMAUX.has(r.imprimante_statut),
    }))
    .sort((x, y) => y.timestamp.localeCompare(x.timestamp));
}

const ERREUR_LABELS: Record<string, string> = {
  bourrage_papier: "Bourrage papier",
  fin_papier: "Plus de papier",
  papier_bas: "Papier bas",
  fin_ruban: "Ruban épuisé",
  capot_ouvert: "Capot ouvert",
  bac_chutes_plein: "Bac à déchets plein",
  surchauffe: "Surchauffe",
  erreur_mecanique: "Erreur mécanique",
  imprimante_deconnectee: "Imprimante déconnectée",
  coupe_incoherente: "Coupe incohérente",
};

export function isErreurImprimante(type: string): boolean {
  return type in ERREUR_LABELS;
}

function eventsImpression(paiements: PaymentRow[]): PrinterEvent[] {
  return paiements
    .filter((p) => p.statut === "imprime" && p.feuilles_apres !== null)
    .map((p) => {
      const sorties =
        p.feuilles_avant !== null && p.feuilles_apres !== null
          ? Math.max(1, p.feuilles_avant - p.feuilles_apres)
          : 1;
      return {
        timestamp: p.paiement_at,
        papier_restant: p.feuilles_apres,
        photos_sorties: sorties,
        statut: "Impression",
        erreur: false,
      };
    });
}

function eventsErreur(alertes: RawAlerte[]): PrinterEvent[] {
  return alertes
    .filter((a) => isErreurImprimante(a.type))
    .map((a) => ({
      timestamp: a.timestamp,
      papier_restant: null,
      photos_sorties: 0,
      statut: ERREUR_LABELS[a.type] ?? a.type,
      erreur: true,
    }));
}

export function buildPrinterTimeline(
  paiements: PaymentRow[],
  alertes: RawAlerte[],
): PrinterEvent[] {
  return [...eventsImpression(paiements), ...eventsErreur(alertes)].sort((x, y) =>
    y.timestamp.localeCompare(x.timestamp),
  );
}

export function compterStatut(events: PrinterEvent[], statut: string): number {
  return events.filter((e) => e.statut === statut).length;
}

export function totalPhotos(events: PrinterEvent[]): number {
  return events.reduce((s, e) => s + e.photos_sorties, 0);
}
