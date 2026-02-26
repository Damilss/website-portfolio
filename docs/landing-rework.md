# Landing Rework Documentation

This document records the full redesign and iteration history for this portfolio project.

## Scope

The project moved from starter placeholder content to a minimal, dark, terminal-influenced portfolio with:

- Home landing page (`/`)
- Work index page (`/work`)
- Custom 404 page (`app/not-found.tsx`)
- Reusable contact footer component
- Aeonik Pro local font pipeline
- Smooth interaction/motion system

## Current Route Map

- `/` - Main landing page with hero, project list, CTA interaction, and inline contact panel
- `/work` - Terminal-style project index with reusable footer/contact links
- `/_not-found` - Custom 404 UI in terminal style

## Files and Responsibilities

- `app/page.tsx`
  - Home page structure
  - Hero/title row
  - Work list preview
  - Start Project interaction mount
  - Corner variant of contact footer
- `app/work/page.tsx`
  - Full project list terminal panel
  - Reusable default footer mount
- `app/not-found.tsx`
  - Terminal-themed 404 fallback page
- `app/globals.css`
  - Global tokens
  - Typography stacks and `@font-face`
  - Motion/easing system
  - Page/component styling
  - Footer variants and layout behavior
- `app/layout.tsx`
  - Metadata + global stylesheet load
- `components/footer.tsx`
  - Reusable contact footer
  - Supports `variant="default" | "corner"`
  - Includes contact command, links, and copyright
- `components/start-project-contact.tsx`
  - Client component
  - Smooth reveal panel for email + copy action
- `public/fonts/aeonik/README.md`
  - Required Aeonik file naming/location contract

## Visual System

### Color Tokens

- Base background: `#0B0F14`
- Surface: `#0F1620`
- Border: `rgba(255, 255, 255, 0.06)`
- Text primary: `rgba(255, 255, 255, 0.92)`
- Text secondary: `rgba(255, 255, 255, 0.68)`
- Text muted: `rgba(255, 255, 255, 0.48)`
- Interaction accent (neutral gray):
  - `--accent: #b7bec9`
  - `--accent-hover: #d8dde4`
  - `--accent-glow: rgba(183, 190, 201, 0.24)`

### Typography

- UI stack: Aeonik Pro first
  - `--font-ui: "Aeonik Pro", "Aeonik", "Satoshi", "Avenir Next", "Segoe UI", sans-serif`
- Code/tag stack:
  - `--font-code: "JetBrains Mono", "IBM Plex Mono", "SFMono-Regular", Menlo, monospace`

### Aeonik Local Font Integration

`@font-face` is configured for:

- `AeonikPro-Regular`
- `AeonikPro-Medium`
- `AeonikPro-Bold`

Expected files:

- `public/fonts/aeonik/AeonikPro-Regular.woff2`
- `public/fonts/aeonik/AeonikPro-Medium.woff2`
- `public/fonts/aeonik/AeonikPro-Bold.woff2`

Optional `.woff` fallbacks are also wired.

## Motion System

- Micro interactions: `160ms`
- UI transitions: `280ms`
- Page entry: `460ms`
- Easing:
  - `cubic-bezier(0.2, 0.8, 0.2, 1)`
  - `cubic-bezier(0.4, 0, 0.2, 1)`

Patterns implemented:

- Page fade/translate/blur-in on load
- Smooth hover and focus states
- Start Project reveal expand + fade/slide
- Reduced-motion fallback via `prefers-reduced-motion`

## Major Feature Work Completed

1. Home page rebuilt from scaffold to custom landing.
2. Work page created with terminal UI and project entries.
3. 404 page created with matching terminal design.
4. Contact links extracted into reusable `Footer` component.
5. Footer supports variants:
   - `default`: used on `/work`
   - `corner`: used inline with title row on `/`
6. `Start Project` moved from direct `mailto:` to interactive reveal component.
7. Copyright integrated into footer.
8. Home layout refined so contact panel appears inline with title and right-aligned at page edge.

## Problems Encountered and Resolutions

### 1) Font Download Failure in Build

Problem:
- `next/font/google` fetch for JetBrains Mono failed in this environment.

Resolution:
- Removed runtime Google font dependency.
- Switched to local/system code font stack.
- Kept Aeonik via local `@font-face`.

### 2) Turbopack Sandbox Build Failure

Problem:
- `next build` failed in sandbox with `Operation not permitted (os error 1)` while creating process/binding.

Resolution:
- Re-ran production build with escalated permissions.
- Confirmed successful compile afterward.

### 3) Home Corner Footer Appearing Left

Problem:
- Footer appeared left despite alignment rules.

Root causes addressed during iteration:
- Parent hero/title layout constraints
- Footer variant width/position interactions
- Alignment rule precedence

Final resolution:
- Corner footer anchored by explicit positioning in home hero title row context.
- Internal alignment rules separated from container alignment.
- Result: box right-aligned, command/copyright left inside box, links right inside box.

### 4) Start Project Reveal Felt Instant (No Visible Transition)

Problem:
- User perceived no transition when reveal opened.

Resolution:
- Changed reveal behavior to explicit staged animation:
  - expand (`grid-template-rows`)
  - fade/slide on inner chip
- Kept timing aligned with system easing.

## Current Footer Alignment Contract

For Home (`variant="corner"`):

- Footer box aligned to the right of title row
- `$ ./contact --links` aligned left inside box
- `© Emilio Scott` aligned left inside box
- Contact links aligned right inside box

For Work (`variant="default"`):

- Footer appears below terminal panel with standard horizontal layout

## Validation History

Commands repeatedly used after each meaningful change:

- `npm run lint`
- `npm run build`

Both currently pass.

## Remaining Manual Setup

- Add licensed Aeonik files to `public/fonts/aeonik/` with expected names.
- Replace placeholder links and email with final production values.
- Update metadata/title string in `app/layout.tsx` if name/brand wording changes.

## Quick Customization Pointers

- Hero name/copy and home project preview: `app/page.tsx`
- Full project catalog content: `app/work/page.tsx`
- Contact links and footer behavior: `components/footer.tsx`
- Start Project email reveal and copy behavior: `components/start-project-contact.tsx`
- Visual styling and all spacing/alignment: `app/globals.css`
