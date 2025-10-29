# BEST_PRACTICES.md

## Purpose & Scope

This guide captures the day-to-day decisions that make the filesystem in `docs/FILE_STRUCTURE.md` succeed. It covers routing, UI composition, data flow, and rollout sequencing so every feature ships predictably within the agreed structure.

## How to Use This Guide

- Pair each section with its counterpart in `docs/FILE_STRUCTURE.md`—shared headings make it easy to jump between structural rules and practical execution.
- Consult this file before kicking off a new feature, wiring data, or planning a refactor that might ripple through the route tree.
- Update both docs together whenever workflows change, new primitives become standard, or caching strategy evolves.

## Core Principles

- **Server-first mindset**: prefer Server Components and push mutations through server actions.
- **Validated contracts**: rely on colocated Zod schemas and shared types to align UI and data boundaries.
- **Design system fidelity**: build UI from shadcn/ui primitives, tailoring them with feature wrappers when needed.
- **Progressive rollout**: scale features in place, promoting code only after it proves reusable.

## Implementation Playbook

### Routing & Layouts

- Reference `docs/FILE_STRUCTURE.md` before scaffolding new segments so folder layout and naming stay canonical.
- Use nested `layout.tsx` files for shared chrome or data dependencies, especially when multiple child routes need the same providers or loaders.
- Place `loading.tsx` and `error.tsx` next to the owning `page.tsx` whenever you need custom suspense or route-level error boundaries.
- Organize the filesystem with route groups such as `(marketing)` or `(public)` without changing URLs.

### Component Strategy

- Prefer Server Components; add `"use client"` only when a leaf needs interactivity or browser APIs.
- Source UI from shadcn/ui primitives via `@/components/ui/*`, using the shadcn MCP helpers before introducing new primitives.
- Reach for Lucide icons first and colocate feature-specific icons until they earn promotion to `components/ui/icons`.
- Pull Tailwind tokens from `app/globals.css` to maintain typography, spacing, and color consistency.

### Server Actions & Data Flow

- Treat server actions as the mutation boundary: validate inputs with colocated Zod schemas, call shared helpers, and return typed responses for the UI.
- After mutations, trigger the appropriate invalidation primitive (for example `revalidatePath` or `revalidateTag`) so downstream server components see fresh data.
- Pair queries with the components that consume them, document caching behavior in the file header, and keep responses serializable for server components and actions alike.
- Even when a feature starts with mock data, structure `_queries/` and `_actions/` as if they already talk to durable storage: keep asynchronous signatures, surface domain-specific errors, and isolate persistence concerns behind server-only helpers so swapping in a real database is mostly configuration.

### Data Access Layer

- Keep feature-specific persistence logic colocated in `_queries/` and `_actions/`, but extract shared adapters (ORM clients, API SDK wrappers, transactional helpers) into `src/server/**` modules marked with `import "server-only";` so they never ship to the client bundle.
- Expose repository-style functions from `src/server` that model the domain (e.g., `getUserById`, `createInvoice`) and keep them asynchronous even when they wrap mock data. This preserves type contracts and makes the transition to a real database or edge store a swap of implementation details, not signatures.
- Centralize connection management (pool re-use, retries, tracing hooks) inside `src/server` and inject any per-request context from server actions, keeping React components free of driver concerns.
- Document data lifecycle assumptions (idempotency, caching tags, invalidation triggers) at the repository level so server actions can call the correct invalidation helper after mutations.
- Drive the contract from Zod schemas: parse inputs with `schema.parse` (or `safeParse`) and export `z.infer<typeof schema>` types for the rest of the stack so mock data and real persistence share identical shapes without refactors.

### Zod Usage

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

### Feature Rollout Sequence

1. Decide whether the feature belongs in `(public)` or `(protected)` and update navigation metadata accordingly.
2. Start with a server `page.tsx`; add a colocated `layout.tsx` only when the segment needs unique chrome or data providers. Treat `params` and `searchParams` as Promises (Next.js 15+); always `await` them before use.
3. Define the data contract early: create or update `_schemas/` with Zod objects, then reuse those types in forms, queries, and server actions.
4. Implement mutations and loaders next—co-locate `_actions/` and `_queries/`, document caching expectations, and wire invalidation before building UI.
5. Compose UI with shadcn/ui primitives inside `_components/`, leaning on tokens from `app/globals.css` so styling stays consistent.
6. Promote code to shared directories only after multiple routes need it, following the structure guardrails in `docs/FILE_STRUCTURE.md`.

### Component Composition

- Modularize components regardless of scope. Favor small, single-purpose files instead of exporting multiple components from one module.
- Break up large components when interactions can be scoped, and colocate the resulting pieces near the feature that owns them so context stays obvious.
- Define component props with `interface` declarations (not `type` aliases) to keep naming consistent and make extension via declaration merging possible when needed.
- Follow consistent naming in Next.js file-based exports: root layouts export `RootLayout` with matching `RootLayoutProps`, pages export `<SegmentName>Page` (e.g., `home/page.tsx` → `HomePage` with `HomePageProps`), and other components mirror their filename (`login-form.tsx` → `LoginForm` / `LoginFormProps`). Avoid inline prop typing—declare the interface above the component and reuse it for server actions or hooks when necessary.

## Quick Checklists

- **Before shipping a feature**: confirm schemas, actions, and queries live with the feature, test invalidation paths, and audit UI tokens against `app/globals.css`.
- **When adding new UI primitives**: search shadcn registries first, add via `pnpm dlx shadcn@latest add …`, wrap inside the feature, and document any shared usage expectations.

## Keep This Doc Current

Revise this file alongside `docs/FILE_STRUCTURE.md` whenever workflows, caching patterns, or component standards change so practice and structure remain in lockstep.
