"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Assignee } from "@/features/dashboard/alerts";
import type { IncidentBorne } from "../api";
import type { useIncidentFilters } from "../hooks/use-incident-filters";
import { PRIORITIES } from "../lib";

export function BoardFilters({
  filters,
  setFilters,
  bornes,
  assignees,
}: ReturnType<typeof useIncidentFilters> & {
  bornes: readonly IncidentBorne[];
  assignees: readonly Assignee[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="Rechercher un titre ou une borne…"
        value={filters.q}
        onChange={(e) => setFilters({ q: e.target.value })}
        className="h-8 w-56"
      />
      <Select
        value={filters.borne || "all"}
        onValueChange={(v) => setFilters({ borne: v === "all" ? "" : v })}
      >
        <SelectTrigger size="sm">
          <SelectValue placeholder="Toutes les bornes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les bornes</SelectItem>
          {bornes.map((b) => (
            <SelectItem key={b.id} value={b.id}>
              {b.code} · {b.nomLieu}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.assignee || "all"}
        onValueChange={(v) => setFilters({ assignee: v === "all" ? "" : v })}
      >
        <SelectTrigger size="sm">
          <SelectValue placeholder="Tous les responsables" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les responsables</SelectItem>
          <SelectItem value="none">Non attribué</SelectItem>
          {assignees.map((a) => (
            <SelectItem key={a.id} value={a.id}>
              {a.nom}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.priority[0]?.toString() ?? "all"}
        onValueChange={(v) => setFilters({ priority: v === "all" ? [] : [Number(v)] })}
      >
        <SelectTrigger size="sm">
          <SelectValue placeholder="Toutes priorités" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes priorités</SelectItem>
          {Object.entries(PRIORITIES).map(([value, { name }]) => (
            <SelectItem key={value} value={value}>
              P{value} · {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
