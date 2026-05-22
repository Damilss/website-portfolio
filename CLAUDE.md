# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Next.js dev server.
- `npm run build` — production build (Next 16 / Turbopack).
- `npm start` — serve the production build.
- `npm run lint` — ESLint via `eslint-config-next` (core-web-vitals + TS rulesets).

There is no test suite in this repo. After non-trivial changes, run `npm run lint` and `npm run build` as the validation gate.

## Stack

Next.js 16 App Router · React 19 · TypeScript (strict) · Tailwind v4 (via `@tailwindcss/postcss`) · `react-github-calendar` (powers the Home GitHub contribution panel) · `react-markdown` + `remark-gfm` (render the `/work/<...slug>` project writeups) · `resend` (listed as a dependency, not yet wired into a route).

Path alias `@/*` resolves to the repo root (e.g. `@/components/footer`).

## Architecture

This is a small, single-author portfolio. The whole site is a handful of routes plus shared chrome:

- `app/page.tsx` — Home (`/`). Server Component. Renders the hero block, inline `Footer` (corner variant), the GitHub contributions panel, and a `Selected Work` list driven by an in-file `projects` array. Each entry's `href` deep-links straight to that project's detail page in the finder (`/work/<...slug>`, e.g. `/work/passion/mustang-market`) via `WorkProjectLink`. This list is a hand-curated shortcut and is independent of the finder — the finder builds itself from the `descriptions/` directory.
- `app/work/page.tsx` — Work (`/work`). Server Component. A terminal-styled file browser over the on-disk `descriptions/` directory. Builds the folder tree at build time via `buildDescriptionsTree()` (`lib/descriptions.ts`) and hands it to `FinderTree`, which owns the expand/collapse interaction. Adding a project is just dropping a `.md` file into `descriptions/` — no code change here.
- `app/work/[...slug]/page.tsx` — project detail page. Catch-all route: one statically generated page per markdown file under `descriptions/`, the slug array mapping directly to a file path (`["passion","mustang-market"]` → `descriptions/passion/mustang-market.md`). Markdown is rendered with `react-markdown` + `remark-gfm`. `dynamicParams = false`, so any path that isn't a real `.md` file renders `not-found`.
- `app/not-found.tsx` — 404, in the same terminal panel language as `/work`.
- `app/layout.tsx` — minimal root layout; metadata + `globals.css`.
- `components/footer.tsx` — `<Footer variant="default" | "corner">`. Contact links live here as a const array; `corner` is used inline in the Home title row, `default` at the bottom of `/work`.
- `components/start-project-contact.tsx` — `"use client"` reveal + copy-to-clipboard for the project email. Email constant is at the top of the file.
- `components/work-project-link.tsx` — a thin named wrapper around `next/link` for the Home "Selected Work" rows. A plain pass-through (no `"use client"`, no side effects); it stays a named component only so the Home JSX reads clearly and is easy to keep in sync with the `projects` array. Its `href` is the project's detail-page path (e.g. `/work/passion/mustang-market`).
- `components/github-contributions.tsx` — `"use client"` wrapper around `react-github-calendar`. Username (`GITHUB_USERNAME`) and the heatmap color ramp (`ghTheme`) are hardcoded constants at the top of the file. The library fetches contribution data client-side from GitHub's public endpoint — no API key or proxy needed.
- `components/finder-tree.tsx` — `"use client"` interactive folder tree for `/work`. Receives the `descriptions/` tree (built server-side) and renders folders that expand/collapse inline and files that link to `/work/<...slug>`. Expand/collapse state is the only client-side concern.
- `lib/descriptions.ts` — server-only filesystem helper (`node:fs`). Mirrors the `descriptions/` directory into a tree: every folder is a node, every `.md` file a leaf (non-`.md` files skipped). Exports `buildDescriptionsTree`, `listAllMarkdownFiles` (for `generateStaticParams`), `findFileNode`, `readMarkdownFile`, and the `TreeNode`/`TreeFile`/`TreeFolder` types. Imported only by Server Components; `FinderTree` imports the types with `import type` so this runtime code never enters the client bundle.

### Styling

The entire design system lives in `app/globals.css` (~62 KB): CSS custom properties for color tokens, motion durations/easings, terminal panel chrome, ambient + noise layers, and responsive breakpoints. Class names referenced by components (`portfolio-shell`, `hero-title-row`, `work-page-shell`, `terminal-panel`, `contact-footer-corner`, `start-project-reveal`, `gh-panel`, `finder-tree` / `finder-row` / `finder-md`, etc.) are all defined here. New visual work generally means editing `globals.css` rather than introducing per-component CSS.

### Cross-file invariants to preserve

- The `descriptions/` directory IS the `/work` finder. Every `.md` file becomes a route at `/work/<path-without-.md>`; folders become tree nodes. The slug array maps 1:1 to the on-disk path (`descriptions/passion/mustang-market.md` ↔ `/work/passion/mustang-market`), so renaming or moving a file changes its URL.
- Each Home `projects[].href` must point at a real markdown file's detail-page path (`/work/<...slug>`). These are hand-curated deep links — nothing generates or validates them, so a renamed/moved/deleted `descriptions/` file silently 404s the corresponding Home link. Re-check the `href`s when reorganizing `descriptions/`.
- Home uses `<Footer variant="corner" />` inside the title row; Work uses the default variant at the page bottom.
- Contact email appears in two places: `components/footer.tsx` (`mailto:` link) and `components/start-project-contact.tsx` (`PROJECT_EMAIL`). Update both together.

## Repo conventions

From `.claude/rules.md`: prefer minimal changes, don't break existing behavior, explain before large edits, keep files modular.