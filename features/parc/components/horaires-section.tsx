"use client";

import { Check, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { updateHoraires } from "@/features/bornes/actions";

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

type Horaire = {
  jour: number;
  ouverture: string;
  fermeture: string;
  ferme: boolean;
};

export function HorairesSection({
  borneId,
  initial,
  canEdit = false,
}: {
  borneId: string;
  initial: Horaire[];
  canEdit?: boolean;
}) {
  const [horaires, setHoraires] = useState<Horaire[]>(() => {
    const map = new Map(initial.map((h) => [h.jour, h]));
    return Array.from(
      { length: 7 },
      (_, i) =>
        map.get(i) ?? { jour: i, ouverture: "09:00:00", fermeture: "21:00:00", ferme: false },
    );
  });
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isDirty =
    JSON.stringify(horaires) !==
    JSON.stringify(
      (() => {
        const map = new Map(initial.map((h) => [h.jour, h]));
        return Array.from(
          { length: 7 },
          (_, i) =>
            map.get(i) ?? { jour: i, ouverture: "09:00:00", fermeture: "21:00:00", ferme: false },
        );
      })(),
    );

  function update(jour: number, field: keyof Horaire, value: string | boolean) {
    setHoraires((prev) => prev.map((h) => (h.jour === jour ? { ...h, [field]: value } : h)));
  }

  function onSave() {
    startTransition(async () => {
      await updateHoraires(borneId, horaires);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  function onCancel() {
    const map = new Map(initial.map((h) => [h.jour, h]));
    setHoraires(
      Array.from(
        { length: 7 },
        (_, i) =>
          map.get(i) ?? { jour: i, ouverture: "09:00:00", fermeture: "21:00:00", ferme: false },
      ),
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8 pt-12">
      <h2 className="text-[24px] font-semibold leading-8 text-foreground">Horaires</h2>

      <div className="overflow-clip rounded-[10px] border border-border">
        <div className="grid grid-cols-[100px_1fr_1fr_60px] sm:grid-cols-[140px_1fr_1fr_80px] items-center gap-4 border-b border-border bg-muted/50 px-6 py-3">
          <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
            Jour
          </span>
          <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
            Ouverture
          </span>
          <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
            Fermeture
          </span>
          <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
            Fermé
          </span>
        </div>
        {horaires.map((h) => (
          <div
            key={h.jour}
            className="grid grid-cols-[100px_1fr_1fr_60px] sm:grid-cols-[140px_1fr_1fr_80px] items-center gap-4 border-t border-border px-6 py-3 first:border-t-0"
          >
            <span className="text-[14px] font-medium leading-5 text-foreground">
              {JOURS[h.jour]}
            </span>
            <input
              type="time"
              value={h.ouverture.slice(0, 5)}
              disabled={h.ferme || !canEdit}
              onChange={(e) => update(h.jour, "ouverture", `${e.target.value}:00`)}
              className="h-9 rounded-[8px] border border-input bg-background px-3 text-[14px] font-normal leading-5 text-foreground shadow-xs outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <input
              type="time"
              value={h.fermeture.slice(0, 5)}
              disabled={h.ferme || !canEdit}
              onChange={(e) => update(h.jour, "fermeture", `${e.target.value}:00`)}
              className="h-9 rounded-[8px] border border-input bg-background px-3 text-[14px] font-normal leading-5 text-foreground shadow-xs outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                checked={h.ferme}
                onChange={(e) => update(h.jour, "ferme", e.target.checked)}
                disabled={!canEdit}
                className="size-4 rounded border border-input disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        ))}
      </div>

      {canEdit ? (
      <div className="flex justify-end gap-3">
        {isDirty ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="h-9 rounded-[8px] border border-border bg-background px-4 text-[14px] font-medium leading-5 text-foreground shadow-xs transition-colors hover:bg-accent"
          >
            Annuler
          </button>
        ) : null}
        <button
          type="button"
          onClick={onSave}
          disabled={!isDirty || isPending}
          className={`flex h-9 items-center gap-2 rounded-[8px] px-4 text-[14px] font-medium leading-5 transition-colors ${
            isDirty
              ? "bg-foreground text-background hover:bg-foreground/90"
              : "cursor-not-allowed bg-muted text-muted-foreground"
          }`}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : saved ? (
            <Check className="size-4" />
          ) : null}
          {saved ? "Enregistré" : "Enregistrer"}
        </button>
      </div>
      ) : null}

      <div className="h-px bg-border" />
    </div>
  );
}
