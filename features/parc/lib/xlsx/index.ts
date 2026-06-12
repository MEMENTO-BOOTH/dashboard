import ExcelJS from "exceljs";
import type { Activity } from "../activity";
import type { PrinterEvent } from "../printer";
import { buildPaymentSheet } from "./payment-sheet";
import { buildPrinterSheet } from "./printer-sheet";

export async function buildActivityWorkbook(
  activity: Activity,
  imprimante: PrinterEvent[],
  borneName: string,
  dateYmd: string,
): Promise<ExcelJS.Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "MementoBooth";
  wb.company = "MementoBooth";
  wb.created = new Date(activity.bilan.periode_fin);

  buildPaymentSheet(wb.addWorksheet("Paiements"), activity, borneName, dateYmd);
  buildPrinterSheet(wb.addWorksheet("Imprimante"), imprimante, borneName, dateYmd);

  return wb.xlsx.writeBuffer();
}
