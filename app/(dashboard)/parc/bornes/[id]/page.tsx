import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  getBorneById,
  getBorneDetail,
  getBorneHeartbeat,
  getBorneHoraires,
  getBornePaperHistory,
  getBorneUpdates,
} from "@/features/bornes";
import { BorneProfile } from "@/features/parc/components/borne-profile";
import { DangerZoneSection } from "@/features/parc/components/danger-zone-section";
import { EquipmentSection } from "@/features/parc/components/equipment-section";
import { HorairesSection } from "@/features/parc/components/horaires-section";
import { InterventionsSection } from "@/features/parc/components/interventions-section";
import { PaperUsageSection } from "@/features/parc/components/paper-usage-section";
import { UpdatesSection } from "@/features/parc/components/updates-section";

export const revalidate = 30;

export default async function BorneDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [borne, borneState, heartbeat, paperHistory, horaires, updates] = await Promise.all([
    getBorneDetail(id),
    getBorneById(id),
    getBorneHeartbeat(id),
    getBornePaperHistory(id),
    getBorneHoraires(id),
    getBorneUpdates(id),
  ]);

  return (
    <div className="flex flex-col">
      <Breadcrumb
        items={[
          { label: "Bornes", href: "/parc/bornes" },
          { label: borne.nom_lieu },
        ]}
      />
      <BorneProfile borne={borne} />
      <HorairesSection borneId={borne.id} initial={horaires} />
      <PaperUsageSection
        feuilles={borneState.feuillesRestantes ?? 0}
        max={borneState.feuillesMax}
        history={paperHistory}
      />
      <EquipmentSection data={heartbeat} />
      <UpdatesSection updates={updates} versionAgent={heartbeat.versionAgent} />
      <InterventionsSection />
      <DangerZoneSection borneId={borne.id} borneNom={borne.nom_lieu} />
    </div>
  );
}
