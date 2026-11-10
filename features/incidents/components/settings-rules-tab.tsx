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
import { saveSignalRuleAction } from "../actions";
import { ORIGIN_LABELS, type Origin, type Priority, type SignalRule } from "../lib";

export function SettingsRulesTab({ signalRules }: { signalRules: readonly SignalRule[] }) {
  const [rows, setRows] = useState(signalRules.map((r) => ({ ...r })));
  const [isPending, setPending] = useState(false);

  function update(signalType: string, patch: Partial<SignalRule>) {
    setRows((prev) => prev.map((r) => (r.signalType === signalType ? { ...r, ...patch } : r)));
  }

  async function save() {
    setPending(true);
    for (const row of rows) {
      await saveSignalRuleAction({
        signalType: row.signalType,
        label: row.label,
        defaultPriority: row.defaultPriority,
        defaultOrigin: row.defaultOrigin,
        takesBorneDown: row.takesBorneDown,
      });
    }
    setPending(false);
  }

  return (
    <div className="flex max-h-96 flex-col gap-2 overflow-y-auto">
      {rows.map((row) => (
        <div
          key={row.signalType}
          className="flex flex-wrap items-center gap-2 border-b border-input pb-2"
        >
          <Input
            value={row.label}
            onChange={(e) => update(row.signalType, { label: e.target.value })}
            className="w-48"
          />
          <Select
            value={String(row.defaultPriority)}
            onValueChange={(v) =>
              update(row.signalType, { defaultPriority: Number(v) as Priority })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((p) => (
                <SelectItem key={p} value={String(p)}>
                  P{p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={row.defaultOrigin}
            onValueChange={(v) => update(row.signalType, { defaultOrigin: v as Origin })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(ORIGIN_LABELS) as [Origin, string][]).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <label className="flex items-center gap-1 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={row.takesBorneDown}
              onChange={(e) => update(row.signalType, { takesBorneDown: e.target.checked })}
            />
            Hors service
          </label>
        </div>
      ))}
      <Button onClick={save} disabled={isPending} className="mt-2 self-end">
        Enregistrer
      </Button>
    </div>
  );
}
