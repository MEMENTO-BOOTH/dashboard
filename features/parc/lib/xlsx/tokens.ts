import type ExcelJS from "exceljs";
import type { PaymentRow } from "../activity";

export const INK = "FF18181B";
export const WHITE = "FFFFFFFF";
export const MUTED = "FF71717A";
export const LINE = "FFE4E4E7";
export const STRIPE = "FFFAFAFA";
export const CARD = "FFF4F4F5";
export const HILITE = "FFE4E4E7";

export const EURO_FMT = '#,##0.00\\ "€"';
export const DATE_FMT = "dd/mm/yyyy";
export const TIME_FMT = "hh:mm:ss";
export const FONT = "Calibri";

export function fill(color: string): ExcelJS.Fill {
  return { type: "pattern", pattern: "solid", fgColor: { argb: color } };
}

export function thin(color = LINE): Partial<ExcelJS.Border> {
  return { style: "thin", color: { argb: color } };
}

export function statutLabel(s: PaymentRow["statut"]): string {
  if (s === "imprime") return "Imprimé";
  if (s === "rembourse") return "Remboursé";
  return "Non imprimé";
}
