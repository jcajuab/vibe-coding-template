# FILE_STRUCTURE.md

## Purpose & Scope

This guide defines the canonical filesystem layout for the Next.js App Router stack in this repo. It enforces strict colocation so every route segment owns its UI, data orchestration, and validation until multiple segments need promotion. Treat these rules as the baseline that `docs/BEST_PRACTICES.md` builds upon.

## How to Use This Guide

- Read this file whenever you scaffold a new segment or reorganize feature code.
- Cross-check `docs/BEST_PRACTICES.md` after each section—the two documents share the same outline so you can move between structure and workflow guidance line by line.
- Update both docs together if you change folder conventions or introduce new shared directories.

## Core Principles

- **Route-first organization**: every feature lives inside its owning segment under `app/`.
- **Colocation before promotion**: keep logic, schemas, and UI in the feature until more than one route requires them.
- **Predictable naming**: use kebab-case filenames (`login-form.tsx`, `submit-login.action.ts`) and export React components in PascalCase.
- **Shallow shared surface**: only `components/ui`, `hooks`, `lib`, and `server` host code that multiple features actively consume.

## Implementation Playbook

### Workspace Layout

- `package.json` · scripts and dependency manifest.
- `components.json` · shadcn/ui registry.
- `tsconfig.json` · path aliases (`@/*` → `src/*`).
- `public/` · static assets.
- `docs/` · project documentation (this file lives here).
- `src/` · application code (detailed below).
- `proxy.ts` (optional) · edge proxy that replaces legacy `middleware.ts` for request rewriting and header mutation.
- `instrumentation.ts` (optional) · server start hooks for tracing and monitoring setup.

```text
src
├─ app/                     # Next.js App Router entry point
│  ├─ api/                  # Route handlers (request-time only)
│  │  └─ users/
│  │     └─ route.ts
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
├─ lib/                     # Framework-agnostic, client-safe helpers & shared schemas
└─ server/                  # Shared server-only modules (repositories, adapters)
```

### Feature Module Anatomy (`app/**/feature/*`)

- `_components/` · client leaves (forms, charts) or small server components unique to the feature. Wrap shadcn/ui primitives here instead of editing upstream files and host route-level shells like `DashboardShell` or `DashboardSidebar` so layouts stay thin.
- `_actions/` · server actions for mutations. Name files with the `*.action.ts` suffix and validate inputs with colocated Zod schemas before invoking downstream services.
- `_queries/` · server-only data loaders consumed by `page.tsx` or server actions. Name files with the `*.query.ts` suffix and include `import "server-only";` as the first statement.
- `_hooks/` · feature-scoped React hooks. Promote to `hooks/` only when multiple segments share them.
- `_schemas/` · Zod schemas, inferred types, and helper utilities. Re-export types for UI and server actions.

### Route Handlers (`app/api/**/route.ts`)

- Keep all HTTP handlers under `app/api`, one folder per resource. Co-locate supporting tests or fixtures next to the handler when they only apply to that route.
- Use file-based conventions (`route.ts`) and export HTTP verb functions (`GET`, `POST`, etc.) only; share business logic through `src/server` repositories instead of reaching into feature `_queries/` directories.
- Remember route handlers execute in the HTTP handler layer—keep them stateless, avoid long-lived caches, and delegate cache invalidation logic to the server repositories they call.
- Reuse typed request parsing helpers from `src/server` and keep handlers thin, delegating validation to shared schemas housed in `_schemas/` or promoted to `src/server` as needed.

### Shared Directories

- `components/ui` · shadcn/ui primitives generated via `pnpm dlx shadcn@latest add …`. Extend them with lightweight wrappers inside feature folders rather than editing the base components.
- `hooks/` · cross-feature React hooks (`use-mobile.ts`, etc.).
- `lib/` · framework-agnostic helpers, shared schemas, and API clients that are safe to import from client components.
- `server/` · shared server-only modules (database repositories, external service adapters). Require `import "server-only";` at the top of entry points.

### Optional Feature Additions

- `_constants/` · static configuration shared across the feature.
- `_tests/` · colocated integration tests when the feature benefits from proximity.
- `loading.tsx` / `error.tsx` · route-specific boundaries for suspense and error handling.

## Quick Checklists

- **Scaffold a new route**: choose the correct route group, start with a server `page.tsx`, add `layout.tsx` only when the segment needs unique chrome, and create `_schemas/` before building actions or UI.
- **Promote code to shared**: confirm at least two routes depend on it, move reusable pieces to `components/ui`, `hooks`, `lib`, or `server`, and update imports across consumers in the same change set.

## Keep This Doc Current

Revise this file alongside `docs/BEST_PRACTICES.md` whenever you change directory conventions, introduce new shared surfaces, or adjust feature scaffolding steps so both guides remain synchronized.
