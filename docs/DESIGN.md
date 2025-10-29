# DESIGN.md

## Purpose & Scope

This document captures the design system expectations for the repository. Treat it as the canonical reference for layout choices, theming, typography, and interaction affordances. Adjust the guidance to taste when you fork the project, but keep the structure intact so future contributors can recognize the rules at a glance.

## Theme Tokens & Centralized Styles

- All visual tokens live in `src/styles/theme.css`. Update this file first whenever you need to adjust colors, radii, or component chrome.
- Light and dark palettes use OKLCH values for perceptual consistency. Modify both scopes together to keep contrast ratios aligned.

### Light Theme (`:root` in `src/styles/theme.css`)

| Token                                    | Value                                   | Usage                                           |
| ---------------------------------------- | --------------------------------------- | ----------------------------------------------- |
| `--background`                           | `oklch(1 0 0)`                          | Page background and neutral surfaces.           |
| `--foreground`                           | `oklch(0.145 0 0)`                      | Default text color.                             |
| `--card` / `--card-foreground`           | `oklch(1 0 0)` / `oklch(0.145 0 0)`     | Card surfaces and text.                         |
| `--popover` / `--popover-foreground`     | `oklch(1 0 0)` / `oklch(0.145 0 0)`     | Popovers, tooltips, dropdowns.                  |
| `--primary` / `--primary-foreground`     | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` | Primary actions and interactive emphasis.       |
| `--secondary` / `--secondary-foreground` | `oklch(0.97 0 0)` / `oklch(0.205 0 0)`  | Secondary actions and neutral chips.            |
| `--muted` / `--muted-foreground`         | `oklch(0.97 0 0)` / `oklch(0.556 0 0)`  | Subtle UI elements, borders, placeholder text.  |
| `--accent` / `--accent-foreground`       | `oklch(0.97 0 0)` / `oklch(0.205 0 0)`  | Highlight states (hover/focus).                 |
| `--destructive`                          | `oklch(0.577 0.245 27.325)`             | Error and destructive actions.                  |
| `--border` / `--input`                   | `oklch(0.922 0 0)`                      | Borders, input outlines.                        |
| `--ring`                                 | `oklch(0.708 0 0)`                      | Focus rings.                                    |
| `--chart-1..5`                           | See file                                | Data visualizations.                            |
| `--sidebar*` tokens                      | `oklch(...)`                            | Vertical navigation background, text, emphasis. |

### Dark Theme (`.dark` scope in `src/styles/theme.css`)

| Token                                    | Value                                      | Usage                                           |
| ---------------------------------------- | ------------------------------------------ | ----------------------------------------------- |
| `--background`                           | `oklch(0.145 0 0)`                         | Base shell for dark UI.                         |
| `--foreground`                           | `oklch(0.985 0 0)`                         | Primary text on dark backgrounds.               |
| `--card` / `--card-foreground`           | `oklch(0.205 0 0)` / `oklch(0.985 0 0)`    | Cards and floating surfaces.                    |
| `--popover` / `--popover-foreground`     | `oklch(0.205 0 0)` / `oklch(0.985 0 0)`    | Overlays and contextual menus.                  |
| `--primary` / `--primary-foreground`     | `oklch(0.922 0 0)` / `oklch(0.205 0 0)`    | Primary action colors in dark mode.             |
| `--secondary` / `--secondary-foreground` | `oklch(0.269 0 0)` / `oklch(0.985 0 0)`    | Secondary surfaces.                             |
| `--muted` / `--muted-foreground`         | `oklch(0.269 0 0)` / `oklch(0.708 0 0)`    | Subtle UI and meta text.                        |
| `--accent` / `--accent-foreground`       | `oklch(0.269 0 0)` / `oklch(0.985 0 0)`    | Hover/focus states.                             |
| `--destructive`                          | `oklch(0.704 0.191 22.216)`                | Destructive states.                             |
| `--border` / `--input`                   | `oklch(1 0 0 / 10%)`, `oklch(1 0 0 / 15%)` | Borders and inputs with translucency for depth. |
| `--ring`                                 | `oklch(0.556 0 0)`                         | Focus outlines.                                 |
| `--chart-1..5`                           | See file                                   | Data visuals tuned for dark backgrounds.        |
| `--sidebar*` tokens                      | `oklch(...)`                               | Sidebar chrome in dark mode.                    |

> Keep both palettes synchronized—when you change a light token, update its dark counterpart to maintain brand consistency and accessible contrast ratios.

## Visual Language Guidelines

- **No box shadows.** Create depth with spacing, color contrast, and border tokens. Shadows are off-brand and should not appear in custom CSS or Tailwind utilities.
- **No gradients.** All fills should be solid colors drawn from the theme tokens. If a background needs emphasis, use `--accent` or a tint from the palette, not gradient utilities.
- **Flat design first.** Combine color, hierarchy, and typography to communicate structure instead of skeuomorphic treatments.

## Typography & Font Pairing

- Use a curated Sans + Serif pairing rather than system defaults. Recommended pairing: `"Inter", "Segoe UI", sans-serif` for UI and `"Source Serif 4", "Georgia", serif` for long-form content. Import both families globally and expose utilities in Tailwind to enforce the pairing.
- Define typography scale tokens (font sizes, line heights, letter spacing) in a single configuration file (Tailwind theme or CSS custom properties) and reuse them across components.
- Step the typography scale using a Minor Third ratio (~1.2×) between adjacent levels so headings, subheadings, and body text feel harmonized.
- Avoid ad-hoc font declarations inside components; rely on utility classes mapped to the established scale.

## Layout & Spacing Rules

- **Consistency beats cleverness:** choose one spacing scale (e.g., multiples of 4) and apply it for padding, margins, and gaps.
- Prefer CSS Grid or Flexbox layouts with explicit `gap` values over Tailwind’s `space-x-*` or `space-y-*` utilities. This keeps spacing bidirectional and easier to reason about in responsive contexts.
- Define responsive breakpoints once (Tailwind config) and reuse layout primitives. Avoid hardcoded pixel widths—favor max-widths, minmax columns, and intrinsic sizing.
- Establish padding tokens for common shells (page, card, section) and apply them via components or layout wrappers to eliminate one-off adjustments.
- When spacing dictates visual hierarchy, keep adjacent steps within a Minor Third ratio so increments feel natural and predictable.

## Responsiveness & Adaptability

- Design for mobile first: ensure components stack gracefully, use fluid widths, and rely on percentage or viewport-based sizing where it maintains readability.
- Prefer flexible layouts (e.g., auto-fit grids, wrap-aware flex containers) over rigid breakpoints that force large layout jumps.
- Test at key viewport widths (320px, 375px, 768px, 1024px, 1440px) whenever you ship new UI to confirm spacing, typography, and interactions scale correctly.

## Interaction & States

- Use `--ring` for focus outlines and respect reduced motion preferences by avoiding complex transitions.
- Draw hover/active/disabled states from `--accent`, `--muted`, and `--primary-foreground` tokens. Keep state changes consistent across components.

## Process Checklist

1. Update `src/styles/theme.css` when changing tokens; apply matching updates to both light and dark scopes.
2. Validate typography and spacing choices against the shared scales and font pairing defined above.
3. Review pages at multiple breakpoints to ensure mobile-responsiveness and flexible layouts.
4. Confirm no shadows or gradients slipped into component overrides or Tailwind classes.
5. Document any new primitives or layout rules in this file so the next contributor can stay aligned.

Consistency is the primary goal—follow these rules to keep the experience cohesive, confident, and responsive across the entire application.
