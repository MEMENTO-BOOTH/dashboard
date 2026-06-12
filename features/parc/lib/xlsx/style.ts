import type ExcelJS from "exceljs";
import { CARD, FONT, fill, HILITE, INK, LINE, MUTED, STRIPE, thin, WHITE } from "./tokens";

export function addBanner(
  ws: ExcelJS.Worksheet,
  span: number,
  title: string,
  subtitle: string,
): number {
  const last = ws.getColumn(span).letter;
  ws.mergeCells(`A1:${last}1`);
  const t = ws.getCell("A1");
  t.value = title;
  t.font = { name: FONT, size: 16, bold: true, color: { argb: WHITE } };
  t.fill = fill(INK);
  t.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  ws.getRow(1).height = 34;

  ws.mergeCells(`A2:${last}2`);
  const s = ws.getCell("A2");
  s.value = subtitle;
  s.font = { name: FONT, size: 10, color: { argb: MUTED } };
  s.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  s.border = { bottom: thin(LINE) };
  ws.getRow(2).height = 20;
  return 4;
}

export function kpiCard(
  ws: ExcelJS.Worksheet,
  colLeft: number,
  rowTop: number,
  label: string,
  value: string,
) {
  const l = ws.getColumn(colLeft).letter;
  const r = ws.getColumn(colLeft + 1).letter;
  ws.mergeCells(`${l}${rowTop}:${r}${rowTop}`);
  ws.mergeCells(`${l}${rowTop + 1}:${r}${rowTop + 1}`);
  const head = ws.getCell(`${l}${rowTop}`);
  head.value = label.toUpperCase();
  head.font = { name: FONT, size: 9, bold: true, color: { argb: MUTED } };
  head.fill = fill(WHITE);
  head.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  head.border = { top: thin(LINE), left: thin(LINE), right: thin(LINE) };
  const val = ws.getCell(`${l}${rowTop + 1}`);
  val.value = value;
  val.font = { name: FONT, size: 18, bold: true, color: { argb: INK } };
  val.fill = fill(WHITE);
  val.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  val.border = { bottom: thin(LINE), left: thin(LINE), right: thin(LINE) };
  ws.getRow(rowTop).height = 18;
  ws.getRow(rowTop + 1).height = 30;
}

export function styleHead(row: ExcelJS.Row, span: number) {
  row.height = 24;
  for (let c = 1; c <= span; c++) {
    const cell = row.getCell(c);
    cell.font = { name: FONT, size: 10, bold: true, color: { argb: WHITE } };
    cell.fill = fill(INK);
    cell.alignment = { vertical: "middle", horizontal: c === 1 ? "left" : "right", indent: 1 };
  }
}

export function styleBody(row: ExcelJS.Row, span: number, index: number, highlight = false) {
  row.height = 19;
  const background = highlight ? HILITE : index % 2 === 1 ? STRIPE : null;
  for (let c = 1; c <= span; c++) {
    const cell = row.getCell(c);
    if (!cell.font) cell.font = { name: FONT, size: 11, color: { argb: INK } };
    cell.border = { bottom: thin() };
    cell.alignment = { vertical: "middle", horizontal: c === 1 ? "left" : "right", indent: 1 };
    if (background && !cell.fill) cell.fill = fill(background);
  }
}

export function totalsRow(ws: ExcelJS.Worksheet, rowIdx: number, span: number) {
  const row = ws.getRow(rowIdx);
  row.height = 22;
  for (let c = 1; c <= span; c++) {
    const cell = row.getCell(c);
    cell.font = { name: FONT, size: 11, bold: true, color: { argb: INK } };
    cell.fill = fill(CARD);
    cell.border = { top: { style: "medium", color: { argb: INK } } };
    cell.alignment = { vertical: "middle", horizontal: c === 1 ? "left" : "right", indent: 1 };
  }
  return row;
}

export function emptyRow(ws: ExcelJS.Worksheet, rowIdx: number, span: number, message: string) {
  const last = ws.getColumn(span).letter;
  ws.mergeCells(`A${rowIdx}:${last}${rowIdx}`);
  const cell = ws.getCell(`A${rowIdx}`);
  cell.value = message;
  cell.font = { name: FONT, size: 11, italic: true, color: { argb: MUTED } };
  cell.alignment = { vertical: "middle", horizontal: "center" };
  ws.getRow(rowIdx).height = 28;
}
