# FILE_STRUCTURE.md

This project is built with the Next.js App Router, shadcn/ui primitives, and Zod validation. **Colocation is non-negotiable**: keep features inside the route segment that owns them, promote code only after multiple routes need it, and rely on clear naming so the tree stays predictable.

## Guiding Principles

- **Route-first organization**: Every feature lives inside its route segment under `app/`. Keep UI, data orchestration, and validation next to the page that uses them.
- **Shared vs feature scope**: Promote code to a shared directory (`components/ui`, `lib`, `hooks`) only after more than one feature needs it. Otherwise, keep it inside the route folder.
- **Consistent naming**: Use kebab-case for every file name (for example `login-form.tsx`, `submit-login.action.ts`, `list-users.query.ts`). Export React components in PascalCase, but keep filenames kebab-case.

Consult `docs/BEST_PRACTICES.md` for guidance on client vs. server boundaries, Zod workflows, and shadcn/ui usage that build on this structural baseline.

## Workspace Overview

- `package.json` · npm scripts and dependencies
- `components.json` · registry for shadcn/ui components
- `tsconfig.json` · path aliases (`@/*` → `src/*`)
- `public/` · static assets served by Next.js
- `docs/` · project documentation (this file lives here)
- `src/` · application code (details below)

## `src/` Directory Map

```text
src
├─ app/                     # Next.js App Router entry point
│  ├─ (public)/             # Routes that do not require auth
│  │  └─ auth/
│  │     └─ login/
│  │        ├─ page.tsx     # Server component entry
│  │        ├─ layout.tsx   # Optional nested layout
│  │        ├─ _components/ # Client leaves & presentational pieces
│  │        ├─ _actions/    # Server actions (*.action.ts)
│  │        ├─ _queries/    # Server-only data loaders (*.query.ts)
│  │        ├─ _hooks/      # Feature-scoped React hooks (client)
│  │        └─ _schemas/    # Zod schemas + inferred types
│  ├─ (protected)/          # Authenticated dashboards & tools
│  │  └─ dashboard/
│  │     ├─ page.tsx
│  │     ├─ layout.tsx
│  │     ├─ _components/
│  │     ├─ _actions/
│  │     ├─ _queries/
│  │     ├─ _hooks/
│  │     └─ _schemas/
│  ├─ globals.css           # Tailwind layers and tokens
│  └─ layout.tsx            # Root layout (server component)
├─ components/
│  └─ ui/                   # shadcn/ui primitives and shared wrappers
├─ hooks/                   # Cross-feature React hooks (client)
└─ lib/                     # Framework-agnostic helpers & shared schemas
```

## Common Feature Subfolders (`app/**/feature/*`)

- `_components/` · Client-only leaves (forms, buttons, charts) or small server components unique to the feature. Wrap shadcn/ui primitives here instead of editing upstream files.
- `_actions/` · Server actions for mutations. Name files with the `*.action.ts` suffix (for example `submit-login.action.ts`). Validate inputs with nearby Zod schemas before calling downstream services.
- `_queries/` · Server-only data loaders and helpers used by `page.tsx` or server actions. Name files with the `*.query.ts` suffix (for example `list-users.query.ts`) and include `import "server-only";` as the first statement to guarantee they never ship client-side.
- `_hooks/` · Feature-scoped React hooks. Keep them local unless reused elsewhere.
- `_schemas/` · Zod schemas, inferred types, and type-safe helpers for parsing inputs/outputs. Re-export types from here for components and server actions.
- Optional additions when the feature grows:
  - `_constants/` · Static configuration shared across the feature.
  - `_tests/` · Integration tests colocated with the feature when practical.
  - `loading.tsx`, `error.tsx` · Route-specific loading and error boundaries.

## `components/ui`: Shared Design System

- Generated via `pnpm dlx shadcn@latest add …`. Leave these primitives close to the upstream implementation.
- Create lightweight wrappers (for example `app/(protected)/dashboard/_components/data-card.tsx`) to bind domain-specific props instead of modifying the base components.

## `hooks`: Cross-Feature Utilities

- Holds hooks used in multiple routes (for example `use-mobile.ts`).
- Feature-specific hooks should stay in the feature’s `_hooks/` directory.

## `lib`: Reusable Logic & Validation

- General-purpose helpers (`utils.ts`, formatting utilities, URL builders) that do not depend on React specifics.
- Shared Zod schemas or schema factories. Use folders such as `lib/validators/` or `lib/server/` as the codebase grows.
- API clients or fetch wrappers that are consumed by multiple server actions.

Refer to `docs/BEST_PRACTICES.md` for routing conventions, server-action guidance, and feature rollout practices that complement this structure overview.
