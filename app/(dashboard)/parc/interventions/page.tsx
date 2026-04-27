import { notFound } from "next/navigation";
import { Suspense } from "react";
import { can } from "@/features/auth/permissions";
import { getSessionUser } from "@/features/auth/session";
import {
  getAllBornesSummary,
  getAssignees,
  getInterventionCandidates,
} from "@/features/dashboard/alerts/intervention-api";
import { getInterventions } from "@/features/parc/api";
import { InterventionsList } from "@/features/parc/components/interventions-list";

export const revalidate = 30;

export default async function InterventionsPage() {
  const session = await getSessionUser();
  if (!session) notFound();

  const [interventions, candidates, allBornes, assignees] = await Promise.all([
    getInterventions(),
    getInterventionCandidates(),
    getAllBornesSummary(),
    getAssignees(),
  ]);

  const canCreate = can(session.permissions, "interventions.create");
  const canDelete = can(session.permissions, "interventions.delete");

  return (
    <Suspense fallback={null}>
      <InterventionsList
        interventions={interventions}
        candidates={candidates}
        allBornes={allBornes}
        assignees={assignees}
        canCreate={canCreate}
        canDelete={canDelete}
      />
    </Suspense>
  );
}
