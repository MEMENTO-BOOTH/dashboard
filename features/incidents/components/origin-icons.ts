import { Code, HelpCircle, Wifi, Wrench } from "lucide-react";
import type { Origin } from "../lib";

export const ORIGIN_ICONS: Record<Origin, typeof Code> = {
  diag: HelpCircle,
  logiciel: Code,
  materiel: Wrench,
  reseau: Wifi,
};
