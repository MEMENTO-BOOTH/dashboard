"use client";

import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";

export const BORNE_TYPE_VALUES = ["all", "active", "maintenance", "desactivee"] as const;
export type BorneTypeFilter = (typeof BORNE_TYPE_VALUES)[number];

export const BORNE_TYPE_LABELS: Record<BorneTypeFilter, string> = {
  all: "Toutes",
  active: "Actives",
  maintenance: "Maintenance",
  desactivee: "Désactivées",
};

export function useBorneFilters() {
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [type, setType] = useQueryState(
    "type",
    parseAsStringLiteral(BORNE_TYPE_VALUES).withDefault("all"),
  );
  return { q, setQ, type, setType };
}
