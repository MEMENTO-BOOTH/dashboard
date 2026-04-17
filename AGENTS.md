<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project conventions

## Stack

Next.js 16 (App Router, RSC) · React 19 · TypeScript 5 strict · Tailwind v4 · shadcn/ui · Supabase · Biome 2 · Zod.

## Folder structure

```
app/              Routing only (pages ≤ 30 lines, Server Components first)
features/         Business domains (bornes, transactions, alertes, …)
  <domain>/
    api/          Server functions (Supabase)
    schemas/      Zod schemas → inferred types
    hooks/        React hooks
    components/   UI métier
    lib/          Pure utils (testable)
    __tests__/
    index.ts      Public exports ONLY
components/
  ui/             shadcn primitives (no business logic, excluded from Biome)
  layout/         Sidebar, Navbar, Shell
  shared/         Cross-feature components
lib/
  supabase/       client.ts (browser), server.ts (RSC), types.ts (generated)
  utils/          cn.ts, format.ts, dates.ts
  env.ts          Zod-validated env
  logger.ts       Structured JSON logger
config/           site.ts, dashboard.ts (nav, constants)
styles/           fonts, globals
```

## Rules

1. **No dependencies between features.** Import via public `index.ts` only.
2. **Validate at boundaries** (Supabase, forms, API, env) with Zod.
3. **Max 150 lines per file** (Biome enforces).
4. **Max complexity 15** (Biome enforces).
5. **No `any`**, no `@ts-ignore`, no `value!` non-null assertion.
6. **Server Components by default.** Add `"use client"` only when needed.
7. **URL as state** for filters (nuqs). Zustand only if global client state truly needed.
8. **Conventional Commits** enforced by commitlint.

## Paths

```ts
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import { siteConfig } from "@/config/site";
```

## Commands

```
npm run dev          Start dev server
npm run check        Biome lint + format + import sort (write)
npm run check:ci     Biome read-only (CI)
npm run typecheck    tsc --noEmit
npm run validate     Full check: Biome + tsc + build
```

## Commit format

```
<type>: <description in lowercase>

Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
```
