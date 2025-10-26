# FILE_STRUCTURE.md

This project uses the Next.js App Router, shadcn/ui, and Zod. Keep features colocated, promote only what is reused, and rely on clear naming so the tree stays predictable.

## Guiding Principles

- Organize routes first: each feature lives under its segment in `app/` with UI, schemas, data, and actions nearby.
- Keep work local until more than one feature needs it, then move it to `components/ui`, `hooks`, or `lib`.
- Name files in kebab-case (for example `login-form.tsx`, `submit-login.action.ts`, `list-users.query.ts`); export React components in PascalCase.
- Treat any non-structural guidance as owned by `docs/BEST_PRACTICES.md` to keep this document focused on layout.

## Workspace Overview

- `package.json`: scripts and dependencies.
- `components.json`: shadcn/ui registry.
- `tsconfig.json`: path aliases (`@/*` maps to `src/*`).
- `public/`: static assets served by Next.js.
- `docs/`: repository documentation including this file.
- `src/`: application code.

## src Directory

- `app/`: App Router entry point. Contains route groups such as `(public)` and `(protected)`, each with their own `page.tsx`, `layout.tsx`, and feature folders. Place `_components`, `_actions`, `_queries`, `_hooks`, `_schemas`, and optional folders like `_constants`, `_tests`, or `_data` directly under each feature as it grows. Include `loading.tsx` and `error.tsx` when a route needs custom boundaries.
- `app/globals.css`: Tailwind layers and design tokens.
- `app/layout.tsx`: root server layout.
- `components/ui/`: shared shadcn/ui primitives. Create light wrappers per feature rather than modifying these files.
- `hooks/`: cross-feature React hooks. Feature-specific hooks stay local in `_hooks`.
- `lib/`: reusable utilities, validators, API clients, and helpers that do not belong to a single feature.

## Feature Folder Expectations

- `_components`: client leaves or small server components unique to the feature. Wrap shadcn/ui primitives locally.
- `_actions`: server actions for mutations. Name files with `*.action.ts`, validate inputs with colocated schemas, and trigger cache invalidation as needed.
- `_queries`: server-only loaders named `*.query.ts` with `import "server-only";` at the top. Return typed data ready for server components or actions.
- `_hooks`: React hooks scoped to the feature.
- `_schemas`: Zod schemas plus inferred types shared by forms, actions, and queries.
- Optional folders (`_constants`, `_tests`, `_data`) capture shared config, colocated tests, or fixtures when the feature warrants them.

## Shared Areas

- `components/ui`: generated with shadcn tooling. Keep these close to upstream defaults and compose wrappers elsewhere.
- `hooks`: home for hooks used in multiple routes, such as device or data utilities.
- `lib`: framework-agnostic helpers, shared validators, and fetch clients used across actions and queries.

Refer to `docs/BEST_PRACTICES.md` for routing, server-action, Zod, and feature rollout guidance that complements this structure overview.
