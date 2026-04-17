import { Suspense } from "react";
import { getInterventions } from "@/features/parc/api";
import { InterventionsList } from "@/features/parc/components/interventions-list";

export const revalidate = 30;

export default async function InterventionsPage() {
  const interventions = await getInterventions();

  return (
    <Suspense fallback={null}>
      <InterventionsList interventions={interventions} />
    </Suspense>
  );
}
