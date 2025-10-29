# AGENTS.md

Authoritative checklist for anyone using autonomous or semi-autonomous agents inside this repository. Treat every directive as mandatory so changes stay aligned with the workspace practices.

## Canonical Context

- Read every file in `docs/` (`FILE_STRUCTURE.md` for architecture rules, `BEST_PRACTICES.md` for UI/data flow, plus future additions) before writing code, and reread after those files change.

## Tooling and Process

- Use `pnpm` only so `pnpm-lock.yaml` stays authoritative; do not run `npm` or `yarn`.
- Biome handles linting and formatting whenever the scope requires those checks.

## Required Commands for Each Change Set

1. Run `pnpm install` only when dependencies change.
2. Run `pnpm check` as the primary static analysis gate.
3. Run `pnpm test` (or the targeted suite documented in the change request) whenever the work can affect runtime behavior.
4. Run `pnpm build` after quality gates succeed to validate the production bundle.
5. Report all command outcomes, including failures.

## Development Conventions

- Escalate proposed deviations by updating the relevant doc in `docs/` first so downstream contributors stay aligned.
- Confirm whether `experimental.cacheComponents` is enabled before adopting `'use cache'` APIs; if the flag is off, document the decision and avoid introducing cache-specific directives.

## Workflow Rules for Agents

- Reconfirm the latest instructions in this guide and in `docs/` before modifying files.
- Update the relevant documentation in `docs/` whenever structure, conventions, or workflows change.
- Do not revert user-authored changes unless explicitly instructed.
- If a command fails due to sandboxing or approval limits, capture the attempt and coordinate instead of retrying blindly.

## Commit and Collaboration

- Use Conventional Commits (for example `feat: add login actions` or `fix: handle rag template strings`) with meaningful scopes when helpful.
- Keep diffs focused on related work.
- Share concise summaries that cover what changed, where, why, and how to validate.
- Recommend obvious next steps such as tests or cleanup when work remains.

These instructions exist so every agent delivers predictable changes that align with the codebase architecture and avoids regressions.
