"use client";

import type { LucideIcon } from "lucide-react";
import {
  Anchor,
  Award,
  BadgeCheck,
  BookOpen,
  Bot,
  Brain,
  Briefcase,
  Check,
  Clipboard,
  Code,
  Cog,
  Compass,
  Cpu,
  Crown,
  Database,
  Diamond,
  FileBadge,
  Flag,
  Gem,
  Glasses,
  Globe,
  GraduationCap,
  Hammer,
  Headphones,
  KeyRound,
  Landmark,
  Lightbulb,
  Loader2,
  Map,
  Medal,
  Microscope,
  Notebook,
  Palette,
  Pencil,
  Rocket,
  Scale,
  Server,
  Shield,
  ShieldCheck,
  Sparkles,
  Telescope,
  Terminal,
  Trash2,
  Trophy,
  UserCog,
  Wand,
  Wrench,
} from "lucide-react";
import { useTransition } from "react";
import type { Permission } from "@/features/auth/permissions";
import { deleteRole } from "../actions";
import { PERMISSIONS_CATALOG } from "../permissions-catalog";

export type RoleCardRole = {
  id: string;
  slug: string;
  name: string;
  description: string;
  permissions: Permission[];
};

// 50 icônes Lucide curatées — toutes pertinentes pour un contexte rôle/permission/métier.
// Pas d'icônes "alerte" ni d'objets random (cake, fish...).
const ICON_POOL: LucideIcon[] = [
  Anchor, Award, BadgeCheck, BookOpen, Bot, Brain, Briefcase, Clipboard, Code, Cog,
  Compass, Cpu, Database, Diamond, FileBadge, Flag, Gem, Glasses,
  Globe, GraduationCap, Hammer, Headphones, KeyRound, Landmark, Lightbulb, Map, Medal, Microscope,
  Notebook, Palette, Pencil, Rocket, Scale, Server, Shield, ShieldCheck, Sparkles,
  Telescope, Terminal, Trophy, UserCog, Wand, Wrench,
];

// FNV-1a 32-bit — meilleure dispersion que somme naïve, déterministe
function hashSlug(slug: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < slug.length; i++) {
    hash ^= slug.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function iconForRole(slug: string): LucideIcon {
  if (slug === "admin") return Crown;
  return ICON_POOL[hashSlug(slug) % ICON_POOL.length] ?? Sparkles;
}

export function RoleCard({
  role,
  variant,
}: {
  role: RoleCardRole;
  variant: "highlighted" | "normal";
}) {
  const granted = new Set(role.permissions);
  const RoleIcon = iconForRole(role.slug);
  const [isPending, startTransition] = useTransition();

  const isProtected = role.slug === "admin";
  const isHighlighted = variant === "highlighted";

  function onDelete() {
    startTransition(async () => {
      await deleteRole(role.id);
    });
  }

  return (
    <article
      className={`flex w-full max-w-[420px] flex-col gap-5 rounded-[14px] bg-card p-6 shadow-xs transition-shadow hover:shadow-sm ${
        isHighlighted ? "border-2 border-primary" : "border border-border"
      }`}
    >
      <header className="flex items-start gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-[10px] ${
            isHighlighted ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
          }`}
        >
          <RoleIcon className="size-5" strokeWidth={1.75} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="truncate text-[16px] font-semibold leading-6 text-card-foreground">
            {role.name}
          </h3>
          <p className="line-clamp-2 text-[13px] font-normal leading-5 text-muted-foreground">
            {role.description || "Aucune description"}
          </p>
        </div>
        {!isProtected ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={isPending}
            aria-label="Supprimer ce rôle"
            title="Supprimer ce rôle"
            className="flex size-8 shrink-0 items-center justify-center rounded-[8px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </button>
        ) : null}
      </header>

      <div className="h-px w-full bg-border" />

      {granted.size === 0 ? (
        <p className="text-[13px] font-normal leading-5 text-muted-foreground">
          Aucune permission accordée.
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {PERMISSIONS_CATALOG.flatMap((group) =>
            group.permissions
              .filter((p) => granted.has(p.key))
              .map((p) => (
                <li key={p.key} className="flex items-center gap-2">
                  <Check className="size-4 shrink-0 text-foreground" strokeWidth={2.5} />
                  <span className="text-[14px] font-normal leading-5 text-card-foreground">
                    {p.label}
                  </span>
                </li>
              )),
          )}
        </ul>
      )}
    </article>
  );
}
