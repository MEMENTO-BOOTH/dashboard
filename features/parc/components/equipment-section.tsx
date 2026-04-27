type Row = {
  label: string;
  value: string | null;
};

function InfoTable({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <div className="overflow-clip rounded-[10px] border border-border">
      <div className="border-b border-border bg-muted/50 px-6 py-3">
        <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
      </div>
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between gap-4 border-t border-border px-6 py-4 first:border-t-0"
        >
          <p className="text-[14px] font-normal leading-5 text-foreground">{row.label}</p>
          <p className="text-right text-[14px] font-normal leading-5 text-muted-foreground">
            {row.value ?? "—"}
          </p>
        </div>
      ))}
    </div>
  );
}

export type EquipmentData = {
  versionAgent: string | null;
  versionDslrbooth: string | null;
  versionCashInterface: string | null;
  serialImprimante: string | null;
  serialAppareilPhoto: string | null;
  imprimanteStatut: string | null;
  modeCoupe: string | null;
  ssidWifi: string | null;
  disqueLibreGo: number | null;
};

export function EquipmentSection({ data }: { data: EquipmentData }) {
  const softwareRows: Row[] = [
    { label: "DSLRBooth", value: data.versionDslrbooth ? `v${data.versionDslrbooth}` : null },
    {
      label: "Cash Interface",
      value: data.versionCashInterface ? `v${data.versionCashInterface}` : null,
    },
  ];

  const hardwareRows: Row[] = [
    { label: "Appareil photo", value: data.serialAppareilPhoto ?? "—" },
    { label: "Numéro de série appareil", value: data.serialAppareilPhoto },
    { label: "Imprimante", value: "DNP DS620" },
    { label: "Numéro de série imprimante", value: data.serialImprimante },
    { label: "Statut imprimante", value: data.imprimanteStatut },
    { label: "Mode de coupe", value: data.modeCoupe },
    { label: "Réseau Wi-Fi", value: data.ssidWifi },
    {
      label: "Espace disque libre",
      value: data.disqueLibreGo !== null ? `${data.disqueLibreGo} Go` : null,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8 pt-12">
      <h2 className="text-[24px] font-semibold leading-8 text-foreground">Logiciels & Matériels</h2>

      <InfoTable title="Logiciels" rows={softwareRows} />
      <InfoTable title="Matériels" rows={hardwareRows} />

      <div className="h-px bg-border" />
    </div>
  );
}
