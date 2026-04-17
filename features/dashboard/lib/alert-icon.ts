import {
  AlertTriangle,
  FileText,
  LogOut,
  type LucideIcon,
  Percent,
  Printer,
} from "lucide-react";

// Mapping exact des types d'alertes Memento-agent → icônes Lucide.
// Source : SVG dans Memento-agent/assets/ (Feather icons).

const TYPE_ICONS: Record<string, LucideIcon> = {
  capot_ouvert: LogOut,
  coupe_incoherente: Percent,
  impression_non_delivree: Printer,
  papier_bas: FileText,
};

export function alertIconFor(type: string): LucideIcon {
  return TYPE_ICONS[type] ?? AlertTriangle;
}
