import { TemplateRender, templateFullSchema } from "@/features/templates";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2.5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-right text-sm font-medium text-card-foreground">{value}</p>
    </div>
  );
}

export function TemplatePreview({ template }: { template: unknown }) {
  const parsed = templateFullSchema.safeParse(template);
  if (!parsed.success) return null;
  const data = parsed.data;

  return (
    <div className="flex gap-5 rounded-[14px] border border-border p-6 max-md:flex-col md:items-center">
      <div className="flex shrink-0 items-center justify-center">
        {data.elements.length > 0 ? (
          <TemplateRender template={data} />
        ) : (
          <div
            className="flex h-64 items-center justify-center rounded-md border border-dashed border-border bg-accent px-4 text-center text-xs text-muted-foreground"
            style={{ aspectRatio: `${data.width} / ${data.height}` }}
          >
            Pas encore de design
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-sm text-muted-foreground">Template du client</p>
        <p className="truncate text-base font-medium text-card-foreground">
          {data.name ?? "Template"}
        </p>
        <div className="flex flex-col gap-1.5 pt-1">
          <Row label="Format" value={`${data.width} × ${data.height} px`} />
          <Row label="Découpe" value={data.supportsCutOption ? "Disponible" : "Non"} />
        </div>
      </div>
    </div>
  );
}
