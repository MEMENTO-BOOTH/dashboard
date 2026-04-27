"use client";

import { Check, Loader2, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import type { Permission } from "@/features/auth/permissions";
import { createRole } from "../actions";
import { PERMISSIONS_CATALOG } from "../permissions-catalog";

export function RoleForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<Set<Permission>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function toggle(key: Permission) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleGroup(keys: Permission[], allSelected: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const k of keys) {
        if (allSelected) next.delete(k);
        else next.add(k);
      }
      return next;
    });
  }

  function reset() {
    setName("");
    setDescription("");
    setSelected(new Set());
  }

  function onSubmit() {
    if (name.trim().length < 2) {
      setError("Le nom doit comporter au moins 2 caractères");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await createRole({
        name: name.trim(),
        description: description.trim() || undefined,
        permissions: Array.from(selected),
      });
      if (!result.ok) {
        setError(result.error ?? "Erreur inconnue");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      reset();
    });
  }

  return (
    <div className="flex flex-col gap-6 rounded-[14px] border border-border bg-card p-6 shadow-xs">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[18px] font-semibold leading-7 text-card-foreground">
          Créer un rôle personnalisé
        </h2>
        <p className="text-[13px] font-normal leading-5 text-muted-foreground">
          Sélectionnez les permissions à accorder. Les rôles personnalisés peuvent ensuite être
          assignés aux membres de l'équipe.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-[14px] font-medium leading-5 text-foreground">Nom du rôle</span>
          <input
            type="text"
            placeholder="Ex: Partenaire senior"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10 rounded-[8px] border border-input bg-background px-3 text-[14px] font-normal leading-5 text-foreground shadow-xs outline-none focus:border-ring"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[14px] font-medium leading-5 text-foreground">Description</span>
          <input
            type="text"
            placeholder="À quoi sert ce rôle ?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-10 rounded-[8px] border border-input bg-background px-3 text-[14px] font-normal leading-5 text-foreground shadow-xs outline-none focus:border-ring"
          />
        </label>
      </div>

      <div className="h-px bg-border" />

      <div className="flex flex-col gap-6">
        {PERMISSIONS_CATALOG.map((group) => {
          const groupKeys = group.permissions.map((p) => p.key);
          const allSelected = groupKeys.every((k) => selected.has(k));
          return (
            <div key={group.title} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-semibold leading-5 text-foreground">{group.title}</p>
                <button
                  type="button"
                  onClick={() => toggleGroup(groupKeys, allSelected)}
                  className="text-[13px] font-medium leading-5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {allSelected ? "Tout décocher" : "Tout cocher"}
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {group.permissions.map((p) => {
                  const isChecked = selected.has(p.key);
                  return (
                    <label
                      key={p.key}
                      className="flex cursor-pointer items-start gap-3 rounded-[10px] border border-border bg-background px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(p.key)}
                        className="mt-0.5 size-4 rounded border border-input"
                      />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[14px] font-medium leading-5 text-foreground">
                          {p.label}
                        </span>
                        {p.description ? (
                          <span className="text-[13px] font-normal leading-5 text-muted-foreground">
                            {p.description}
                          </span>
                        ) : null}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {error ? (
        <p className="text-[13px] font-normal leading-5 text-destructive">{error}</p>
      ) : null}

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isPending || name.trim().length < 2}
          className="inline-flex items-center gap-2 rounded-[8px] bg-primary px-4 py-2 text-[14px] font-medium leading-5 text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : saved ? (
            <Check className="size-4" />
          ) : (
            <Plus className="size-4" />
          )}
          {saved ? "Créé" : "Créer le rôle"}
        </button>
      </div>
    </div>
  );
}
