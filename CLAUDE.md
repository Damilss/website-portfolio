# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Next.js dev server.
- `npm run build` — production build (Next 16 / Turbopack).
- `npm start` — serve the production build.
- `npm run lint` — ESLint via `eslint-config-next` (core-web-vitals + TS rulesets).

There is no test suite in this repo. After non-trivial changes, run `npm run lint` and `npm run build` — `docs/landing-rework.md` documents these as the validation gate.

## Stack

Next.js 16 App Router · React 19 · TypeScript (strict) · Tailwind v4 (via `@tailwindcss/postcss`) · `resend` (listed as a dependency, not yet wired into a route).

Path alias `@/*` resolves to the repo root (e.g. `@/components/footer`).

## Architecture

This is a small, single-author portfolio. The whole site is three routes plus shared chrome:

- `app/page.tsx` — Home (`/`). Renders the hero block, inline `Footer` (corner variant), and a `Selected Work` list driven by an in-file `projects` array. Each entry navigates to bare `/work` (no hash) and sets `sessionStorage["pendingScroll"]` to the slug via `WorkProjectLink` — the `/work` page's mount effect performs the smooth scroll. Direct URL hashes (`/work#<slug>`) are also supported as a fallback for typed/refreshed URLs.
- `app/work/page.tsx` — Work (`/work`). Project cards are **explicit per-card JSX**, not an `.map()` over a data array. This is intentional (see `docs/landing-rework.md`) so each card can diverge independently — do not refactor it into a loop. Each card's `id` must match the corresponding `projects[].slug` on Home so the sessionStorage scroll and hash-link fallback both resolve.
- `app/not-found.tsx` — 404, in the same terminal panel language as `/work`.
- `app/layout.tsx` — minimal root layout; metadata + `globals.css`.
- `components/footer.tsx` — `<Footer variant="default" | "corner">`. Contact links live here as a const array; `corner` is used inline in the Home title row, `default` at the bottom of `/work`.
- `components/start-project-contact.tsx` — `"use client"` reveal + copy-to-clipboard for the project email. Email constant is at the top of the file.

### Styling

The entire design system lives in `app/globals.css` (~18 KB): CSS custom properties for color tokens, motion durations/easings, terminal panel chrome, ambient + noise layers, and responsive breakpoints. Class names referenced by components (`portfolio-shell`, `hero-title-row`, `terminal-project-card`, `terminal-status-active|shipping|archived`, `contact-footer-corner`, `start-project-reveal`, etc.) are all defined here. New visual work generally means editing `globals.css` rather than introducing per-component CSS.

`docs/landing-rework.md` is the source of truth for design intent: color tokens, motion timings, the Home corner-footer alignment contract, and the rationale for the hand-authored Work cards. Read it before larger visual edits.

### Cross-file invariants to preserve

- Home `projects[].slug` ↔ Work card `id` — used by `WorkProjectLink` (sessionStorage scroll) and as a hash-link fallback for direct URL navigation.
- Home uses `<Footer variant="corner" />` inside the title row; Work uses the default variant at the page bottom.
- Contact email appears in two places: `components/footer.tsx` (`mailto:` link) and `components/start-project-contact.tsx` (`PROJECT_EMAIL`). Update both together.

## Repo conventions

From `.claude/rules.md`: prefer minimal changes, don't break existing behavior, explain before large edits, keep files modular.