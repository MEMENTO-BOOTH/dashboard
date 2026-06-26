import type { TxLite } from "@/lib/supabase/fetch-all";
import {
  aggregateByDay,
  aggregateByMonth,
  aggregateByWeek,
  aggregateByYear,
  buildLast8Months,
  buildLast8Weeks,
  buildLast30Days,
  buildYears,
  rollingPeriod,
} from "./aggregate";
import { trendValue } from "./format";
import { DAY_MS } from "./time";
import type { AvgCaBucket, BorneTransactionsDetail } from "./types";

type BorneRow = {
  id: string;
  nom_lieu: string;
  logo_url: string | null;
  date_installation: string | null;
};

export function buildBorneDetail(
  b: BorneRow,
  tx: Required<TxLite>[],
  now: Date,
): BorneTransactionsDetail {
  const txCa = tx.filter((t) => t.montant > 0);

  const startMs = tx[0] ? new Date(tx[0].paiement_at).getTime() : now.getTime();
  const firstTransactionAt = tx[0]?.paiement_at ?? null;
  const daysSinceInstall = Math.max(1, Math.floor((now.getTime() - startMs) / DAY_MS));

  const caTotal = txCa.reduce((s, t) => s + t.montant, 0);
  const countTotal = tx.length;
  const caAvgPerDay = caTotal / daysSinceInstall;

  const stats30d = rollingPeriod(txCa, now, 30);
  const byMonth = buildLast8Months(now, aggregateByMonth(txCa));
  const byWeek = buildLast8Weeks(now, aggregateByWeek(txCa));

  const lastMonthCa = byMonth.at(-1)?.ca ?? 0;
  const lastWeekCa = byWeek.at(-1)?.ca ?? 0;

  const avgCaByPeriod: AvgCaBucket[] = [
    { label: "Jour", amount: caAvgPerDay },
    { label: "Mois", amount: caAvgPerDay * 30 },
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
    caAvgPerWeek: caAvgPerDay * 7,
    caAvgPerMonth: caAvgPerDay * 30,
    stats7d: rollingPeriod(txCa, now, 7),
    stats30d,
    stats3m: rollingPeriod(txCa, now, 90),
    stats12m: rollingPeriod(txCa, now, 365),
    avgCaByPeriod,
    countTrend30d: stats30d.trend,
    byDay: buildLast30Days(now, aggregateByDay(txCa)),
    byWeek,
    byMonth,
    byYear: buildYears(now, aggregateByYear(txCa)),
    trendWeek: trendValue(lastWeekCa, byWeek.at(-2)?.ca ?? 0),
    trendMonth: trendValue(lastMonthCa, byMonth.at(-2)?.ca ?? 0),
    lastWeekCa,
    lastMonthCa,
    recent,
  };
}
