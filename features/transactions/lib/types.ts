export type BorneCard = {
  id: string;
  nom_lieu: string;
  logo_url: string | null;
};

export type BorneRanking = {
  top: { label: string; value: number }[];
  bottom: { label: string; value: number }[];
  allDesc: { label: string; value: number }[];
};

export type PeriodStat = { ca: number; count: number; trend: number | null };
export type AvgCaBucket = { label: string; amount: number };

export type SalesBreakdown = {
  totalSales30d: number;
  weekendCa: number;
  weekdayCa: number;
  hourlyBars: number[];
  peakHour: number | null;
};

export type GlobalStats = {
  caLastMonth: number;
  trendLastMonth: number | null;
  profitLineData: number[];
  monthlyBars: { month: string; ca: number }[];
  trendWeek: number | null;
  trendMonth: number | null;
  lastMonthCa: number;
  weekRefLabel: string;
  weekPrevLabel: string;
  monthRefLabel: string;
  monthPrevLabel: string;
  totalSales30d: number;
  weekendCa: number;
  weekdayCa: number;
  hourlyBars: number[];
  peakHour: number | null;
};

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
  trendWeek: number | null;
  trendMonth: number | null;
  lastWeekCa: number;
  lastMonthCa: number;
  recent: { id: string; paiement_at: string; montant: number; impression: boolean }[];
};
