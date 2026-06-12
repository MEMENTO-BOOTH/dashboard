import type ExcelJS from "exceljs";
import { compterStatut, type PrinterEvent, totalPhotos } from "../printer";
import { longDayLabel, parisDate } from "./format";
import { addBanner, emptyRow, kpiCard, styleBody, styleHead } from "./style";
import { DATE_FMT, FONT, INK, TIME_FMT } from "./tokens";

const COLS = [
  { header: "Date", width: 14 },
  { header: "Heure", width: 12 },
  { header: "Papier restant", width: 16 },
  { header: "Photos sorties", width: 16 },
  { header: "Statut", width: 24 },
];

function addBilan(ws: ExcelJS.Worksheet, events: PrinterEvent[], start: number): number {
  const erreurs = events.filter((e) => e.erreur).length;
  kpiCard(ws, 1, start, "Photos sorties", String(totalPhotos(events)));
  kpiCard(ws, 3, start, "Bourrages", String(compterStatut(events, "Bourrage papier")));
  kpiCard(ws, 5, start, "Capot ouvert", String(compterStatut(events, "Capot ouvert")));
  kpiCard(ws, 1, start + 2, "Plus de papier", String(compterStatut(events, "Plus de papier")));
  kpiCard(ws, 3, start + 2, "Erreurs", String(erreurs));
  kpiCard(ws, 5, start + 2, "Événements", String(events.length));
  return start + 4;
}

function addLog(ws: ExcelJS.Worksheet, events: PrinterEvent[], headRow: number) {
  const span = COLS.length;
  COLS.forEach((c, i) => {
    ws.getRow(headRow).getCell(i + 1).value = c.header;
  });
  styleHead(ws.getRow(headRow), span);

  if (events.length === 0) {
    emptyRow(ws, headRow + 1, span, "Aucune sortie ni incident imprimante ce jour-là.");
    return;
  }

  events.forEach((e, i) => {
    const row = ws.getRow(headRow + 1 + i);
    const date = row.getCell(1);
    date.value = parisDate(e.timestamp);
    date.numFmt = DATE_FMT;
    const heure = row.getCell(2);
    heure.value = parisDate(e.timestamp);
    heure.numFmt = TIME_FMT;
    row.getCell(3).value = e.papier_restant ?? "—";
    row.getCell(4).value = e.erreur ? "" : e.photos_sorties;
    const statut = row.getCell(5);
    statut.value = e.statut;
    if (e.erreur) statut.font = { name: FONT, size: 11, bold: true, color: { argb: INK } };
    styleBody(row, span, i, e.erreur);
  });

  const lastData = headRow + events.length;
  ws.autoFilter = { from: { row: headRow, column: 1 }, to: { row: lastData, column: span } };
}

export function buildPrinterSheet(
  ws: ExcelJS.Worksheet,
  events: PrinterEvent[],
  borneName: string,
  dateYmd: string,
) {
  ws.properties.tabColor = { argb: INK };
  ws.columns = COLS.map((c) => ({ width: c.width }));

  const start = addBanner(
    ws,
    COLS.length,
    `MementoBooth — ${borneName}`,
    `Imprimante — journée du ${longDayLabel(dateYmd)}`,
  );
  const headRow = addBilan(ws, events, start) + 1;
  addLog(ws, events, headRow);

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
