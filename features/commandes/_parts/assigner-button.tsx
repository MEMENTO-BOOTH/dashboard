"use client";

import { Cpu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogRoot, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { KapsuleRow } from "@/features/kapsules";
import { cn } from "@/lib/utils/cn";
import { assignerBorne } from "../actions";

export function AssignerButton({ orderId, bornes }: { orderId: string; bornes: KapsuleRow[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const libres = bornes
    .filter((borne) => !(borne.assignedOrderId || borne.revoked))
    .sort((a, b) => Number(b.online) - Number(a.online));

  function pick(kapsuleId: string) {
    startTransition(async () => {
      await assignerBorne(orderId, kapsuleId);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <DialogRoot open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-auto py-2 shadow-none">
          Assigner
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[420px] gap-0 overflow-hidden rounded-[14px] p-0">
        <div className="flex flex-col gap-1 px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-semibold text-card-foreground">
            Choisir une borne
          </DialogTitle>
          <span className="text-sm text-muted-foreground">
            {libres.length} borne{libres.length > 1 ? "s" : ""} disponible
            {libres.length > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex flex-col gap-2 px-6 pb-6">
          {libres.length === 0 ? (
            <p className="rounded-[12px] border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
              Aucune borne libre disponible.
            </p>
          ) : null}
          {libres.map((borne) => (
            <button
              key={borne.id}
              type="button"
              disabled={pending}
              onClick={() => pick(borne.id)}
              className="flex items-center justify-between gap-3 rounded-[12px] border border-border px-3 py-3 text-left transition-colors hover:border-foreground/30 hover:bg-muted disabled:opacity-50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-primary text-primary-foreground">
                  <Cpu className="size-5" />
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-semibold text-card-foreground">{borne.label}</span>
                  <span className="text-xs text-muted-foreground">
                    Version {borne.appVersion ?? "—"}
                  </span>
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <span
                  className={cn(
                    "size-2 rounded-full",
                    borne.online ? "bg-foreground" : "bg-border",
                  )}
                />
                {borne.online ? "En ligne" : "Hors ligne"}
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
