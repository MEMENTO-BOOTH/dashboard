import type { BorneEnvironnement } from "@/features/bornes";
import { EnvironnementToggle } from "./environnement-toggle";

export function UpdatesSection({
  borneId,
  versionAgent,
  environnement,
  canEdit = false,
}: {
  borneId: string;
  versionAgent: string | null;
  environnement: BorneEnvironnement;
  canEdit?: boolean;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8 pt-12">
      <h2 className="text-[24px] font-semibold leading-8 text-foreground">Mises à jour</h2>

      <div className="flex flex-col divide-y divide-border overflow-clip rounded-[10px] border border-border">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex flex-col gap-1">
            <p className="text-[14px] font-normal leading-5 text-muted-foreground">
              Version installée
            </p>
            <p className="text-[24px] font-semibold leading-8 text-foreground">
              {versionAgent ?? "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex flex-col gap-1">
            <p className="text-[14px] font-normal leading-5 text-muted-foreground">
              Canal de mise à jour
            </p>
            <p className="text-[14px] font-normal leading-5 text-muted-foreground">
              Prod = release stable. Dev = pre-release pour test.
            </p>
          </div>
          <EnvironnementToggle borneId={borneId} current={environnement} canEdit={canEdit} />
        </div>
      </div>

      <div className="h-px bg-border" />
    </div>
  );
}
