import "server-only";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchAllTransactions, type TxLite } from "@/lib/supabase/fetch-all";
import { addDays, startOfMonday } from "@/lib/utils/format";

const DAY_MS = 24 * 60 * 60 * 1000;

export type BorneCard = {
  id: string;
  nom_lieu: string;
  logo_url: string | null;
};

export async function getBornesForTransactions(): Promise<BorneCard[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bornes")
    .select("id, nom_lieu, logo_url")
    .order("nom_lieu");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export type BorneRanking = {
  top: { label: string; value: number }[];
  bottom: { label: string; value: number }[];
  allDesc: { label: string; value: number }[];
};

export async function getBorneCARanking(days = 30): Promise<BorneRanking> {
  const supabase = createAdminClient();
  const since = new Date(Date.now() - days * DAY_MS).toISOString();

  const [bornesRes, tx] = await Promise.all([
    supabase.from("bornes").select("id, nom_lieu"),
    fetchAllTransactions(supabase, { sinceISO: since }, ["borne_id", "montant"]),
  ]);

  if (bornesRes.error) throw new Error(bornesRes.error.message);

  const totals = new Map<string, number>();
  for (const t of tx) {
    if (!t.borne_id) continue;
    totals.set(t.borne_id, (totals.get(t.borne_id) ?? 0) + t.montant);
  }

  const rows = (bornesRes.data ?? []).map((b) => ({
    label: b.nom_lieu,
    value: totals.get(b.id) ?? 0,
  }));

  const sortedDesc = [...rows].sort((a, b) => b.value - a.value);

  return {
    top: sortedDesc.slice(0, 5),
    bottom: sortedDesc.slice(-5).reverse(),
    allDesc: sortedDesc,
  };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type PeriodStat = { ca: number; count: number; trend: number | null };
export type AvgCaBucket = { label: string; amount: number };

export type GlobalStats = {
  // Profit card — mois calendaire précédent complet
  caLastMonth: number;
  trendLastMonth: number | null; // mois -1 vs mois -2
  profitLineData: number[]; // 8 mois calendaires précédents (mois -8..-1)
  // Transaction Report card
  monthlyBars: { month: string; ca: number }[]; // 8 mois calendaires précédents
  trendWeek: number | null; // semaine ISO -1 vs ISO -2
  trendMonth: number | null; // alias trendLastMonth
  lastMonthCa: number; // alias caLastMonth
  // Libellés explicites des périodes comparées (UX)
  weekRefLabel: string; // ex: "20 → 26 avr"
  weekPrevLabel: string; // ex: "13 → 19 avr"
  monthRefLabel: string; // ex: "Mars 2026"
  monthPrevLabel: string; // ex: "Février 2026"
  // Total sales card — 30 derniers jours roulants
  totalSales30d: number;
  weekendCa: number;
  weekdayCa: number;
  hourlyBars: number[];
};

const MONTH_FR_LONG = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

function formatDayMonth(d: Date): string {
  return `${d.getDate()} ${(MONTH_FR_SHORT[d.getMonth()] ?? "").toLowerCase()}.`;
}

function formatMonthYear(d: Date): string {
  return `${MONTH_FR_LONG[d.getMonth()] ?? ""} ${d.getFullYear()}`;
}

const MONTH_FR_SHORT = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Jun",
  "Jul",
  "Aoû",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

// Buckets time en Europe/Paris quel que soit le fuseau du serveur (Vercel = UTC,
// local = Paris) — sans ça, une tx à 31 déc 23h51 UTC bucke "Déc" en prod
// mais "Jan" en local, et on lit deux totaux différents pour la même donnée.
const PARIS_YMD_FMT = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Paris",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function parisYMD(d: Date): { year: number; month: number; day: number } {
  let year = 0;
  let month = 0;
  let day = 0;
  for (const p of PARIS_YMD_FMT.formatToParts(d)) {
    if (p.type === "year") year = Number(p.value);
    else if (p.type === "month") month = Number(p.value);
    else if (p.type === "day") day = Number(p.value);
  }
  return { year, month, day };
}

function monthKey(d: Date): string {
  const { year, month } = parisYMD(d);
  return `${year}-${String(month).padStart(2, "0")}`;
}

function trendValue(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return ((current - previous) / previous) * 100;
}

// Formatter qui sort heure et minute en heure de Paris quel que soit le fuseau
// du serveur (Vercel = UTC, Mac local = Paris). Évite que le pic horaire soit
// décalé de 2h en prod.
const PARIS_HOUR_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  hour: "2-digit",
  minute: "2-digit",
  weekday: "short",
  hourCycle: "h23",
});

function parisParts(d: Date): { hour: number; minute: number; weekday: string } {
  const parts = PARIS_HOUR_FORMATTER.formatToParts(d);
  let hour = 0;
  let minute = 0;
  let weekday = "";
  for (const p of parts) {
    if (p.type === "hour") hour = Number(p.value);
    else if (p.type === "minute") minute = Number(p.value);
    else if (p.type === "weekday") weekday = p.value.toLowerCase();
  }
  return { hour, minute, weekday };
}

// Mappe une date d'évènement vers un bucket horaire 0..11 (heure de Paris).
// 12 buckets de 1h30 couvrant 9h00 → 3h00 du lendemain (18 heures d'ouverture).
// Les heures hors plage (3h-9h) sont ignorées.
function hourBucket(d: Date): number | null {
  const { hour, minute } = parisParts(d);
  const mins = hour * 60 + minute;
  let offset: number;
  if (mins >= 9 * 60) offset = mins - 9 * 60;
  else if (mins < 3 * 60) offset = mins + 15 * 60;
  else return null;
  return Math.min(11, Math.floor(offset / 90));
}

// Vendredi / Samedi / Dimanche = weekend pour des bornes nightlife (Paris).
const WEEKEND_DAYS = new Set(["ven.", "sam.", "dim."]);

function isWeekendParis(d: Date): boolean {
  return WEEKEND_DAYS.has(parisParts(d).weekday);
}

// Retire les mois de tête sans aucune donnée — sinon on affiche "0 €" pour des
// mois où les bornes n'étaient pas encore installées, ce qui ressemble à de la
// contre-performance au lieu de "pas de data".
function trimLeadingZeros<T extends { ca: number }>(rows: T[]): T[] {
  const firstNonZero = rows.findIndex((r) => r.ca > 0);
  if (firstNonZero <= 0) return rows;
  return rows.slice(firstNonZero);
}

function buildMonthlyBars(tx: TxLite[], now: Date) {
  const map = new Map<string, number>();
  for (const t of tx) {
    const k = monthKey(new Date(t.paiement_at));
    map.set(k, (map.get(k) ?? 0) + t.montant);
  }
  const bars: { month: string; ca: number }[] = [];
  for (let i = 8; i >= 1; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    bars.push({ month: MONTH_FR_SHORT[d.getMonth()] ?? "", ca: map.get(monthKey(d)) ?? 0 });
  }
  return trimLeadingZeros(bars);
}

function computeWeekTrend(tx: TxLite[], now: Date): number | null {
  const monday = startOfMonday(now);
  const refStart = addDays(monday, -7).getTime();
  const prevStart = addDays(monday, -14).getTime();
  let ref = 0;
  let prev = 0;
  for (const t of tx) {
    const ts = new Date(t.paiement_at).getTime();
    if (ts >= refStart && ts < monday.getTime()) ref += t.montant;
    else if (ts >= prevStart && ts < refStart) prev += t.montant;
  }
  return trendValue(ref, prev);
}

type SalesBreakdown = {
  totalSales30d: number;
  weekendCa: number;
  weekdayCa: number;
  hourlyBars: number[];
};

function computeSalesBreakdown(tx: TxLite[], now: Date): SalesBreakdown {
  const thirtyDaysAgo = now.getTime() - 30 * DAY_MS;
  const out: SalesBreakdown = {
    totalSales30d: 0,
    weekendCa: 0,
    weekdayCa: 0,
    hourlyBars: new Array(12).fill(0),
  };
  for (const t of tx) {
    const d = new Date(t.paiement_at);
    if (d.getTime() < thirtyDaysAgo) continue;
    out.totalSales30d += t.montant;
    if (isWeekendParis(d)) out.weekendCa += t.montant;
    else out.weekdayCa += t.montant;
    const b = hourBucket(d);
    if (b !== null) out.hourlyBars[b] = (out.hourlyBars[b] ?? 0) + t.montant;
  }
  return out;
}

export async function getGlobalTransactionStats(now: Date = new Date()): Promise<GlobalStats> {
  const supabase = createAdminClient();

  // Fenêtre = 9 mois calendaires en arrière (8 mois -1..-8, marge pour le mois -2 du trend).
  const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const since = new Date(firstOfThisMonth.getFullYear(), firstOfThisMonth.getMonth() - 9, 1);
  const tx = await fetchAllTransactions(supabase, { sinceISO: since.toISOString() }, [
    "montant",
    "paiement_at",
  ]);

  const monthlyBars = buildMonthlyBars(tx, now);
  const caLastMonth = monthlyBars.at(-1)?.ca ?? 0;
  const trendLastMonth = trendValue(caLastMonth, monthlyBars.at(-2)?.ca ?? 0);
  const trendWeek = computeWeekTrend(tx, now);
  const sales = computeSalesBreakdown(tx, now);

  // Libellés explicites pour la synthèse
  const monday = startOfMonday(now);
  const refStart = addDays(monday, -7);
  const refEndIncl = addDays(monday, -1);
  const prevStart = addDays(monday, -14);
  const prevEndIncl = addDays(monday, -8);
  const monthRef = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const monthPrev = new Date(now.getFullYear(), now.getMonth() - 2, 1);

  return {
    caLastMonth,
    trendLastMonth,
    profitLineData: monthlyBars.map((m) => m.ca),
    monthlyBars,
    trendWeek,
    trendMonth: trendLastMonth,
    lastMonthCa: caLastMonth,
    weekRefLabel: `${formatDayMonth(refStart)} → ${formatDayMonth(refEndIncl)}`,
    weekPrevLabel: `${formatDayMonth(prevStart)} → ${formatDayMonth(prevEndIncl)}`,
    monthRefLabel: formatMonthYear(monthRef),
    monthPrevLabel: formatMonthYear(monthPrev),
    ...sales,
  };
}

export type BorneTransactionsDetail = {
  id: string;
  nom_lieu: string;
  logo_url: string | null;
  date_installation: string | null;
  firstTransactionAt: string | null;
  daysSinceInstall: number;
  caTotal: number;
  countTotal: number;
  caAvgPerDay: number;
  caAvgPerWeek: number;
  caAvgPerMonth: number;
  stats7d: PeriodStat;
  stats30d: PeriodStat;
  stats3m: PeriodStat;
  stats12m: PeriodStat;
  avgCaByPeriod: AvgCaBucket[];
  countTrend30d: number | null;
  byDay: { label: string; ca: number }[];
  byWeek: { label: string; ca: number }[];
  byMonth: { label: string; ca: number }[];
  byYear: { label: string; ca: number }[];
  trendWeek: number | null; // semaine ISO -1 vs -2 (synthèse)
  trendMonth: number | null; // mois -1 vs -2
  lastWeekCa: number;
  lastMonthCa: number;
  recent: { id: string; paiement_at: string; montant: number; impression: boolean }[];
};

function dayKey(d: Date): string {
  const { year, month, day } = parisYMD(d);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// Lundi (en Paris) du jour Paris de d, exprimé en clé YYYY-MM-DD.
// Évite les bornes de semaine qui glissent quand le serveur est en UTC vs Paris
// (ex : tx du dimanche soir tard UTC = lundi matin tôt Paris).
function weekKey(d: Date): string {
  const { year, month, day } = parisYMD(d);
  const probe = new Date(Date.UTC(year, month - 1, day, 12));
  const weekday = probe.getUTCDay();
  const offset = weekday === 0 ? -6 : 1 - weekday;
  const monday = new Date(Date.UTC(year, month - 1, day + offset));
  return `${monday.getUTCFullYear()}-${String(monday.getUTCMonth() + 1).padStart(2, "0")}-${String(monday.getUTCDate()).padStart(2, "0")}`;
}

function aggregateByDay(tx: TxLite[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const t of tx) {
    const k = dayKey(new Date(t.paiement_at));
    map.set(k, (map.get(k) ?? 0) + t.montant);
  }
  return map;
}

function aggregateByMonth(tx: TxLite[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const t of tx) {
    const k = monthKey(new Date(t.paiement_at));
    map.set(k, (map.get(k) ?? 0) + t.montant);
  }
  return map;
}

function aggregateByWeek(tx: TxLite[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const t of tx) {
    const k = weekKey(new Date(t.paiement_at));
    map.set(k, (map.get(k) ?? 0) + t.montant);
  }
  return map;
}

function aggregateByYear(tx: TxLite[]): Map<number, number> {
  const map = new Map<number, number>();
  for (const t of tx) {
    const { year } = parisYMD(new Date(t.paiement_at));
    map.set(year, (map.get(year) ?? 0) + t.montant);
  }
  return map;
}

function buildLast30Days(now: Date, dayMap: Map<string, number>) {
  const rows: { label: string; ca: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    rows.push({
      label: `${String(d.getDate()).padStart(2, "0")} ${MONTH_FR_SHORT[d.getMonth()] ?? ""}`,
      ca: dayMap.get(dayKey(d)) ?? 0,
    });
  }
  return rows;
}

function buildLast8Months(now: Date, monthMap: Map<string, number>) {
  const rows: { label: string; ca: number }[] = [];
  for (let i = 8; i >= 1; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    rows.push({
      label: MONTH_FR_SHORT[d.getMonth()] ?? "",
      ca: monthMap.get(monthKey(d)) ?? 0,
    });
  }
  return trimLeadingZeros(rows);
}

function buildLast8Weeks(now: Date, weekMap: Map<string, number>) {
  const nowKey = weekKey(now);
  const parts = nowKey.split("-").map(Number);
  const y = parts[0] ?? 1970;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  const rows: { label: string; ca: number }[] = [];
  for (let i = 8; i >= 1; i--) {
    const ws = new Date(Date.UTC(y, m - 1, d - 7 * i));
    const wsY = ws.getUTCFullYear();
    const wsM = ws.getUTCMonth() + 1;
    const wsD = ws.getUTCDate();
    rows.push({
      label: `${String(wsD).padStart(2, "0")} ${MONTH_FR_SHORT[wsM - 1] ?? ""}`,
      ca: weekMap.get(`${wsY}-${String(wsM).padStart(2, "0")}-${String(wsD).padStart(2, "0")}`) ?? 0,
    });
  }
  return trimLeadingZeros(rows);
}

function buildYears(now: Date, yearMap: Map<number, number>) {
  const rows: { label: string; ca: number }[] = [];
  const years = Array.from(yearMap.keys()).sort();
  if (years.length === 0) return [{ label: String(now.getFullYear()), ca: 0 }];
  for (const y of years) rows.push({ label: String(y), ca: yearMap.get(y) ?? 0 });
  return rows;
}

function rollingPeriod(tx: TxLite[], now: Date, days: number): PeriodStat {
  const from = now.getTime() - days * DAY_MS;
  const prevFrom = from - days * DAY_MS;
  let ca = 0;
  let count = 0;
  let prevCa = 0;
  for (const t of tx) {
    const ts = new Date(t.paiement_at).getTime();
    if (ts >= from) {
      ca += t.montant;
      count += 1;
    } else if (ts >= prevFrom) {
      prevCa += t.montant;
    }
  }
  return { ca, count, trend: trendValue(ca, prevCa) };
}

export async function getBorneTransactionsDetail(
  id: string,
  now: Date = new Date(),
): Promise<BorneTransactionsDetail> {
  if (!UUID_RE.test(id)) notFound();

  const supabase = createAdminClient();
  const borneRes = await supabase
    .from("bornes")
    .select("id, nom_lieu, logo_url, date_installation")
    .eq("id", id)
    .maybeSingle();
  if (borneRes.error) throw new Error(borneRes.error.message);
  if (!borneRes.data) notFound();

  const tx = (await fetchAllTransactions(supabase, { borneId: id }, [
    "id",
    "paiement_at",
    "montant",
    "impression_declenchee",
  ])) as Required<TxLite>[];

  const b = borneRes.data;
  const startMs = tx[0] ? new Date(tx[0].paiement_at).getTime() : now.getTime();
  const firstTransactionAt = tx[0]?.paiement_at ?? null;
  const daysSinceInstall = Math.max(1, Math.floor((now.getTime() - startMs) / DAY_MS));

  const caTotal = tx.reduce((s, t) => s + t.montant, 0);
  const countTotal = tx.length;
  const caAvgPerDay = caTotal / daysSinceInstall;
  const caAvgPerWeek = caAvgPerDay * 7;
  const caAvgPerMonth = caAvgPerDay * 30;

  const stats7d = rollingPeriod(tx, now, 7);
  const stats30d = rollingPeriod(tx, now, 30);
  const stats3m = rollingPeriod(tx, now, 90);
  const stats12m = rollingPeriod(tx, now, 365);

  const byDay = buildLast30Days(now, aggregateByDay(tx));
  const byMonth = buildLast8Months(now, aggregateByMonth(tx));
  const byWeek = buildLast8Weeks(now, aggregateByWeek(tx));
  const byYear = buildYears(now, aggregateByYear(tx));

  const lastMonthCa = byMonth.at(-1)?.ca ?? 0;
  const trendMonth = trendValue(lastMonthCa, byMonth.at(-2)?.ca ?? 0);
  const lastWeekCa = byWeek.at(-1)?.ca ?? 0;
  const trendWeek = trendValue(lastWeekCa, byWeek.at(-2)?.ca ?? 0);

  const avgCaByPeriod: AvgCaBucket[] = [
    { label: "Jour", amount: caAvgPerDay },
    { label: "Mois", amount: caAvgPerMonth },
  ];

  const recent = [...tx]
    .reverse()
    .slice(0, 50)
    .map((t) => ({
      id: t.id,
      paiement_at: t.paiement_at,
      montant: t.montant,
      impression: Boolean(t.impression_declenchee),
    }));

  return {
    id: b.id,
    nom_lieu: b.nom_lieu,
    logo_url: b.logo_url,
    date_installation: b.date_installation,
    firstTransactionAt,
    daysSinceInstall,
    caTotal,
    countTotal,
    caAvgPerDay,
    caAvgPerWeek,
    caAvgPerMonth,
    stats7d,
    stats30d,
    stats3m,
    stats12m,
    avgCaByPeriod,
    countTrend30d: stats30d.trend,
    byDay,
    byWeek,
    byMonth,
    byYear,
    trendWeek,
    trendMonth,
    lastWeekCa,
    lastMonthCa,
    recent,
  };
}
