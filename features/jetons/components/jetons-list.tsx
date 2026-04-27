"use client";

import { CircleCheck, Clock, Loader2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { terminerJeton } from "../actions";
import type { Jeton } from "../api";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDeadline(iso: string, now: Date = new Date()): { label: string; overdue: boolean } {
  const target = new Date(iso).getTime();
  const diffMs = target - now.getTime();
  const overdue = diffMs < 0;
  const absMs = Math.abs(diffMs);
  const minutes = Math.round(absMs / 60000);
  if (minutes < 60) {
    return { label: overdue ? `en retard de ${minutes} min` : `dans ${minutes} min`, overdue };
  }
  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return { label: overdue ? `en retard de ${hours} h` : `dans ${hours} h`, overdue };
  }
  const days = Math.round(hours / 24);
  return { label: overdue ? `en retard de ${days} j` : `dans ${days} j`, overdue };
}

type Tab = "en-cours" | "terminees";

export function JetonsList({ jetons }: { jetons: Jeton[] }) {
  const [tab, setTab] = useState<Tab>("en-cours");

  const { enCours, terminees } = useMemo(() => {
    const enCours: Jeton[] = [];
    const terminees: Jeton[] = [];
    for (const j of jetons) {
      if (j.statut === "terminee") terminees.push(j);
      else if (j.statut === "en_cours") enCours.push(j);
    }
    return { enCours, terminees };
  }, [jetons]);

  const visible = tab === "en-cours" ? enCours : terminees;

  return (
    <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-8 pt-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-[24px] font-semibold leading-8 text-foreground">Mes jetons</h1>
        <p className="text-[14px] font-normal leading-5 text-muted-foreground">
          Les interventions qui vous sont assignées. Marquez-les comme terminées en ajoutant une
          note.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <TabButton active={tab === "en-cours"} onClick={() => setTab("en-cours")}>
          En cours ({enCours.length})
        </TabButton>
        <TabButton active={tab === "terminees"} onClick={() => setTab("terminees")}>
          Terminées ({terminees.length})
        </TabButton>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-[14px] border border-dashed border-border bg-card px-6 py-16 text-center">
          <p className="text-[14px] font-normal leading-5 text-muted-foreground">
            {tab === "en-cours" ? "Aucune intervention en cours." : "Aucune intervention terminée."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((j) => (
            <JetonCard key={j.id} jeton={j} />
          ))}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-[10px] px-4 py-2 text-[14px] font-medium leading-5 transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-background text-foreground hover:bg-accent"
      }`}
    >
      {children}
    </button>
  );
}

function JetonCard({ jeton }: { jeton: Jeton }) {
  const terminee = jeton.statut === "terminee";
  const deadline = jeton.deadline ? formatDeadline(jeton.deadline) : null;

  return (
    <div className="flex flex-col gap-4 rounded-[14px] border border-border bg-card p-6 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="truncate text-[16px] font-semibold leading-6 text-card-foreground">
            {jeton.type}
          </p>
          <p className="truncate text-[14px] font-normal leading-5 text-muted-foreground">
            {jeton.borneNom}
          </p>
        </div>
        <StatusBadge terminee={terminee} />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] font-normal leading-5 text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-4" />
          {formatDate(jeton.date)}
        </span>
        {!terminee && deadline ? (
          <span
            className={`inline-flex items-center gap-1.5 ${
              deadline.overdue ? "text-destructive" : "text-warning"
            }`}
          >
            <Clock className="size-4" />
            {deadline.label}
          </span>
        ) : null}
        {terminee && jeton.dureeMinutes !== null ? <span>{jeton.dureeMinutes} min</span> : null}
      </div>

      {jeton.description ? (
        <p className="whitespace-pre-wrap text-[14px] font-normal leading-5 text-foreground">
          {jeton.description}
        </p>
      ) : null}

      {terminee && jeton.commentaire ? (
        <div className="rounded-[10px] border border-border bg-muted/50 p-4">
          <p className="mb-1 text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
            Note de terminaison
          </p>
          <p className="whitespace-pre-wrap text-[14px] font-normal leading-5 text-foreground">
            {jeton.commentaire}
          </p>
        </div>
      ) : null}

      {!terminee ? <TerminerAction id={jeton.id} /> : null}
    </div>
  );
}

function StatusBadge({ terminee }: { terminee: boolean }) {
  return terminee ? (
    <span className="inline-flex items-center gap-2 rounded-[8px] bg-success/10 px-4 py-2 text-[14px] font-medium leading-5 text-success shadow-xs">
      <CircleCheck className="size-4" />
      Terminée
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 rounded-[8px] bg-warning/10 px-4 py-2 text-[14px] font-medium leading-5 text-warning shadow-xs">
      <Clock className="size-4" />
      En cours
    </span>
  );
}

function TerminerAction({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [duree, setDuree] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit() {
    const minutes = Number(duree);
    if (!Number.isFinite(minutes) || minutes <= 0) {
      setError("Durée invalide");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await terminerJeton(id, { dureeMinutes: minutes, note });
      if (!result.ok) {
        setError(result.error ?? "Erreur");
        return;
      }
      setOpen(false);
      setDuree("");
      setNote("");
    });
  }

  return (
    <>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-[8px] bg-primary px-4 py-2 text-[14px] font-medium leading-5 text-primary-foreground transition-opacity hover:opacity-90"
        >
          <CircleCheck className="size-4" />
          Terminer
        </button>
      </div>

      <DialogRoot open={open} onOpenChange={setOpen}>
        <DialogContent className="top-1/2 w-full max-w-[520px] -translate-y-1/2 gap-4 rounded-[14px] border border-border bg-background p-6 shadow-xl">
          <div className="flex flex-col gap-1.5">
            <DialogTitle className="text-[18px] font-semibold leading-7 text-foreground">
              Terminer l'intervention
            </DialogTitle>
            <DialogDescription className="text-[14px] font-normal leading-5 text-muted-foreground">
              Indiquez la durée et laissez éventuellement un mot.
            </DialogDescription>
          </div>

          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[14px] font-medium leading-5 text-foreground">
                Durée (minutes)
              </span>
              <input
                type="number"
                min={1}
                value={duree}
                onChange={(e) => setDuree(e.target.value)}
                className="h-10 rounded-[8px] border border-input bg-background px-3 text-[14px] font-normal leading-5 text-foreground shadow-xs outline-none focus:border-ring"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[14px] font-medium leading-5 text-foreground">
                Note (facultatif)
              </span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="rounded-[8px] border border-input bg-background px-3 py-2 text-[14px] font-normal leading-5 text-foreground shadow-xs outline-none focus:border-ring"
              />
            </label>
            {error ? (
              <p className="text-[13px] font-normal leading-5 text-destructive">{error}</p>
            ) : null}
          </div>

          <div className="flex items-center justify-end gap-2">
            <DialogClose
              disabled={isPending}
              className="rounded-[8px] border border-border bg-background px-4 py-2 text-[14px] font-medium leading-5 text-foreground shadow-xs transition-colors hover:bg-accent"
            >
              Annuler
            </DialogClose>
            <button
              type="button"
              onClick={onSubmit}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-[8px] bg-primary px-4 py-2 text-[14px] font-medium leading-5 text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Confirmer
            </button>
          </div>
        </DialogContent>
      </DialogRoot>
    </>
  );
}
