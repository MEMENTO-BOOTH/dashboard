# Features

Chaque dossier = un domaine métier autonome.

## Structure standard

```
features/<domaine>/
├── api/            Server functions (fetch Supabase, mutations)
├── schemas/        Zod schemas + types inférés
├── hooks/          React hooks (TanStack Query, state)
├── components/     UI métier
├── lib/            Utils pures testables
├── __tests__/      Tests unitaires
└── index.ts        Exports publics (seule porte d'entrée)
```

## Règles

1. **Jamais de dépendance entre features.** Si `transactions` a besoin d'un user,
   elle l'importe via `@/features/auth`, pas via un chemin interne.
2. **Exports publics uniquement via `index.ts`.** Le reste est privé.
3. **Validation Zod aux frontières** (Supabase, forms, API).
4. **Max 150 lignes par fichier** (règle Biome).
5. **Tests unitaires sur `lib/`** (fonctions pures).
