import { Suspense } from "react";
import { BornesTable, getBornesWithLatestState } from "@/features/bornes";
import {
  BugsUrgent,
  EarningInsights,
  getBugsAndPaperBornes,
  getEarningInsights,
  getObjectifData,
  getPerformanceRows,
  Objectif,
  Performance,
} from "@/features/dashboard";

export const revalidate = 30;

export default async function DashboardHome() {
  const [bornes, objectif, bugsPaper, earning, performance] = await Promise.all([
    getBornesWithLatestState(),
    getObjectifData(),
    getBugsAndPaperBornes(),
    getEarningInsights(),
    getPerformanceRows(),
  ]);

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_355px]">
        <div className="flex flex-col justify-between gap-6">
          <EarningInsights data={earning} />
          <BugsUrgent
            bugs={bugsPaper.bugs}
            totalBugs={bugsPaper.totalBugs}
            allBugs={bugsPaper.allBugs}
            paperBornes={bugsPaper.paperBornes}
            totalPaperBornes={bugsPaper.totalPaperBornes}
            allPaperBornes={bugsPaper.allPaperBornes}
          />
        </div>
        <div className="flex flex-col justify-between gap-6">
          <Performance rows={performance} />
          <Objectif data={objectif} />
        </div>
      </div>
      <Suspense fallback={null}>
        <BornesTable rows={bornes} />
      </Suspense>
    </div>
  );
}
