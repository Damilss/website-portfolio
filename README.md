# Website Portfolio

A Next.js App Router portfolio with a minimal, terminal-influenced visual system. Project
writeups are plain Markdown files: drop one into `descriptions/` and it shows up in the
`/work` file browser with its own page.

## Features

- **Home (`/`)**
  - Hero title row with the contact links inline in the top-right corner
  - Portrait and pitch copy beside a live GitHub contributions heatmap
  - CTA row: `<view-work />`, a GitHub link, and a `Start a Project` control that reveals
    the project email with copy-to-clipboard
  - **Selected Work** list, generated from the projects marked `featured` in their frontmatter
- **Work (`/work`)**: a terminal-styled file browser that mirrors the `descriptions/`
  directory. Folders expand and collapse inline, and open folders stay open when you go into
  a project and come back.
- **Project pages (`/work/<...slug>`)**: one statically generated page per Markdown file. The
  frontmatter renders as a header (title, summary, period, status, role, tags, repo/live/extra
  links), and the body renders as GitHub-flavored Markdown.
- **Custom 404** (`app/not-found.tsx`) in the same terminal style. Any `/work` path that
  isn't a real Markdown file lands here.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict)
- Tailwind v4 via `@tailwindcss/postcss`. Nearly all styling lives in `app/globals.css`.
- `react-github-calendar` for the contributions heatmap. It fetches from GitHub's public
  endpoint in the browser, so no API key is needed.
- `react-markdown` + `remark-gfm` to render project writeups
- `gray-matter` to parse YAML frontmatter (server-only)
- `resend` is installed but not wired into a route yet

## Adding a project

1. Create a `.md` file anywhere under `descriptions/`. Its path becomes the URL:
   `descriptions/passion/mustang-market.md` → `/work/passion/mustang-market`. Filenames are
   used as-is, so URLs are case-sensitive.
2. Start it with a frontmatter block:

   ```yaml
   ---
   title: Mustang Market
   summary: One sentence. Also used as the page's meta description.
   period: "Jan 2026 – present"   # always quote it
   status: active                 # active | shipped | in-progress | paused | archived
   tags: [Next.js, TypeScript]    # 1–8 tags
   # optional:
   repo: https://github.com/...
   live: https://...
   role: Co-founder, full-stack
   links:
     - { label: Devpost, href: https://... }
   featured: 2                    # show on Home, at this position
   ---
   ```

3. Write the body in Markdown. Don't repeat what the header already shows (title, stack,
   status, repo link).
4. Put images in `public/work-assets/<project>/` and reference them with a root-absolute path:
   `![alt](/work-assets/<project>/file.png)`.

Other rules:

- **Folder overviews.** A file named after its folder (e.g. `passion/passion.md`) is that
  folder's overview. It only needs `title` and `summary`, sorts first in the folder, and
  can't be `featured`.
- **Validation.** A missing or invalid field, an unknown key, or a duplicate `featured` rank
  fails `npm run build` with an error naming the file and field. At least one file must be
  featured.
- **Empty writeups.** A file with frontmatter but no body still gets a page, with a "nothing
  documented here yet" placeholder.
- **Dev server.** Under `npm run dev`, new, renamed, or deleted files don't appear until you
  restart the dev server. Edits to existing files show up on refresh.

## Configuration

| What | Where |
| --- | --- |
| GitHub username / profile URL | `lib/site.ts` |
| Contact email | `components/footer.tsx` **and** `components/start-project-contact.tsx` (keep in sync) |
| Other contact links | `components/footer.tsx` |
| Heatmap colors | `ghTheme` in `components/github-contributions.tsx` |
| Portrait | `public/portrait.jpg` (320×320) |
| Site title / description | `app/layout.tsx` |

## Fonts

UI text uses a common modern sans stack (`--font-ui` in `globals.css`):

- `Manrope`
- `Inter`
- `Avenir Next`
- `Segoe UI`
- `Helvetica Neue`
- `Arial`

Code/tag text uses (`--font-code`):

- `JetBrains Mono`
- `IBM Plex Mono`
- `SFMono-Regular`
- `Menlo`

No web fonts are loaded. These resolve to whatever is installed locally, falling back to
system fonts.

## Development

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Lint:

```bash
npm run lint
```

Production build:

```bash
npm run build
```

Start production server:

```bash
npm start
```

There's no test suite. `npm run lint` and `npm run build` are the checks. The build also
validates every `descriptions/` file.

## Project Structure

```text
app/
  globals.css            # the whole design system
  layout.tsx             # root layout + default metadata
  not-found.tsx          # 404
  page.tsx               # Home
  work/
    page.tsx             # /work file browser
    [...slug]/
      page.tsx           # project detail pages
components/
  finder-tree.tsx        # interactive folder tree for /work
  footer.tsx             # contact links (default + corner variants)
  github-contributions.tsx
  github-cta.tsx
  start-project-contact.tsx
lib/
  descriptions.ts        # reads + validates descriptions/ (server-only)
  site.ts                # GitHub username / URL
descriptions/            # project writeups — one .md per page
  calpoly/
  highschool/
  passion/
  work/
public/
  portrait.jpg
  work-assets/           # images used in writeups
```

## License

MIT (see `LICENSE`).
