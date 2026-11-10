"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { removeIgnoredSignalAction, saveSignalRuleAction } from "../actions";
import type { IncidentBorne } from "../api";
import { ORIGIN_LABELS, type Origin, type Priority, type SignalRule } from "../lib";

export function SettingsRulesTab({
  signalRules,
  ignoredSignals,
  bornes,
  onClose,
}: {
  signalRules: readonly SignalRule[];
  ignoredSignals: readonly string[];
  bornes: readonly IncidentBorne[];
  onClose: () => void;
}) {
  const [rows, setRows] = useState(signalRules.map((r) => ({ ...r })));
  const [ignored, setIgnored] = useState(ignoredSignals);
  const [isPending, setPending] = useState(false);
  const bornesById = new Map(bornes.map((b) => [b.id, b]));
  const ruleByType = new Map(signalRules.map((r) => [r.signalType, r]));

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
    toast.success("Règles enregistrées");
    onClose();
  }

  async function reactivate(key: string) {
    const [signalType, borneId] = key.split("|");
    if (!(signalType && borneId)) return;
    await removeIgnoredSignalAction(signalType, borneId);
    setIgnored((prev) => prev.filter((k) => k !== key));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex max-h-[52vh] flex-col gap-4 overflow-y-auto pr-1">
        <p className="text-xs text-muted-foreground">
          Quand le dashboard remonte un de ces signaux, l'incident est créé avec cette priorité et
          cette origine. Tu peux toujours les changer à la main ensuite.
        </p>
        <div className="overflow-hidden rounded-[10px] border border-input">
          <div className="grid grid-cols-[minmax(0,1fr)_7.5rem_10rem_7rem] gap-x-3 border-b border-input bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
            <span>Signal</span>
            <span>Priorité</span>
            <span>Origine probable</span>
            <span>Hors service</span>
          </div>
          {rows.map((row) => (
            <div
              key={row.signalType}
              className="grid grid-cols-[minmax(0,1fr)_7.5rem_10rem_7rem] items-center gap-x-3 border-b border-input px-3 py-1.5 last:border-b-0"
            >
              <Input
                value={row.label}
                onChange={(e) => update(row.signalType, { label: e.target.value })}
                wrapperClassName="min-w-0"
              />
              <Select
                value={String(row.defaultPriority)}
                onValueChange={(v) =>
                  update(row.signalType, { defaultPriority: Number(v) as Priority })
                }
              >
                <SelectTrigger className="w-full">
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
                <SelectTrigger className="w-full">
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
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  className="size-4"
                  checked={row.takesBorneDown}
                  onChange={(e) => update(row.signalType, { takesBorneDown: e.target.checked })}
                />
                Oui
              </label>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-foreground">Signaux ignorés</h3>
          {ignored.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Aucun signal ignoré. Tu peux en ajouter en classant un incident en fausse alerte.
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {ignored.map((key) => {
                const [signalType, borneId] = key.split("|");
                const rule = signalType ? ruleByType.get(signalType) : undefined;
                const borne = borneId ? bornesById.get(borneId) : undefined;
                return (
                  <li
                    key={key}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-input p-2 text-xs"
                  >
                    <span>
                      <b className="font-medium text-foreground">{rule?.label ?? signalType}</b> ·{" "}
                      <span className="font-mono">{borne?.code ?? borneId}</span> {borne?.nomLieu}
                    </span>
                    <Button size="sm" variant="outline" onClick={() => reactivate(key)}>
                      Réactiver
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
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
