"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveColumnsAction } from "../actions";
import { type Column, type ColumnRole, ROLE_LABELS } from "../lib";

type Draft = {
  id?: string;
  name: string;
  role: ColumnRole;
  observationDays: number | null;
  position: number;
};

export function SettingsColumnsTab({ columns }: { columns: readonly Column[] }) {
  const [rows, setRows] = useState<Draft[]>(
    columns.map((c) => ({
      id: c.id,
      name: c.name,
      role: c.role,
      observationDays: c.observationDays,
      position: c.position,
    })),
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [isPending, setPending] = useState(false);

  function update(index: number, patch: Partial<Draft>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }
  function remove(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }
  function add() {
    setRows((prev) => [
      ...prev,
      { name: "Nouvelle colonne", role: "libre", observationDays: null, position: prev.length + 1 },
    ]);
  }

  async function save() {
    setPending(true);
    setErrors([]);
    const result = await saveColumnsAction({
      columns: rows.map((r, i) => ({ ...r, position: i + 1 })),
      moves: {},
    });
    setPending(false);
    if (!result.ok) setErrors(result.errors);
  }

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row, index) => (
        <div key={row.id ?? `new-${index}`} className="flex items-center gap-2">
          <Input
            value={row.name}
            onChange={(e) => update(index, { name: e.target.value })}
            className="w-40"
          />
          <Select value={row.role} onValueChange={(v) => update(index, { role: v as ColumnRole })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(ROLE_LABELS) as ColumnRole[]).map((role) => (
                <SelectItem key={role} value={role}>
                  {ROLE_LABELS[role]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {row.role === "observation" && (
            <Input
              type="number"
              min={1}
              max={60}
              value={row.observationDays ?? 7}
              onChange={(e) => update(index, { observationDays: Number(e.target.value) })}
              className="w-16"
            />
          )}
          <Button variant="ghost" size="sm" onClick={() => remove(index)}>
            Supprimer
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add} className="self-start">
        Ajouter une colonne
      </Button>
      {errors.length > 0 && (
        <ul className="text-xs text-destructive">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      <Button onClick={save} disabled={isPending} className="self-end">
        Enregistrer
      </Button>
    </div>
  );
}
