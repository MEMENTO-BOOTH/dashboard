"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import type { Assignee } from "@/features/dashboard/alerts";
import type { IncidentBorne } from "../api";
import {
  defaultIncidentFilters,
  hasActiveFilters,
  type useIncidentFilters,
} from "../hooks/use-incident-filters";
import { ORIGIN_LABELS, PRIORITIES } from "../lib";

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
        placeholder="Borne, bar, ville ou incident"
        value={filters.q}
        onChange={(e) => setFilters({ q: e.target.value })}
        leftIcon={<Search />}
        wrapperClassName="w-72"
      />
      <Select
        value={filters.assignee || "all"}
        onValueChange={(v) => setFilters({ assignee: v === "all" ? "" : v })}
      >
        <SelectTrigger size="sm">
          <SelectValue placeholder="Tous les responsables" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les responsables</SelectItem>
          <SelectItem value="me">Mes incidents</SelectItem>
          <SelectItem value="none">Sans responsable</SelectItem>
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
      <Select
        value={filters.origin || "all"}
        onValueChange={(v) => setFilters({ origin: v === "all" ? "" : v })}
      >
        <SelectTrigger size="sm">
          <SelectValue placeholder="Toutes origines" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes origines</SelectItem>
          {Object.entries(ORIGIN_LABELS).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
      <Toggle
        pressed={filters.recurrent}
        onPressedChange={(v) => setFilters({ recurrent: v })}
        size="sm"
      >
        Récurrents
      </Toggle>
      <Toggle pressed={filters.serie} onPressedChange={(v) => setFilters({ serie: v })} size="sm">
        Série
      </Toggle>
      <Toggle
        pressed={filters.surplace}
        onPressedChange={(v) => setFilters({ surplace: v })}
        size="sm"
      >
        Sur place
      </Toggle>
      {hasActiveFilters(filters) && (
        <Button variant="link" size="sm" onClick={() => setFilters(defaultIncidentFilters)}>
          Effacer les filtres
        </Button>
      )}
    </div>
  );
}
