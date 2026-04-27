"use client";

import { CircleCheck, Eye, PowerOff, WifiOff, Wrench, X } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import {
  DialogClose,
  DialogContent,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import { fetchBorneSummary } from "../actions";
import type { BorneSummary } from "../summary-api";

function formatEUR(n: number): string {
  return `${Math.round(n).toLocaleString("fr-FR")} €`;
}

function formatStatut(s: string): string {
  if (s === "active") return "Active";
  if (s === "maintenance") return "En maintenance";
  return "Désactivée";
}

function formatRelative(iso: string | null): string {
  if (!iso) return "aucune activité";
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.round(diffMs / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.round(h / 24);
  return `il y a ${d} j`;
}

export function BorneSummaryDialog({
  id,
  name,
  logoUrl,
}: {
  id: string;
  name: string;
  logoUrl: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<BorneSummary | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next && !data) {
      startTransition(async () => {
        const result = await fetchBorneSummary(id);
        setData(result);
      });
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Voir le résumé"
          title="Voir le résumé"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <Eye className="size-[18px]" />
        </button>
      </DialogTrigger>
      <DialogContent
        style={{ width: "min(calc(100vw - 32px), 860px)", maxHeight: "88vh" }}
        className="top-1/2 -translate-y-1/2 overflow-hidden rounded-[14px] border border-border bg-background p-0 shadow-xl"
      >
        <div className="flex max-h-[88vh] flex-col">
          <Header name={name} logoUrl={logoUrl} data={data} />
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-8 py-8">
            {isPending || !data ? <SkeletonBody /> : <Body data={data} />}
          </div>
          <Footer id={id} />
        </div>
      </DialogContent>
    </DialogRoot>
  );
}

function Header({
  name,
  logoUrl,
  data,
}: {
  name: string;
  logoUrl: string | null;
  data: BorneSummary | null;
}) {
  const hint = data
    ? data.lastActivityAt
      ? `Dernière activité ${formatRelative(data.lastActivityAt)}`
      : "Aucune activité enregistrée"
    : "";
  const badge = data
    ? data.isOffline
      ? { label: "Hors ligne", Icon: WifiOff, tone: "destructive" as const, hint }
      : data.statut === "active"
        ? { label: "Active", Icon: CircleCheck, tone: "success" as const, hint }
        : data.statut === "maintenance"
          ? { label: "En maintenance", Icon: Wrench, tone: "warning" as const, hint }
          : { label: formatStatut(data.statut), Icon: PowerOff, tone: "muted" as const, hint }
    : null;

  const toneClass = badge
    ? badge.tone === "success"
      ? "bg-success/10 text-success"
      : badge.tone === "warning"
        ? "bg-warning/10 text-warning"
        : badge.tone === "destructive"
          ? "bg-destructive/10 text-destructive"
          : "bg-muted text-muted-foreground"
    : "";

  return (
    <div className="relative flex items-center gap-4 border-b border-border bg-background px-8 py-6">
      <InitialsAvatar
        name={name}
        logoUrl={logoUrl}
        className="size-14 shrink-0 rounded-full border border-border bg-muted text-[18px] text-foreground"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <DialogTitle className="truncate text-xl font-semibold leading-7 text-foreground">
          {name}
        </DialogTitle>
        {badge ? (
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-[8px] px-4 py-2 text-[14px] font-medium leading-5 shadow-xs ${toneClass}`}
            >
              <badge.Icon className="size-4" />
              {badge.label}
            </span>
            <span className="truncate text-xs font-normal leading-4 text-muted-foreground">
              · {badge.hint}
            </span>
          </div>
        ) : (
          <p className="text-sm font-normal leading-5 text-muted-foreground">Chargement…</p>
        )}
      </div>
      <DialogClose
        aria-label="Fermer"
        className="shrink-0 rounded-[8px] p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <X className="size-4" />
      </DialogClose>
    </div>
  );
}

function Body({ data }: { data: BorneSummary }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      <PaperDonutCard sheets={data.feuillesRestantes} max={data.feuillesMax} />
      <WeeklyBarsCard rows={data.dailyCa7d} total={data.caWeek} />
    </div>
  );
}

function PaperDonutCard({ sheets, max }: { sheets: number | null; max: number }) {
  const value = sheets ?? 0;
  const pct = sheets === null ? 0 : Math.min(100, Math.round((value / max) * 100));

  return (
    <div className="flex flex-col items-start gap-4 rounded-[14px] border border-border bg-card p-6">
      <p className="text-[14px] font-semibold leading-5 text-foreground">Papier restant</p>
      <div className="flex w-full flex-1 items-center justify-center py-2">
        <Donut
          percent={pct}
          size={180}
          stroke={18}
          centerTop={`${value}`}
          centerBottom={`/ ${max}`}
        />
      </div>
      <p className="w-full text-center text-[13px] font-normal leading-5 text-muted-foreground">
        {sheets === null ? "Aucun heartbeat" : `${pct}% de la capacité`}
      </p>
    </div>
  );
}

function Donut({
  percent,
  size,
  stroke,
  centerTop,
  centerBottom,
}: {
  percent: number;
  size: number;
  stroke: number;
  centerTop: string;
  centerBottom: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (percent / 100) * c;
  const gap = c - dash;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${gap}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="text-primary"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[28px] font-semibold leading-9 text-foreground tabular-nums">
          {centerTop}
        </span>
        <span className="text-[13px] font-normal leading-5 text-muted-foreground tabular-nums">
          {centerBottom}
        </span>
      </div>
    </div>
  );
}

function WeeklyBarsCard({ rows, total }: { rows: { label: string; ca: number }[]; total: number }) {
  const max = Math.max(...rows.map((r) => r.ca), 1);
  const maxIdx = rows.reduce((acc, r, i) => (r.ca === max && r.ca > 0 ? i : acc), -1);

  return (
    <div className="flex flex-col gap-5 rounded-[14px] border border-border bg-card p-6">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[14px] font-semibold leading-5 text-foreground">Chiffre d'affaires</p>
          <p className="text-[12px] font-normal leading-4 text-muted-foreground">
            7 derniers jours
          </p>
        </div>
        <p className="text-[20px] font-semibold leading-7 text-foreground tabular-nums">
          {formatEUR(total)}
        </p>
      </div>
      <div className="flex h-[200px] w-full items-end gap-[14px]">
        {rows.map((r, i) => {
          const height = Math.max(4, (r.ca / max) * 180);
          const isMax = i === maxIdx;
          return (
            <div
              key={`${r.label}-${i.toString()}`}
              className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
            >
              <p className="w-full truncate text-center text-[13px] font-semibold leading-5 text-card-foreground tabular-nums">
                {r.ca > 0 ? formatEUR(r.ca) : "—"}
              </p>
              <div
                className={`w-full rounded-[10px] ${isMax ? "bg-primary" : "bg-primary/20"}`}
                style={{ height }}
              />
              <p className="w-full text-center text-[13px] font-normal leading-5 text-muted-foreground">
                {r.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SkeletonBody() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      <div className="flex h-[320px] animate-pulse flex-col gap-4 rounded-[14px] border border-border bg-card p-6">
        <div className="h-4 w-28 rounded bg-muted" />
        <div className="flex flex-1 items-center justify-center">
          <div className="size-[180px] rounded-full bg-muted" />
        </div>
      </div>
      <div className="flex h-[320px] animate-pulse flex-col gap-4 rounded-[14px] border border-border bg-card p-6">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="flex-1 rounded bg-muted" />
      </div>
    </div>
  );
}

function Footer({ id }: { id: string }) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-border px-8 py-4">
      <DialogClose className="rounded-[8px] border border-border bg-background px-4 py-2 text-[14px] font-medium text-foreground shadow-xs transition-colors hover:bg-accent">
        Fermer
      </DialogClose>
      <Link
        href={`/parc/bornes/${id}`}
        className="rounded-[8px] bg-primary px-4 py-2 text-[14px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Voir la borne
      </Link>
    </div>
  );
}
