import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { can } from "@/features/auth/permissions";
import { getSessionUser } from "@/features/auth/session";
import {
  getBorneById,
  getBorneDetail,
  getBorneHeartbeat,
  getBorneHoraires,
  getBornePaperHistory,
} from "@/features/bornes";
import { getInterventionsByBorne } from "@/features/parc/api";
import { BorneProfile } from "@/features/parc/components/borne-profile";
import { DangerZoneSection } from "@/features/parc/components/danger-zone-section";
import { EquipmentSection } from "@/features/parc/components/equipment-section";
import { HorairesSection } from "@/features/parc/components/horaires-section";
import { InterventionsSection } from "@/features/parc/components/interventions-section";
import { PaperUsageSection } from "@/features/parc/components/paper-usage-section";
import { UpdatesSection } from "@/features/parc/components/updates-section";

export const revalidate = 30;

export default async function BorneDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionUser();
  if (!session) notFound();

  const { id } = await params;
  const [borne, borneState, heartbeat, paperHistory, horaires, interventions] = await Promise.all([
    getBorneDetail(id),
    getBorneById(id),
    getBorneHeartbeat(id),
    getBornePaperHistory(id),
    getBorneHoraires(id),
    getInterventionsByBorne(id),
  ]);

  const canEdit = can(session.permissions, "bornes.edit");
  const canDelete = can(session.permissions, "bornes.delete");

  return (
    <div className="flex flex-col">
      <Breadcrumb items={[{ label: "Bornes", href: "/parc/bornes" }, { label: borne.nom_lieu }]} />
      <BorneProfile borne={borne} canEdit={canEdit} />
      <HorairesSection borneId={borne.id} initial={horaires} canEdit={canEdit} />
      <PaperUsageSection
        borneId={borne.id}
        feuilles={borneState.feuillesRestantes ?? 0}
        max={borneState.feuillesMax}
        history={paperHistory}
      />
      <EquipmentSection data={heartbeat} />
      <UpdatesSection
        borneId={borne.id}
        versionAgent={heartbeat.versionAgent}
        environnement={borne.environnement}
        canEdit={canEdit}
      />
      <InterventionsSection interventions={interventions} />
      {canDelete ? <DangerZoneSection borneId={borne.id} borneNom={borne.nom_lieu} /> : null}
    </div>
  );
}
