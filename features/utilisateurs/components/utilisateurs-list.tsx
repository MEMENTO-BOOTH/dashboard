"use client";

import { KeyRound, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { type LayoutMode, LayoutToggle } from "@/components/ui/layout-toggle";
import { EquipeCard } from "../_parts/equipe-card";
import type { RoleOption } from "../_parts/role-select";
import type { Member } from "../schemas";

export function UtilisateursList({
  members,
  roles,
}: {
  members: Member[];
  roles: RoleOption[];
}) {
  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState<LayoutMode>("grid");

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return members;
    return members.filter(
      (m) => m.name.toLowerCase().includes(needle) || m.role.toLowerCase().includes(needle),
    );
  }, [members, search]);

  return (
    <div className="flex flex-col gap-8 pt-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-[24px] font-semibold leading-8 text-foreground">Utilisateurs</h1>
        <p className="text-[14px] font-normal leading-5 text-muted-foreground">
          Gérez les personnes ayant accès au dashboard et à l'agent sur les bornes.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex h-11 w-[420px] items-center gap-2 rounded-[8px] border border-input bg-background px-3 py-2.5 shadow-xs">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            aria-label="Rechercher"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-[14px] font-normal leading-5 text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-3">
          <LayoutToggle mode={layout} onChange={setLayout} />
          <Link
            href="/utilisateurs/roles"
            className="flex items-center justify-center gap-2 overflow-clip rounded-[10px] border border-primary bg-background px-4 py-2 text-[14px] font-medium leading-5 text-primary transition-colors hover:bg-accent"
          >
            <KeyRound className="size-4" />
            Rôles
          </Link>
        </div>
      </div>

      <EquipeCard members={filtered} layout={layout} roles={roles} />
    </div>
  );
}
