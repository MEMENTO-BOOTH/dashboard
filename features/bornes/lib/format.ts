import {
  Bug,
  CameraOff,
  CloudOff,
  DoorOpen,
  FileX,
  type LucideIcon,
  Printer,
  Scissors,
  TriangleAlert,
} from "lucide-react";
import type { Alerte } from "../schemas";

export function formatRelativeActivity(iso: string | null, now: Date = new Date()): string {
  if (!iso) return "—";
  const diffMs = now.getTime() - new Date(iso).getTime();
  const min = Math.round(diffMs / 60000);
  if (min < 1) return "À l'instant";
  if (min < 60) return `Il y'a ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `Il y'a ${h} h`;
  const d = Math.round(h / 24);
  return `Il y'a ${d} j`;
}

const eurFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function formatCA(amount: number): string {
  if (amount <= 0) return "€-";
  return eurFormatter.format(amount);
}

export type PapierColor = "amber" | "orange" | "teal" | "darkTeal";

export function papierColor(percent: number): PapierColor {
  if (percent < 20) return "amber";
  if (percent < 50) return "orange";
  if (percent < 80) return "teal";
  return "darkTeal";
}

export type AlertMeta = { label: string; icon: LucideIcon };

const ALERT_META: Record<string, AlertMeta> = {
  camera_deconnectee: { label: "Caméra", icon: CameraOff },
  capot_ouvert: { label: "Capot ouvert", icon: DoorOpen },
  coupe_incoherente: { label: "Coupe", icon: Scissors },
  crash_dslrbooth: { label: "Crash booth", icon: Bug },
  drive_deconnecte: { label: "Drive", icon: CloudOff },
  impression_non_delivree: { label: "Impression", icon: FileX },
  imprimante_deconnectee: { label: "Imprimante", icon: Printer },
};

export function alertMeta(alerte: Alerte): AlertMeta {
  return ALERT_META[alerte.type] ?? { label: alerte.type, icon: TriangleAlert };
}
