import { Ellipsis, Eye, Store, Trash2 } from "lucide-react";
import { alertMeta, formatCA, formatRelativeActivity, papierColor } from "../lib/format";
import type { BorneTableRow } from "../schemas";
import { ProgressBar } from "./progress-bar";

// Figma 39543 — row h=56, columns: 49 + 350 + 160 + 160 + 160 + 200 + 110 = 1189px

export function TableRow({ row }: { row: BorneTableRow }) {
  const alert = row.alert ? alertMeta(row.alert) : null;
  const AlertIcon = alert?.icon;
  const percent =
    row.feuillesRestantes === null
      ? 0
      : Math.round((row.feuillesRestantes / row.feuillesMax) * 100);

  return (
    <div className="grid h-14 grid-cols-[49px_350px_160px_160px_160px_200px_110px] items-center border-t border-border">
      <div className="flex justify-center">
        <input
          type="checkbox"
          aria-label={`Select ${row.name}`}
          className="size-4 rounded border border-input"
        />
      </div>

      <div className="flex items-center gap-3 px-2">
        <div className="relative flex size-9 shrink-0 items-center justify-center overflow-clip rounded-full bg-muted text-muted-foreground">
          {row.logoUrl ? (
            // biome-ignore lint/performance/noImgElement: avatar
            <img src={row.logoUrl} alt="" className="absolute inset-0 size-full object-cover" />
          ) : (
            <Store className="size-[18px]" aria-hidden />
          )}
        </div>
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
        <span className="text-[14px] leading-5 text-muted-foreground">
          {formatRelativeActivity(row.lastActivityAt)}
        </span>
      </div>

      <div className="px-2">
        <span className="text-[14px] leading-5 text-foreground">{formatCA(row.caToday)}</span>
      </div>

      <div className="flex items-center gap-3 px-2">
        <div className="w-[134px]">
          <ProgressBar value={percent} color={papierColor(percent)} />
        </div>
        <span className="text-[14px] leading-5 text-foreground">{percent}%</span>
      </div>

      <div className="flex items-center gap-3 pl-4">
        <button
          type="button"
          aria-label="Delete"
          className="text-muted-foreground hover:text-foreground"
        >
          <Trash2 className="size-[18px]" />
        </button>
        <button
          type="button"
          aria-label="View"
          className="text-muted-foreground hover:text-foreground"
        >
          <Eye className="size-[18px]" />
        </button>
        <button
          type="button"
          aria-label="More"
          className="text-muted-foreground hover:text-foreground"
        >
          <Ellipsis className="size-[18px]" />
        </button>
      </div>
    </div>
  );
}
