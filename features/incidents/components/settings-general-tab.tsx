"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveSettingsAction } from "../actions";
import type { Settings } from "../lib";

export function SettingsGeneralTab({
  settings,
  onClose,
}: {
  settings: Settings;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(settings);
  const [isPending, setPending] = useState(false);

  async function save() {
    setPending(true);
    try {
      await saveSettingsAction(draft);
      toast.success("Réglages enregistrés");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Enregistrement impossible.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col divide-y divide-border">
        <Setting
          title="Incident qui stagne"
          before="Bordure orange après"
          after="jours sans changer de colonne"
          hint="Concerne les colonnes de travail (rôle Libre)."
          value={draft.stagnationDays}
          min={1}
          max={60}
          onChange={(v) => setDraft((d) => ({ ...d, stagnationDays: v }))}
        />
        <Setting
          title="Archive"
          before="Archiver les incidents clôturés après"
          after="jours"
          hint="Ils restent consultables avec « Voir l'archive »."
          value={draft.archiveDays}
          min={1}
          max={365}
          onChange={(v) => setDraft((d) => ({ ...d, archiveDays: v }))}
        />
        <Setting
          title="Récurrence"
          before="Étiquette « Récurrent » à partir de"
          after={`épisodes en ${draft.recidiveWindowDays} jours sur la même borne`}
          value={draft.recurrenceThreshold}
          min={2}
          max={20}
          onChange={(v) => setDraft((d) => ({ ...d, recurrenceThreshold: v }))}
        />
        <Setting
          title="Fenêtre de récidive"
          before="Un signal qui revient moins de"
          after="jours après la clôture rouvre la même carte"
          value={draft.recidiveWindowDays}
          min={1}
          max={365}
          onChange={(v) => setDraft((d) => ({ ...d, recidiveWindowDays: v }))}
        />
      </div>
      <div className="flex justify-end gap-2 border-t border-input pt-3">
        <Button variant="ghost" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={save} disabled={isPending}>
          Enregistrer
        </Button>
      </div>
    </div>
  );
}

function Setting({
  title,
  before,
  after,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  title: string;
  before: string;
  after: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 py-3">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <div className="flex flex-wrap items-center gap-2 text-[13.5px] text-foreground/80">
        {before}
        <Input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          wrapperClassName="w-20 shrink-0"
        />
        {after}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
