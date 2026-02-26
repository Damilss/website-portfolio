# Website Portfolio

A Next.js App Router portfolio with a minimal, interactive single-page landing experience.

## Current Implementation

- Full landing-page rework (`app/page.tsx`) with:
  - Hero block (headline, short positioning copy, CTA actions)
  - Selected work list with tags/years
  - Social links footer area
- Custom global design system in `app/globals.css`:
  - Dark grayscale palette
  - Local typography stacks
  - Shared motion timing and easing tokens
  - Hover/focus interaction styling
  - Reduced-motion support
- Root layout metadata in `app/layout.tsx`

## Documentation

- Full rework notes: [`docs/landing-rework.md`](docs/landing-rework.md)
- Aeonik font drop-in instructions: [`public/fonts/aeonik/README.md`](public/fonts/aeonik/README.md)

## Fonts

UI text targets `Aeonik Pro` first. The project is preconfigured to load local font files from:

- `public/fonts/aeonik/AeonikPro-Regular.woff2`
- `public/fonts/aeonik/AeonikPro-Medium.woff2`
- `public/fonts/aeonik/AeonikPro-Bold.woff2`

Code/tag text uses a JetBrains Mono stack via CSS fallbacks.

## Local Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Run lint:

```bash
npm run lint
```

Run production build:

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
  page.tsx
docs/
  landing-rework.md
public/
  fonts/
    aeonik/
```

## License

MIT (see `LICENSE`).
