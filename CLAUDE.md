# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Next.js dev server.
- `npm run build` — production build (Next 16 / Turbopack).
- `npm start` — serve the production build.
- `npm run lint` — ESLint via `eslint-config-next` (core-web-vitals + TS rulesets).

There is no test suite in this repo. After non-trivial changes, run `npm run lint` and `npm run build` as the validation gate.

## Stack

Next.js 16 App Router · React 19 · TypeScript (strict) · Tailwind v4 (via `@tailwindcss/postcss`) · `react-github-calendar` (powers the Home GitHub contribution panel) · `resend` (listed as a dependency, not yet wired into a route).

Path alias `@/*` resolves to the repo root (e.g. `@/components/footer`).

## Architecture

This is a small, single-author portfolio. The whole site is three routes plus shared chrome:

- `app/page.tsx` — Home (`/`). Renders the hero block, inline `Footer` (corner variant), the GitHub contributions panel, and a `Selected Work` list driven by an in-file `projects` array. Each entry navigates to bare `/work` (no hash) and sets `sessionStorage["pendingScroll"]` to the slug via `WorkProjectLink` — the `/work` page's mount effect performs the smooth scroll. Direct URL hashes (`/work#<slug>`) are also supported as a fallback for typed/refreshed URLs.
- `app/work/page.tsx` — Work (`/work`). Project cards are **explicit per-card JSX**, not a `.map()` over a data array. This is intentional so each card can diverge independently — do not refactor it into a loop. Each card's `id` must match the corresponding `projects[].slug` on Home so the sessionStorage scroll and hash-link fallback both resolve. Clicking a card calls `setActive({...})` to open `ProjectModal` with that card's data.
- `app/not-found.tsx` — 404, in the same terminal panel language as `/work`.
- `app/layout.tsx` — minimal root layout; metadata + `globals.css`.
- `components/footer.tsx` — `<Footer variant="default" | "corner">`. Contact links live here as a const array; `corner` is used inline in the Home title row, `default` at the bottom of `/work`.
- `components/start-project-contact.tsx` — `"use client"` reveal + copy-to-clipboard for the project email. Email constant is at the top of the file.
- `components/work-project-link.tsx` — `"use client"` wrapper around `next/link` that stashes the target slug in `sessionStorage["pendingScroll"]` before navigation. Intentionally navigates to bare `/work` (no hash) to avoid the browser's native anchor jump fighting the destination's smooth-scroll effect.
- `components/github-contributions.tsx` — `"use client"` wrapper around `react-github-calendar`. Username (`GITHUB_USERNAME`) and the heatmap color ramp (`ghTheme`) are hardcoded constants at the top of the file. The library fetches contribution data client-side from GitHub's public endpoint — no API key or proxy needed.
- `components/project-modal.tsx` — `"use client"` modal opened from the Work page. Exports the `ProjectData` type that types every `setActive({...})` call site on `/work` — adding a field here means updating every card's click handler. Owns its own focus management (focus moves to the close button on open, Tab/Shift+Tab are trapped inside `.pm-window`, focus + scroll return to the originating card on close) and Escape-to-close. The modal's status pill reuses the `terminal-status-active|shipping|archived` classes from the cards so colors stay in lockstep.

### Styling

The entire design system lives in `app/globals.css` (~18 KB): CSS custom properties for color tokens, motion durations/easings, terminal panel chrome, ambient + noise layers, and responsive breakpoints. Class names referenced by components (`portfolio-shell`, `hero-title-row`, `terminal-project-card`, `terminal-status-active|shipping|archived`, `contact-footer-corner`, `start-project-reveal`, `gh-panel`, `pm-overlay` / `pm-window`, etc.) are all defined here. New visual work generally means editing `globals.css` rather than introducing per-component CSS.

### Cross-file invariants to preserve

- Home `projects[].slug` ↔ Work card `id` — used by `WorkProjectLink` (sessionStorage scroll), as the focus/scroll-back target when `ProjectModal` closes, and as a hash-link fallback for direct URL navigation.
- Home uses `<Footer variant="corner" />` inside the title row; Work uses the default variant at the page bottom.
- Contact email appears in two places: `components/footer.tsx` (`mailto:` link) and `components/start-project-contact.tsx` (`PROJECT_EMAIL`). Update both together.
- `ProjectData` (exported from `components/project-modal.tsx`) is the shape of every `setActive({...})` call on `/work`. Adding/removing a field means updating every card's click handler in `app/work/page.tsx`.
- The modal's status pill and the Work card status pill both use `terminal-status-active|shipping|archived` — keep the set of statuses identical when adding a new one.

## Repo conventions

From `.claude/rules.md`: prefer minimal changes, don't break existing behavior, explain before large edits, keep files modular.