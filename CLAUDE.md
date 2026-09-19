# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Next.js dev server.
- `npm run build` — production build (Next 16 / Turbopack).
- `npm start` — serve the production build.
- `npm run lint` — ESLint via `eslint-config-next` (core-web-vitals + TS rulesets).

There is no test suite in this repo. After non-trivial changes, run `npm run lint` and `npm run build` as the validation gate.

## Stack

Next.js 16 App Router · React 19 · TypeScript (strict) · Tailwind v4 (via `@tailwindcss/postcss`) · `react-github-calendar` (powers the Home GitHub contribution panel) · `react-markdown` + `remark-gfm` (render the `/work/<...slug>` project writeups) · `gray-matter` (parses the YAML frontmatter on every `descriptions/` file; server-only) · `resend` (listed as a dependency, not yet wired into a route).

Path alias `@/*` resolves to the repo root (e.g. `@/components/footer`).

## Architecture

This is a small, single-author portfolio. The whole site is a handful of routes plus shared chrome:

- `app/page.tsx` — Home (`/`). Server Component. Renders the hero block (title row with the inline corner `Footer`; a `.hero-row` with the portrait + pitch copy beside the GitHub contributions panel; the CTA row: `<view-work />`, `GithubCta`, `StartProjectContact`) and a `Selected Work` list. That list is **generated**: `listFeaturedProjects()` returns every `descriptions/` file whose frontmatter sets `featured: N`, ascending — so featuring/unfeaturing a project is a markdown edit, not a code edit. The portrait is `public/portrait.jpg` (a 320×320 crop) via a static `next/image` import.
- `app/work/page.tsx` — Work (`/work`). Server Component. A terminal-styled file browser over the on-disk `descriptions/` directory. Builds the folder tree at build time via `buildDescriptionsTree()` (`lib/descriptions.ts`) and hands it to `FinderTree`, which owns the expand/collapse interaction. Adding a project is just dropping a `.md` file into `descriptions/` — no code change here.
- `app/work/[...slug]/page.tsx` — project detail page. Catch-all route: one statically generated page per markdown file under `descriptions/`, the slug array mapping directly to a file path (`["passion","mustang-market"]` → `descriptions/passion/mustang-market.md`). `readMarkdown(slug)` supplies `{ meta, body }`: the frontmatter renders as a `.finder-meta` header (title, summary, period · status · role, tag chips, repo/live/links) and feeds `<title>`/`description`; the body renders with `react-markdown` + `remark-gfm`. `dynamicParams = false`, so any path that isn't a real `.md` file renders `not-found`.
- `app/not-found.tsx` — 404, in the same terminal panel language as `/work`.
- `app/layout.tsx` — minimal root layout; metadata + `globals.css`.
- `components/footer.tsx` — `<Footer variant="default" | "corner">`. Contact links live here as a const array (the GitHub entry reads `GITHUB_URL` from `lib/site.ts`); `corner` is used inline in the Home title row, `default` at the bottom of `/work`.
- `components/start-project-contact.tsx` — `"use client"` reveal + copy-to-clipboard for the project email. Email constant is at the top of the file.
- `components/github-cta.tsx` — the "GitHub" pill in the Home CTA row: a plain `<a class="cta-primary cta-github">` with the inline GitHub mark, opening `GITHUB_URL` in a new tab. Server component.
- `components/github-contributions.tsx` — `"use client"` wrapper around `react-github-calendar`. Username comes from `lib/site.ts`; the heatmap color ramp (`ghTheme`) is a constant at the top of the file. The library fetches contribution data client-side from GitHub's public endpoint — no API key or proxy needed.
- `lib/site.ts` — `GITHUB_USERNAME` / `GITHUB_URL`, the single definition shared by the footer, the contributions panel, and the CTA. Must stay free of Node-only imports (it's in the client bundle).
- `components/finder-tree.tsx` — `"use client"` interactive folder tree for `/work`. Receives the `descriptions/` tree (built server-side) and renders folders that expand/collapse inline and files that link to `/work/<...slug>`. Expand/collapse state is the only client-side concern, and it is mirrored into `sessionStorage` (key `work-finder:expanded`) so open folders survive navigating into a project and back. Detail pages link back as `/work?from=<slug>`; the tree reads that param on mount to open the project's ancestor folders, then strips it from the URL.
- `lib/descriptions.ts` — server-only filesystem helper (`node:fs` + `gray-matter`). Mirrors the `descriptions/` directory into a tree: every folder is a node, every `.md` file a leaf (non-`.md` files skipped), each leaf carrying its parsed frontmatter as `meta`. Exports `buildDescriptionsTree`, `listAllMarkdownFiles` (for `generateStaticParams`), `findFileNode`, `readMarkdown` (`{ meta, body, isEmpty }` for one slug), `listFeaturedProjects` (the Home list), `PROJECT_STATUSES`, and the `TreeNode`/`TreeFile`/`TreeFolder`/`FileMeta`/`ProjectMeta`/`OverviewMeta` types. Validation happens when the tree is first built and **throws** with a `descriptions/<file>: <field> …` message — so a bad frontmatter block fails `next build`. Imported only by Server Components; `FinderTree` imports the types with `import type` so this runtime code never enters the client bundle.

### Styling

The entire design system lives in `app/globals.css` (~50 KB): CSS custom properties for color tokens, motion durations/easings, terminal panel chrome, ambient + noise layers, and responsive breakpoints. Class names referenced by components (`portfolio-shell`, `hero-title-row`, `work-page-shell`, `terminal-panel`, `contact-footer-corner`, `start-project-reveal`, `gh-panel`, `finder-tree` / `finder-row` / `finder-md`, etc.) are all defined here. New visual work generally means editing `globals.css` rather than introducing per-component CSS.

### Cross-file invariants to preserve

- The `descriptions/` directory IS the `/work` finder. Every `.md` file becomes a route at `/work/<path-without-.md>`; folders become tree nodes. The slug array maps 1:1 to the on-disk path (`descriptions/passion/mustang-market.md` ↔ `/work/passion/mustang-market`), so renaming or moving a file changes its URL.
- The Home "Selected Work" list is generated from `featured:` frontmatter, so its links can't go stale — but the *set* of featured projects is a content decision: exactly five today (spi-can-pi4-drivers, mustang-market, realtyworks, devsize-plus, cpe-225-asgn6-mmio-interrupts), ranks 1–5.
- Home uses `<Footer variant="corner" />` inside the title row; Work uses the default variant at the page bottom.
- Contact email appears in two places: `components/footer.tsx` (`mailto:` link) and `components/start-project-contact.tsx` (`PROJECT_EMAIL`). Update both together.
- The GitHub username/URL is defined once in `lib/site.ts`; don't hardcode it elsewhere.

### Authoring `descriptions/` content

Behavior lives in `lib/descriptions.ts` and `app/work/[...slug]/page.tsx`:

- **Frontmatter is required.** Every `.md` starts with a YAML block. Project files: `title`, `summary`, `period` (quote it — YAML turns a bare `2026` into a number), `status` (`active | shipped | in-progress | paused | archived`), `tags` (1–8, canonical spellings such as `Next.js`, `TypeScript`, `RISC-V Assembly`, `C++`); optional `repo`, `live`, `role`, `links` (`[{label, href}]`), `featured` (positive int = Home order). Overview files need only `title` + `summary` and may not set `featured`. Unknown keys, bad values, duplicate `featured` ranks, or zero featured files fail the build with a message naming the file and field. The body must not repeat what the header renders (no `# Title`, `## Tech stack`, `## Status`, `[repo link]` lines).
- **Overview files.** A file whose name matches its parent folder (case-insensitive), e.g. `passion/passion.md`, is flagged `isOverview`: it sorts first in that folder and gets an "overview" tag in the finder. Folder order is overview → sub-folders → files, each alphabetical (case-insensitive).
- **Slugs are literal filenames**, so URLs are case-sensitive (`/work/passion/AIsore`, `/work/passion/OpenHours`).
- **Skipped entries:** dotfiles (e.g. stray `.DS_Store`) and any non-`.md` file.
- **Empty files:** a file with frontmatter but no body text still gets a route; the tree dims it and the detail page shows a "nothing documented here yet" placeholder. (A 0-byte file has no frontmatter and fails validation instead.)
- **Images** go in `public/work-assets/<project>/` and are referenced with a root-absolute path (`![alt](/work-assets/<project>/file.png)`). They render as plain lazy-loaded `<img>`, not `next/image`. Absolute `http(s)` links open in a new tab.
- **Dev-server restart required.** The walked tree is memoized at module scope, so under `npm run dev` adding, renaming, or deleting a `descriptions/` file doesn't appear until the dev server restarts. Body/frontmatter edits to an existing file show up on refresh (the detail page reads the file fresh; a failed validation is never cached).

## Repo conventions

From `.claude/rules.md` (local only — `.claude/` is gitignored): prefer minimal changes, don't break existing behavior, explain before large edits, keep files modular.

**Stale docs — trust the code.** `README.md` is outdated (describes `/work` as hand-authored cards and links `docs/landing-rework.md`, which does not exist).