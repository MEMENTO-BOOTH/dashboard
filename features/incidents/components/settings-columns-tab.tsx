"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
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
import { saveColumnsAction } from "../actions";
import { type Column, type ColumnRole, type Incident, ROLE_LABELS, validateColumns } from "../lib";

const ROLE_HELP: Record<ColumnRole, string> = {
  entree:
    "Reçoit tous les nouveaux incidents, automatiques ou créés à la main. Une seule, obligatoire.",
  libre: "Étape de travail sans automatisme. Une carte qui y stagne prend une bordure orange.",
  observation:
    "Lance un compte à rebours. Si le signal revient pendant ce délai, la carte retourne dans l'entrée.",
  cloture:
    "Incidents réglés. Ils passent dans l'archive après le délai choisi. Une seule, obligatoire.",
  rejete: "Fausses alertes. Possibilité d'ignorer le signal à l'avenir. Une seule, obligatoire.",
};

type Draft = {
  id?: string;
  name: string;
  role: ColumnRole;
  observationDays: number | null;
  position: number;
};

export function SettingsColumnsTab({
  columns,
  incidents,
  onClose,
}: {
  columns: readonly Column[];
  incidents: readonly Incident[];
  onClose: () => void;
}) {
  const [rows, setRows] = useState<Draft[]>(
    columns.map((c) => ({
      id: c.id,
      name: c.name,
      role: c.role,
      observationDays: c.observationDays,
      position: c.position,
    })),
  );
  const [moves, setMoves] = useState<Record<string, string>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saveErrors, setSaveErrors] = useState<string[]>([]);
  const [isPending, setPending] = useState(false);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const incident of incidents)
      map.set(incident.columnId, (map.get(incident.columnId) ?? 0) + 1);
    return map;
  }, [incidents]);

  const liveErrors = validateColumns(rows);

  function update(index: number, patch: Partial<Draft>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }
  function move(index: number, dir: -1 | 1) {
    setRows((prev) => {
      const j = index + dir;
      const a = prev[index];
      const b = prev[j];
      if (!(a && b)) return prev;
      const next = [...prev];
      next[index] = b;
      next[j] = a;
      return next;
    });
  }
  function add() {
    setRows((prev) => {
      const entryOrInsertIdx = prev.findLastIndex((r) => !["cloture", "rejete"].includes(r.role));
      const row: Draft = {
        name: "Nouvelle colonne",
        role: "libre",
        observationDays: null,
        position: prev.length + 1,
      };
      const next = [...prev];
      next.splice(entryOrInsertIdx + 1, 0, row);
      return next;
    });
  }
  function requestRemove(index: number) {
    const row = rows[index];
    if (!row?.id || (counts.get(row.id) ?? 0) === 0) {
      setRows((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    setDeletingId(row.id);
  }
  function confirmRemove(id: string, targetId: string) {
    setMoves((prev) => ({ ...prev, [id]: targetId }));
    setRows((prev) => prev.filter((r) => r.id !== id));
    setDeletingId(null);
  }

  async function save() {
    setPending(true);
    setSaveErrors([]);
    const result = await saveColumnsAction({
      columns: rows.map((r, i) => ({ ...r, position: i + 1 })),
      moves,
    });
    setPending(false);
    if (!result.ok) {
      setSaveErrors(result.errors);
      return;
    }
    toast.success("Paramètres enregistrés");
    onClose();
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex max-h-[52vh] flex-col gap-3 overflow-y-auto pr-1">
        <p className="text-xs text-muted-foreground">
          Renomme, réordonne, ajoute ou supprime des colonnes. Le rôle dit au tableau ce que fait
          chaque colonne.
        </p>
        <div className="flex flex-col gap-2">
          {rows.map((row, index) => (
            <div
              key={row.id ?? `new-${index}`}
              className="flex flex-col gap-1.5 rounded-[10px] border border-input bg-background p-2"
            >
              <div className="flex items-center gap-2">
                <div className="flex shrink-0 flex-col">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    className="text-muted-foreground disabled:opacity-30"
                    aria-label="Monter la colonne"
                  >
                    <ArrowUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === rows.length - 1}
                    onClick={() => move(index, 1)}
                    className="text-muted-foreground disabled:opacity-30"
                    aria-label="Descendre la colonne"
                  >
                    <ArrowDown className="size-3.5" />
                  </button>
                </div>
                <Input
                  value={row.name}
                  maxLength={40}
                  onChange={(e) => update(index, { name: e.target.value })}
                  wrapperClassName="min-w-0 flex-1"
                />
                <Select
                  value={row.role}
                  onValueChange={(v) => update(index, { role: v as ColumnRole })}
                >
                  <SelectTrigger className="w-40 shrink-0">
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
                    wrapperClassName="w-20 shrink-0"
                  />
                )}
                <span className="w-20 shrink-0 text-right text-xs whitespace-nowrap text-muted-foreground tabular-nums">
                  {row.id ? (counts.get(row.id) ?? 0) : 0} incidents
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => requestRemove(index)}
                  aria-label="Supprimer la colonne"
                  className="shrink-0"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              {deletingId === row.id && row.id && (
                <DeleteConfirmRow
                  others={rows.filter((r) => r.id && r.id !== row.id)}
                  onCancel={() => setDeletingId(null)}
                  onConfirm={(targetId) => confirmRemove(row.id as string, targetId)}
                />
              )}
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={add}
          disabled={rows.length >= 8}
          className="self-start"
        >
          Ajouter une colonne
        </Button>

        <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1.5 rounded-md bg-muted/40 p-3 text-xs">
          {(Object.keys(ROLE_LABELS) as ColumnRole[]).map((role) => (
            <Fragment key={role}>
              <dt className="font-semibold text-foreground">{ROLE_LABELS[role]}</dt>
              <dd className="text-muted-foreground">{ROLE_HELP[role]}</dd>
            </Fragment>
          ))}
        </dl>
      </div>

      {(liveErrors.length > 0 || saveErrors.length > 0) && (
        <ul className="list-disc rounded-md bg-destructive/10 px-3 py-2 pl-7 text-xs text-destructive">
          {[...new Set([...liveErrors, ...saveErrors])].map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      <div className="flex justify-end gap-2 border-t border-input pt-3">
        <Button variant="ghost" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={save} disabled={isPending || liveErrors.length > 0}>
          Enregistrer
        </Button>
      </div>
    </div>
  );
}

function DeleteConfirmRow({
  others,
  onCancel,
  onConfirm,
}: {
  others: Draft[];
  onCancel: () => void;
  onConfirm: (targetId: string) => void;
}) {
  const [target, setTarget] = useState(others[0]?.id ?? "");
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md bg-amber-500/10 p-2 text-xs text-amber-700 dark:text-amber-400">
      <span>Ses incidents iront dans</span>
      <Select value={target} onValueChange={setTarget}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {others.map((o) => (
            <SelectItem key={o.id} value={o.id as string}>
              {o.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm" variant="ghost" onClick={onCancel}>
        Annuler
      </Button>
      <Button size="sm" variant="destructive" onClick={() => target && onConfirm(target)}>
        Supprimer la colonne
      </Button>
    </div>
  );
}
