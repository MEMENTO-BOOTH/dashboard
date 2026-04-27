// Types et constantes partagés entre server (intervention-api) et client (dialog, widget).
// Pas de "server-only" ici — ce fichier est importé par le barrel public.

export const PHYSICAL_ALERT_TYPES = new Set([
  "papier_bas",
  "fin_papier",
  "fin_ruban",
  "bourrage_papier",
  "bac_chutes_plein",
  "erreur_mecanique",
  "capot_ouvert",
  "imprimante_deconnectee",
  "camera_deconnectee",
]);

export type BorneIssue =
  | { kind: "alerte"; alerte_id: string; type: string }
  | { kind: "papier"; sheets: number };

export type InterventionCandidate = {
  borne_id: string;
  nom_lieu: string;
  logo_url: string | null;
  issues: BorneIssue[];
};

export type Assignee = {
  id: string;
  nom: string;
  logo_url: string | null;
  role: string;
};

export type BorneSummary = {
  id: string;
  nom_lieu: string;
  logo_url: string | null;
};

export type MaterielType = "camera" | "imprimante" | "tpe" | "ecran" | "cable" | "autre";

export const MATERIEL_LABELS: Record<MaterielType, string> = {
  camera: "Appareil photo",
  imprimante: "Imprimante",
  tpe: "TPE",
  ecran: "Écran",
  cable: "Câblage",
  autre: "Autre",
};

export type InterventionMode = "alerte" | "maintenance";
