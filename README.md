# Website Portfolio

A Next.js App Router portfolio with a minimal, terminal-influenced visual system.

## Current Features

- Custom Home page (`/`) with:
  - Hero/title row
  - Inline top-right contact footer panel
  - Interactive `Start Project` reveal control
  - Work preview list
- Dedicated Work page (`/work`) with terminal-style project cards
- Custom 404 page (`app/not-found.tsx`) in same terminal language
- Reusable contact footer component with variant support
- Popular modern sans stack (`Manrope`/`Inter` + system fallbacks) + mono code stack

## Documentation

- Full implementation + issue log: [`docs/landing-rework.md`](docs/landing-rework.md)

## Fonts

UI text uses a common modern sans stack:

- `Manrope`
- `Inter`
- `Avenir Next`
- `Segoe UI`
- `Helvetica Neue`
- `Arial`

Code/tag text uses:

- `JetBrains Mono`
- `IBM Plex Mono`
- `SFMono-Regular`
- `Menlo`

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

## Project Structure

```text
app/
  globals.css
  layout.tsx
  not-found.tsx
  page.tsx
  work/
    page.tsx
components/
  footer.tsx
  start-project-contact.tsx
docs/
  landing-rework.md
public/
  ...
```

## License

MIT (see `LICENSE`).
