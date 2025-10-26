# BEST_PRACTICES.md

Practical guidance for routing, data flow, and feature rollout. Use these patterns alongside the directory rules in `FILE_STRUCTURE.md` to keep every route predictable.

## Routing & Layouts

- Reference `docs/FILE_STRUCTURE.md` before scaffolding new segments so folder layout and naming stay canonical.
- Use nested `layout.tsx` files for shared chrome or data dependencies, especially when multiple child routes need the same providers or loaders.
- Place `loading.tsx` and `error.tsx` next to the owning `page.tsx` whenever you need custom suspense or route-level error boundaries.
- Use route groups such as `(marketing)` or `(public)` to organize the filesystem without changing URLs.

## Component Strategy

- Prefer Server Components; add `"use client"` only when a leaf needs interactivity or browser APIs.
- Source UI from shadcn/ui primitives via `@/components/ui/*`. Use the shadcn MCP helpers (`search_items_in_registries`, etc.) before introducing new primitives so the design system stays consistent.
- Reach for Lucide icons first and colocate feature-specific icons until they earn promotion to `components/ui/icons`.
- Pull Tailwind tokens from `app/globals.css` to maintain typography, spacing, and color consistency.

## Server Actions & Data Fetching

- Treat server actions as the mutation boundary: validate inputs with colocated Zod schemas, call shared helpers, and return typed responses for the UI.
- After mutations, trigger the correct invalidation primitive (`revalidatePath`, `revalidateTag`, or `cacheLife`/`cacheTag`) so downstream server components see fresh data.
- Pair queries with the components that consume them, document expected caching behavior in the file header, and keep responses serializable for server components and actions alike.

## Zod Usage

- Keep schemas close to the consumer and export inferred types so forms, queries, and actions share the same contract:

```ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginSchema = z.infer<typeof loginSchema>;
```

- Compose shared pieces with `.extend()` or `.merge()` instead of duplicating fields, and lift the composable base to `lib/validators/` only when more than one feature relies on it.

## Adding a Feature Route

1. Decide whether the feature belongs in `(public)` or `(protected)` and update navigation metadata accordingly.
2. Start with a server `page.tsx`; add a colocated `layout.tsx` only when the segment needs unique chrome or data providers.
3. Define the data contract early: create or update `_schemas/` with Zod objects, then reuse those types in forms, queries, and server actions.
4. Implement mutations and loaders next—co-locate `_actions/` and `_queries/`, document caching expectations, and wire invalidation before building UI.
5. Compose UI with shadcn/ui primitives inside `_components/`, leaning on tokens from `app/globals.css` so styling stays consistent.
6. Promote code to shared directories only after multiple routes need it, following the structure guardrails in `docs/FILE_STRUCTURE.md`.

## Component Composition

- Modularize components regardless of scope. Favor small, single-purpose files instead of exporting multiple components from one module.
- Break up large components when interactions can be scoped, and colocate the resulting pieces near the feature that owns them so context stays obvious.

Following these practices keeps the route tree in `docs/FILE_STRUCTURE.md` actionable, encourages co-location, and takes full advantage of the Next.js App Router model.
