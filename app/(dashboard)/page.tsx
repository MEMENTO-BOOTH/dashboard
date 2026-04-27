import { Suspense } from "react";
import { can } from "@/features/auth/permissions";
import { getSessionUser } from "@/features/auth/session";
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
import {
  getAllBornesSummary,
  getAssignees,
  getInterventionCandidates,
} from "@/features/dashboard/alerts/intervention-api";

export const revalidate = 30;

export default async function DashboardHome() {
  const session = await getSessionUser();
  const showCa = session?.voirCa ?? false;
  const canCreateIntervention = session ? can(session.permissions, "interventions.create") : false;

  const [
    bornes,
    objectif,
    bugsPaper,
    earning,
    performance,
    interventionCandidates,
    allBornesSummary,
    assignees,
  ] = await Promise.all([
    getBornesWithLatestState(),
    getObjectifData(),
    getBugsAndPaperBornes(),
    showCa ? getEarningInsights() : Promise.resolve(null),
    showCa ? getPerformanceRows() : Promise.resolve(null),
    getInterventionCandidates(),
    getAllBornesSummary(),
    getAssignees(),
  ]);

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_355px]">
        <div className="flex flex-col justify-between gap-6">
          {showCa && earning ? <EarningInsights data={earning} /> : null}
          <BugsUrgent
            bugs={bugsPaper.bugs}
            totalBugs={bugsPaper.totalBugs}
            allBugs={bugsPaper.allBugs}
            paperBornes={bugsPaper.paperBornes}
            totalPaperBornes={bugsPaper.totalPaperBornes}
            allPaperBornes={bugsPaper.allPaperBornes}
            interventionCandidates={interventionCandidates}
            allBornes={allBornesSummary}
            assignees={assignees}
            canCreateIntervention={canCreateIntervention}
          />
        </div>
        <div className="flex flex-col justify-between gap-6">
          {showCa && performance ? (
            <Performance
              worst={performance.worst}
              best={performance.best}
              refRange={performance.refRange}
              prevRange={performance.prevRange}
            />
          ) : null}
          <Objectif data={objectif} />
        </div>
      </div>
      <Suspense fallback={null}>
        <BornesTable rows={bornes} showCa={showCa} />
      </Suspense>
    </div>
  );
}
