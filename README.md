# Capsule Dashboard

Dashboard de supervision pour les bornes Memento Booth. Next.js 16 · React 19 · TypeScript strict · Tailwind v4 · shadcn/ui · Supabase.

## Quick start

```bash
cp .env.example .env.local
# remplir les variables Supabase
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Commandes

| Commande | Description |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Build production |
| `npm run check` | Lint + format + import sort (Biome) |
| `npm run check:ci` | Lint read-only (pour CI) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run validate` | Check + typecheck + build |

## Stack

- **Framework** — Next.js 16 (App Router, RSC, Server Actions)
- **UI** — React 19, Tailwind v4, shadcn/ui, Radix primitives, Lucide icons
- **Data** — Supabase (Postgres + Auth + Realtime), Zod pour validation
- **DX** — Biome (lint + format), Husky, lint-staged, commitlint

## Structure

Voir [AGENTS.md](./AGENTS.md) pour les conventions du projet.

```
app/              Routing (Server Components first)
features/         Domaines métier (bornes, transactions, alertes, …)
components/ui/    Primitives shadcn
components/layout/ Sidebar, Navbar, Shell
lib/              supabase/, env.ts, logger.ts, utils/
config/           site.ts, dashboard.ts
```

## Conventions

- **Conventional commits** enforced (feat, fix, chore, docs, refactor, …)
- **Max 150 lignes / fichier**, complexité cognitive ≤ 15 (Biome)
- **Validation Zod** aux frontières (env, Supabase, forms)
- **Pas de `any`**, pas de `@ts-ignore`
