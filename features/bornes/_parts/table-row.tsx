import { InitialsAvatar } from "@/components/ui/initials-avatar";
import { alertMeta, formatCA, formatRelativeActivity, papierColor } from "../lib/format";
import type { BorneTableRow } from "../schemas";
import { BorneSummaryDialog } from "./borne-summary-dialog";
import { ProgressBar } from "./progress-bar";

// Figma 39543 — row h=56, columns: 49 + 350 + 160 + 160 + 160 + 200 + 110 = 1189px

const GRID_WITH_CA = "49px minmax(350px,1fr) 160px 160px 160px 200px 80px";
const GRID_WITHOUT_CA = "49px minmax(350px,1fr) 160px 160px 200px 80px";

export function TableRow({ row, showCa = true }: { row: BorneTableRow; showCa?: boolean }) {
  const alert = row.alert ? alertMeta(row.alert) : null;
  const AlertIcon = alert?.icon;
  const percent =
    row.feuillesRestantes === null
      ? 0
      : Math.round((row.feuillesRestantes / row.feuillesMax) * 100);

  return (
    <div
      className="grid h-14 items-center gap-x-3 border-t border-border"
      style={{ gridTemplateColumns: showCa ? GRID_WITH_CA : GRID_WITHOUT_CA }}
    >
      <div className="flex justify-center">
        <input
          type="checkbox"
          aria-label={`Select ${row.name}`}
          className="size-4 rounded border border-input"
        />
      </div>

      <div className="flex items-center gap-3 px-2">
        <InitialsAvatar
          name={row.name}
          logoUrl={row.logoUrl}
          className="size-9 rounded-full text-[13px]"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate text-[14px] font-medium leading-5 text-foreground">{row.name}</p>
          <p className="truncate text-[14px] font-normal leading-5 text-muted-foreground">
            {row.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-2">
        {alert && AlertIcon ? (
          <>
            <AlertIcon className="size-4 shrink-0 text-foreground" />
            <span className="text-[14px] leading-5 text-foreground">{alert.label}</span>
          </>
        ) : (
          <span className="text-[14px] leading-5 text-foreground">-</span>
        )}
      </div>

      <div className="px-2">
        <span className="text-[14px] leading-5 text-muted-foreground" suppressHydrationWarning>
          {formatRelativeActivity(row.lastActivityAt)}
        </span>
      </div>

      {showCa ? (
        <div className="px-2">
          <span className="text-[14px] leading-5 text-foreground">{formatCA(row.caToday)}</span>
        </div>
      ) : null}

      <div className="flex items-center gap-3 px-2">
        <div className="w-[134px]">
          <ProgressBar value={percent} color={papierColor(percent)} />
        </div>
        <span className="text-[14px] leading-5 text-foreground">{percent}%</span>
      </div>

      <div className="flex items-center gap-3 pl-4">
        <BorneSummaryDialog id={row.id} name={row.name} logoUrl={row.logoUrl} />
      </div>
    </div>
  );
}
