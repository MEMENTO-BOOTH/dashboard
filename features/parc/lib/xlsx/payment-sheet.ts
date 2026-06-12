import type ExcelJS from "exceljs";
import type { Activity } from "../activity";
import { fmtEuro, longDayLabel, parisDate } from "./format";
import { addBanner, emptyRow, kpiCard, styleBody, styleHead, totalsRow } from "./style";
import { DATE_FMT, EURO_FMT, FONT, INK, statutLabel, TIME_FMT } from "./tokens";

const PAIEMENTS_COLS = [
  { header: "Date", width: 16 },
  { header: "Heure", width: 12 },
  { header: "Montant", width: 14 },
  { header: "Papier avant", width: 14 },
  { header: "Papier après", width: 14 },
  { header: "Statut", width: 16 },
];

function addBilan(ws: ExcelJS.Worksheet, activity: Activity, start: number): number {
  const b = activity.bilan;
  const papier = b.feuilles_fin !== null ? `${b.feuilles_fin} / ${b.feuilles_max}` : "—";
  kpiCard(ws, 1, start, "CA du jour", fmtEuro(b.ca_total));
  kpiCard(ws, 3, start, "Photos sorties", String(b.photos_total));
  kpiCard(ws, 5, start, "Payées non sorties", String(b.payes_non_sortis));
  kpiCard(ws, 1, start + 2, "Remboursements", String(b.remboursements));
  kpiCard(ws, 3, start + 2, "Papier fin de journée", papier);
  kpiCard(ws, 5, start + 2, "Transactions", String(activity.paiements.length));
  return start + 4;
}

function addPaiements(ws: ExcelJS.Worksheet, activity: Activity, headRow: number) {
  const span = PAIEMENTS_COLS.length;
  PAIEMENTS_COLS.forEach((c, i) => {
    ws.getRow(headRow).getCell(i + 1).value = c.header;
  });
  styleHead(ws.getRow(headRow), span);

  activity.paiements.forEach((p, i) => {
    const row = ws.getRow(headRow + 1 + i);
    const date = row.getCell(1);
    date.value = parisDate(p.paiement_at);
    date.numFmt = DATE_FMT;
    const heure = row.getCell(2);
    heure.value = parisDate(p.paiement_at);
    heure.numFmt = TIME_FMT;
    const montant = row.getCell(3);
    montant.value = p.montant;
    montant.numFmt = EURO_FMT;
    row.getCell(4).value = p.feuilles_avant ?? "—";
    row.getCell(5).value = p.feuilles_apres ?? "—";
    const statut = row.getCell(6);
    statut.value = statutLabel(p.statut);
    const isProblem = p.statut === "non_imprime";
    if (isProblem) statut.font = { name: FONT, size: 11, bold: true, color: { argb: INK } };
    styleBody(row, span, i, isProblem);
  });

  const n = activity.paiements.length;
  if (n === 0) {
    emptyRow(ws, headRow + 1, span, "Aucun paiement ce jour-là.");
    return;
  }
  const lastData = headRow + n;
  ws.autoFilter = { from: { row: headRow, column: 1 }, to: { row: lastData, column: span } };

  const tot = totalsRow(ws, lastData + 1, span);
  tot.getCell(1).value = "TOTAL";
  const totMontant = tot.getCell(3);
  totMontant.value = { formula: `SUM(C${headRow + 1}:C${lastData})` };
  totMontant.numFmt = EURO_FMT;
  tot.getCell(6).value = `${n} transaction${n > 1 ? "s" : ""}`;
}

export function buildPaymentSheet(
  ws: ExcelJS.Worksheet,
  activity: Activity,
  borneName: string,
  dateYmd: string,
) {
  ws.properties.tabColor = { argb: INK };
  ws.columns = PAIEMENTS_COLS.map((c) => ({ width: c.width }));

  const start = addBanner(
    ws,
    PAIEMENTS_COLS.length,
    `MementoBooth — ${borneName}`,
    `Paiements — journée du ${longDayLabel(dateYmd)}`,
  );
  const headRow = addBilan(ws, activity, start) + 1;
  addPaiements(ws, activity, headRow);

  ws.views = [{ state: "frozen", ySplit: headRow }];
  ws.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    horizontalCentered: true,
    margins: { left: 0.4, right: 0.4, top: 0.6, bottom: 0.6, header: 0.3, footer: 0.3 },
    printTitlesRow: `${headRow}:${headRow}`,
  };
  ws.headerFooter = {
    oddFooter: "&L&8&K94A3B8MementoBooth&C&8&K94A3B8&R&8&K94A3B8Page &P / &N",
  };
}
