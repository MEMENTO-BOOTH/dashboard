type UpdateRow = {
  id: string;
  statut: string;
  message_erreur: string | null;
  mise_a_jour_at: string | null;
  created_at: string;
  updates: { version: string; notes: string | null; publiee_at: string } | null;
};

export function UpdatesSection({
  updates,
  versionAgent,
}: {
  updates: UpdateRow[];
  versionAgent: string | null;
}) {
  const installed = updates.find((u) => u.statut === "installee");
  const installedVersion = installed?.updates?.version ?? versionAgent ?? "—";

  const latestAvailable = updates[0]?.updates?.version ?? null;
  const isUpToDate = !latestAvailable || latestAvailable === installedVersion;

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8 pt-12">
      <h2 className="text-[24px] font-semibold leading-8 text-foreground">Mises à jour</h2>

      <div className="overflow-clip rounded-[10px] border border-border">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex flex-col gap-1">
            <p className="text-[14px] font-normal leading-5 text-muted-foreground">
              Version installée
            </p>
            <p className="text-[24px] font-semibold leading-8 text-foreground">
              {installedVersion}
            </p>
          </div>
          <p className="text-[14px] font-normal leading-5 text-muted-foreground">
            {isUpToDate ? "À jour" : `Nouvelle version disponible : ${latestAvailable}`}
          </p>
        </div>
      </div>

      <div className="h-px bg-border" />
    </div>
  );
}
