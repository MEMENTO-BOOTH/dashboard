"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveSettingsAction } from "../actions";
import type { Settings } from "../lib";

export function SettingsGeneralTab({ settings }: { settings: Settings }) {
  const [draft, setDraft] = useState(settings);
  const [isPending, setPending] = useState(false);

  async function save() {
    setPending(true);
    await saveSettingsAction(draft);
    setPending(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <Row
        label="Stagnation (colonnes « Libre »)"
        value={draft.stagnationDays}
        onChange={(v) => setDraft((d) => ({ ...d, stagnationDays: v }))}
      />
      <Row
        label="Archivage après clôture"
        value={draft.archiveDays}
        onChange={(v) => setDraft((d) => ({ ...d, archiveDays: v }))}
      />
      <Row
        label="Seuil de récurrence (épisodes)"
        value={draft.recurrenceThreshold}
        onChange={(v) => setDraft((d) => ({ ...d, recurrenceThreshold: v }))}
      />
      <Row
        label="Fenêtre de récidive (jours)"
        value={draft.recidiveWindowDays}
        onChange={(v) => setDraft((d) => ({ ...d, recidiveWindowDays: v }))}
      />
      <Button onClick={save} disabled={isPending} className="self-end">
        Enregistrer
      </Button>
    </div>
  );
}

function Row({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-foreground">{label}</p>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-20"
      />
    </div>
  );
}
