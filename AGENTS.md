# AGENTS.md

Authoritative checklist for anyone using autonomous or semi-autonomous agents inside this repository. Treat every directive as mandatory so changes stay aligned with the workspace practices.

## Canonical Context

- Read every file in `docs/` (`FILE_STRUCTURE.md`, `BEST_PRACTICES.md`, and future additions) before writing code, and reread after those files change.
- Architecture, naming, and folder rules live in `docs/FILE_STRUCTURE.md`; follow them unless that file calls out an exception.
- Follow the icon, component, and token guidance in `docs/BEST_PRACTICES.md` so UI decisions stay consistent.

## Tooling and Process

- Use `pnpm` only so `pnpm-lock.yaml` stays authoritative; do not run `npm` or `yarn`.
- Use Context7 MCP for documentation lookup and Next Devtools MCP for runtime inspection before consulting any other source; prefer the Next Devtools MCP docs lookup for Next.js references.
- Biome handles linting and formatting whenever the scope requires those checks.
- When adding or evaluating frontend components, use the shadcn MCP tools (`list_items_in_registries`, `search_items_in_registries`) first; if a component is missing, add it with `pnpm dlx shadcn@latest add <component>` and prefer shadcn components for consistency.

## Required Commands for Each Change Set

1. Run `pnpm install` only when dependencies change.
2. Run `pnpm check` as the primary static analysis gate.
3. Run `pnpm build` after `pnpm check` succeeds to validate the production bundle.
4. Report all command outcomes, including failures.

## Development Conventions

- Defer to `docs/FILE_STRUCTURE.md` for structure, naming, component placement, and schema expectations; reread it whenever those rules change.
- Use `docs/BEST_PRACTICES.md` for routing, server-action, and feature rollout guidance, and keep it current when those conventions evolve.
- Escalate proposed deviations by updating the relevant doc first so downstream contributors stay aligned.

## Workflow Rules for Agents

- Reconfirm the latest instructions in this guide and in `docs/` before modifying files.
- Update the relevant documentation in `docs/` whenever structure, conventions, or workflows change.
- Do not revert user-authored changes unless explicitly instructed.
- Follow `docs/BEST_PRACTICES.md` for icons, shadcn/ui primitives, and Tailwind token usage instead of local improvisations.
- If a command fails due to sandboxing or approval limits, capture the attempt and coordinate instead of retrying blindly.

## Commit and Collaboration

- Use Conventional Commits (for example `feat: add login actions` or `fix: handle rag template strings`) with meaningful scopes when helpful.
- Keep diffs focused on related work.
- Share concise summaries that cover what changed, where, why, and how to validate.
- Recommend obvious next steps such as tests or cleanup when work remains.

These instructions exist so every agent delivers predictable changes that align with the codebase architecture and avoids regressions.
