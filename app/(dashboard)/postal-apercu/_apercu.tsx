import type { ActiviteEvent } from "@/features/activite";
import { ActiviteRecente } from "@/features/activite";
import type { CommandeRow } from "@/features/commandes";
import { CommandesATraiter } from "@/features/commandes";
import type { KapsuleRow } from "@/features/kapsules";

export function PostalApercu({
  commandes,
  bornes,
  activite,
}: {
  commandes: CommandeRow[];
  bornes: KapsuleRow[];
  activite: ActiviteEvent[];
}) {
  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <CommandesATraiter rows={commandes} total={commandes.length} bornes={bornes} />
        <ActiviteRecente events={activite} />
      </div>
    </div>
  );
}
