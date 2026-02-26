# Landing Rework Documentation

This document records the complete redesign and iteration history for the portfolio.

## Scope

The project evolved from placeholder sections into a minimal, dark, terminal-influenced portfolio with:

- Home page (`/`)
- Work page (`/work`)
- Custom 404 page (`app/not-found.tsx`)
- Reusable contact footer component
- Interactive Start Project reveal flow

## Current Routes

- `/` - Hero, CTA row, work preview list, inline corner contact footer
- `/work` - Terminal-style project index + default footer
- `/_not-found` - Terminal-style custom 404

## Architecture

- `app/page.tsx` - Home page
- `app/work/page.tsx` - Work page
- `app/not-found.tsx` - 404 page
- `app/globals.css` - design tokens + full styling
- `components/footer.tsx` - shared footer with `variant="default" | "corner"`
- `components/start-project-contact.tsx` - client interaction for Start Project reveal

## Visual System

### Color Tokens

- Base: `#0B0F14`
- Surface: `#0F1620`
- Border: `rgba(255,255,255,0.06)`
- Primary text: `rgba(255,255,255,0.92)`
- Secondary text: `rgba(255,255,255,0.68)`
- Muted text: `rgba(255,255,255,0.48)`

### Typography

UI font now uses a common modern stack (similar feel, broader availability):

- `Manrope`
- `Inter`
- `Avenir Next`
- `Segoe UI`
- `Helvetica Neue`
- `Arial`

Code/tags use:

- `JetBrains Mono`
- `IBM Plex Mono`
- `SFMono-Regular`
- `Menlo`

## Motion

- Micro: `160ms`
- UI: `280ms`
- Page: `460ms`
- Easing:
  - `cubic-bezier(0.2, 0.8, 0.2, 1)`
  - `cubic-bezier(0.4, 0, 0.2, 1)`

Applied patterns:

- Page enter fade + slight translate + blur
- Hover/focus transitions
- Start Project reveal with slower expand + fade/slide
- Reduced motion fallback via `prefers-reduced-motion`

## Major Features Completed

1. Full custom Home page layout and project preview.
2. Dedicated `/work` page in terminal style.
3. Dedicated `not-found` page in terminal style.
4. Reusable footer component for contacts.
5. Footer variant system:
   - `default`: used on Work page
   - `corner`: used on Home inline with title row
6. Start Project interaction migrated from static `mailto:` to animated reveal with copy-to-clipboard.
7. Copyright integrated into footer.

## Issues Encountered and Resolutions

### 1) Google Font Fetch Failure

Problem:
- Runtime font fetching failed in this environment.

Resolution:
- Removed dependency on remote font fetch in layout.
- Moved to stable local/system stacks.

### 2) Turbopack Sandbox Build Constraint

Problem:
- `next build` initially failed under sandbox process restrictions.

Resolution:
- Re-ran production build with escalated permissions and verified success.

### 3) Corner Footer Appeared Left

Problem:
- Footer box on Home appeared left despite alignment tweaks.

Root causes:
- Parent width constraints and row layout interactions.
- Container alignment vs inner-content alignment were mixed.

Resolution:
- Separated container alignment from content alignment rules.
- Anchored corner footer behavior specifically for Home variant.
- Kept command/copyright left inside box while links align right.

### 4) Start Project Reveal Felt Instant

Problem:
- Transition did not feel visible enough.

Resolution:
- Increased reveal and inner-chip transition durations.
- Kept consistent easing curve with global motion system.

## Current Home Footer Alignment Contract

For Home (`variant="corner"`):

- Footer box aligns right in title row
- `$ ./contact --links` aligns left inside box
- `© Emilio Scott` aligns left inside box
- contact links align right inside box

## Validation

Commands run after major changes:

- `npm run lint`
- `npm run build`

Current status: passing.

## Customization

- Home content and title row: `app/page.tsx`
- Work page data/cards: `app/work/page.tsx`
- Footer links/variant behavior: `components/footer.tsx`
- Start Project reveal behavior: `components/start-project-contact.tsx`
- Global visuals, spacing, and alignment: `app/globals.css`
