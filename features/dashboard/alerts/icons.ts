import {
  AlertTriangle,
  Ban,
  CameraOff,
  CloudOff,
  FileMinus,
  FileX,
  HardDrive,
  LogOut,
  type LucideIcon,
  Monitor,
  PowerOff,
  Printer,
  RefreshCcw,
  Scissors,
  Thermometer,
  Trash2,
  Unplug,
  WifiOff,
} from "lucide-react";

// ──────────────────────────────────────────────────────────────────────
// Mapping complet des alertes Memento (source: Memento-agent/alertes/data.py)
// Chaque type a son icône Lucide propre (plus de SVG dupliqués).
// ──────────────────────────────────────────────────────────────────────

const TYPE_LUCIDE: Record<string, LucideIcon> = {
  bourrage_papier: Printer,
  fin_papier: Ban,
  fin_ruban: Ban,
  capot_ouvert: LogOut,
  bac_chutes_plein: Trash2,
  erreur_mecanique: AlertTriangle,
  crash_dslrbooth: Monitor,
  crash_cashinterface: Monitor,
  imprimante_deconnectee: Unplug,
  coupe_incoherente: Scissors,
  disque_plein: HardDrive,
  disque_bas: HardDrive,
  camera_deconnectee: CameraOff,
  borne_hors_ligne: WifiOff,
  borne_eteinte_3_jours: PowerOff,
  drive_deconnecte: CloudOff,
  surchauffe: Thermometer,
  papier_bas: FileMinus,
  crash_relance: RefreshCcw,
  impression_non_delivree: FileX,
};

export const TYPE_LABELS: Record<string, string> = {
  bourrage_papier: "Bourrage papier",
  fin_papier: "Fin de papier",
  fin_ruban: "Fin de ruban",
  capot_ouvert: "Capot ouvert",
  bac_chutes_plein: "Bac à déchets plein",
  erreur_mecanique: "Erreur mécanique",
  surchauffe: "Surchauffe",
  papier_bas: "Papier bas",
  disque_plein: "Disque plein",
  disque_bas: "Disque bas",
  camera_deconnectee: "Caméra déconnectée",
  crash_dslrbooth: "Crash DSLRBOOTH",
  crash_cashinterface: "Crash Cash Interface",
  imprimante_deconnectee: "Imprimante déconnectée",
  coupe_incoherente: "Coupe de pouce",
  crash_relance: "Crash relancé",
  borne_hors_ligne: "Borne hors ligne",
  borne_eteinte_3_jours: "Borne éteinte > 3 jours",
  impression_non_delivree: "Impression non délivrée",
  drive_deconnecte: "Drive déconnecté",
};

export type AlertGravite = "critique" | "warning";

const TYPE_GRAVITE: Record<string, AlertGravite> = {
  bourrage_papier: "critique",
  fin_papier: "critique",
  fin_ruban: "critique",
  capot_ouvert: "critique",
  bac_chutes_plein: "critique",
  erreur_mecanique: "critique",
  crash_dslrbooth: "critique",
  crash_cashinterface: "critique",
  imprimante_deconnectee: "critique",
  disque_plein: "critique",
  camera_deconnectee: "critique",
  borne_hors_ligne: "critique",
  drive_deconnecte: "critique",
  coupe_incoherente: "warning",
  surchauffe: "warning",
  papier_bas: "warning",
  disque_bas: "warning",
  crash_relance: "warning",
  impression_non_delivree: "warning",
  borne_eteinte_3_jours: "warning",
};

export function alertIconFor(type: string): LucideIcon {
  return TYPE_LUCIDE[type] ?? AlertTriangle;
}

export function alertLabelFor(type: string): string {
  return TYPE_LABELS[type] ?? type;
}

export function alertGraviteFor(type: string): AlertGravite {
  return TYPE_GRAVITE[type] ?? "critique";
}

export function allAlertTypes(): string[] {
  return Object.keys(TYPE_LUCIDE);
}
