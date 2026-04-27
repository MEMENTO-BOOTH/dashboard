"use client";

import { ListOrdered, X } from "lucide-react";
import { useMemo } from "react";
import {
  DialogClose,
  DialogContent,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RankingChart, type RankingRow } from "./borne-ranking-card";

export function BorneRankingAllDialog({
  title,
  rows,
  direction,
}: {
  title: string;
  rows: RankingRow[];
  direction: "desc" | "asc";
}) {
  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => (direction === "desc" ? b.value - a.value : a.value - b.value));
    return copy;
  }, [rows, direction]);

  const subtitle =
    direction === "desc" ? "Du meilleur au moins bon" : "Du plus faible au plus élevé";

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Voir tous les classements"
          title="Voir tous les classements"
          className="shrink-0 rounded-[6px] p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ListOrdered className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent
        style={{ width: "min(calc(100vw - 32px), 760px)", maxHeight: "82vh" }}
        className="top-[8%] overflow-hidden p-0"
      >
        <div className="flex max-h-[82vh] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
            <div className="flex flex-col gap-1">
              <DialogTitle className="text-[18px] font-semibold leading-7 text-foreground">
                {title}
              </DialogTitle>
              <p className="text-[14px] font-normal leading-5 text-muted-foreground">
                {subtitle} · {sorted.length} borne{sorted.length > 1 ? "s" : ""}
              </p>
            </div>
            <DialogClose
              aria-label="Fermer"
              className="shrink-0 rounded-[6px] p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="size-4" />
            </DialogClose>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <RankingChart rows={sorted} />
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
