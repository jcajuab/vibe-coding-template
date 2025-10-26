# BEST_PRACTICES.md

Practical guidance for routing, data flow, and feature rollout. Follow these patterns alongside the structure rules in `FILE_STRUCTURE.md`.

## Routing

- Treat each folder under `app/` as a route segment; use nested `layout.tsx` for shared chrome or data.
- Place `loading.tsx` and `error.tsx` next to the relevant `page.tsx` when a route needs custom suspense or error handling.
- Use route groups such as `(marketing)` to organize the filesystem without changing URLs.

## Component Strategy

- Prefer Server Components; add `"use client"` only for leaves that require browser APIs or interactive state.
- Source UI from shadcn/ui primitives and rely on the shadcn MCP tools to discover or add components so the design system stays consistent.
- Use Lucide for icons before considering new assets, and keep icon files colocated with the feature unless promoted for reuse.
- Pull Tailwind tokens from `app/globals.css` to maintain visual consistency.

## Server Actions and Data

- Export every action from `_actions` with the `*.action.ts` suffix, validate inputs with the colocated schemas, and trigger revalidation as needed.
- Keep `_queries` server-only: start files with `import "server-only";`, name them `*.query.ts`, and return data ready for server components or actions.

## Zod Usage

- Keep schemas close to the consumer, export inferred types with `z.infer`, and compose shared shapes with `.extend()` or `.merge()`.
- Move schemas into `lib/validators` only when multiple features depend on the shared shape.

## Adding a Feature

1. Create the route folder inside the correct group such as `(public)` or `(protected)`.
2. Add `page.tsx` and an optional feature-specific `layout.tsx`.
3. Scaffold `_components`, `_actions`, `_queries`, `_hooks`, `_schemas`, and optional folders (`_constants`, `_tests`, `_data`) as soon as the first file is needed.
4. Wrap shadcn/ui primitives locally, use the shared helpers in `lib`, and promote code only after other features need it.
5. Update documentation when conventions change so `FILE_STRUCTURE.md` and this file stay in sync.

## Component Composition

- Modularize components regardless of scope. Favor small, single-purpose files over multiple components in one file.
- Break up large components when interactions can be scoped, and colocate the resulting pieces near the feature that owns them.
