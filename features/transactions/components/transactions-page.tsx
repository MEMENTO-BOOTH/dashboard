import { BorneRankingCard } from "../_parts/borne-ranking-card";
import { BornesTransactionsGrid } from "../_parts/bornes-grid";
import { ProfitCard } from "../_parts/profit-card";
import { TotalSalesCard } from "../_parts/total-sales-card";
import { TransactionReportCard } from "../_parts/transaction-report-card";
import type { BorneCard, BorneRanking, GlobalStats } from "../api";

export function TransactionsPage({
  bornes,
  ranking,
  stats,
}: {
  bornes: BorneCard[];
  ranking: BorneRanking;
  stats: GlobalStats;
}) {
  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-6 pt-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-semibold leading-8 text-foreground">Finance</h1>
        <p className="text-[14px] font-normal leading-5 text-muted-foreground">
          Vue d'ensemble du chiffre d'affaires et des transactions par borne.
        </p>
      </div>

      <div className="flex flex-col items-stretch gap-4 lg:flex-row">
        <div className="flex w-full lg:w-[340px] lg:shrink-0">
          <ProfitCard
            caLastMonth={stats.caLastMonth}
            trend={stats.trendLastMonth}
            lineData={stats.profitLineData}
          />
        </div>
        <div className="flex min-w-0 flex-1">
          <BorneRankingCard
            title="Meilleures bornes"
            subtitle="CA des 30 derniers jours"
            rows={ranking.top}
            allRows={ranking.allDesc}
            direction="desc"
          />
        </div>
        <div className="flex min-w-0 flex-1">
          <BorneRankingCard
            title="Bornes les plus faibles"
            subtitle="CA des 30 derniers jours"
            rows={ranking.bottom}
            allRows={ranking.allDesc}
            direction="asc"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <TransactionReportCard
          months={stats.monthlyBars}
          trendWeek={stats.trendWeek}
          trendMonth={stats.trendMonth}
          lastMonthCa={stats.lastMonthCa}
          weekRefLabel={stats.weekRefLabel}
          weekPrevLabel={stats.weekPrevLabel}
          monthRefLabel={stats.monthRefLabel}
          monthPrevLabel={stats.monthPrevLabel}
        />
        <TotalSalesCard
          totalSales={stats.totalSales30d}
          weekendCa={stats.weekendCa}
          weekdayCa={stats.weekdayCa}
          hourlyBars={stats.hourlyBars}
          peakHour={stats.peakHour}
        />
      </div>

      <div className="flex flex-col gap-4 pt-4">
        <h2 className="text-[18px] font-semibold leading-7 text-foreground">Bornes</h2>
        <BornesTransactionsGrid bornes={bornes} />
      </div>
    </div>
  );
}
