import { Suspense } from "react";
import { ActiviteRecente, getActiviteRecente } from "@/features/activite";
import { can } from "@/features/auth/permissions";
import { getSessionUser } from "@/features/auth/session";
import { BornesTable, getBornesWithLatestState } from "@/features/bornes";
import { CommandesATraiter, getCommandesATraiter } from "@/features/commandes";
import {
  BugsUrgent,
  EarningInsights,
  getBugsAndPaperBornes,
  getEarningInsights,
} from "@/features/dashboard";
import {
  getAllBornesSummary,
  getAssignees,
  getInterventionCandidates,
} from "@/features/dashboard/alerts/intervention-api";
import { getKapsules } from "@/features/kapsules";

export const revalidate = 30;

export default async function DashboardHome() {
  const session = await getSessionUser();
  const showCa = session?.voirCa ?? false;
  const canCreateIntervention = session ? can(session.permissions, "interventions.create") : false;

  const [
    bornes,
    bugsPaper,
    earning,
    interventionCandidates,
    allBornesSummary,
    assignees,
    commandes,
    kapsules,
    activite,
  ] = await Promise.all([
    getBornesWithLatestState(),
    getBugsAndPaperBornes(),
    showCa ? getEarningInsights() : Promise.resolve(null),
    getInterventionCandidates(),
    getAllBornesSummary(),
    getAssignees(),
    getCommandesATraiter(),
    getKapsules(),
    getActiviteRecente(),
  ]);

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        {showCa && earning ? (
          <EarningInsights data={earning} />
        ) : (
          <div className="hidden lg:block" />
        )}
        <CommandesATraiter rows={commandes} total={commandes.length} bornes={kapsules} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_355px]">
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
        <ActiviteRecente events={activite} />
      </div>

      <Suspense fallback={null}>
        <BornesTable rows={bornes} showCa={showCa} />
      </Suspense>
    </div>
  );
}
