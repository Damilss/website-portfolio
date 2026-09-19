---
title: Generational Wealth Inequality
summary: A one-page Next.js site publishing a four-person ENGL 133 research essay on wealth inequality and economic mobility for young Californians.
period: "Mar 2026"
status: archived
tags: [Next.js, React, TypeScript, Framer Motion, Tailwind CSS, CSS]
repo: https://github.com/Damilss/generational-wealth-inequality
role: Sole developer, essay co-author
---

The web version of Essay III for ENGL 133 (Winter 2026): a group argument essay on how wealth
inequality in California limits economic mobility for young adults, and what the state could do
about it. I co-wrote the essay with James Barrios, Lucas Garcia, and Daniel Aquino, and built the
site on my own over two days so the paper could be read as one scrolling page instead of a
document: a hero, the full thesis article, five numbered parts (issue, solutions, counterargument,
conclusion, works cited), three sourced figures, and a sticky section nav.

## How it works

The essay is data, not markup. Every section lives in a typed `PageSection[]` array in
`app/page.tsx` (part label, title, paragraphs, optional pull quote, a figure with `bottom` or
`wrap-right` placement, solution panels, citation cards) and one `ContentSection` component
renders all of them. That let me hand my group a working template at the end of day one (the
commit is "edit template for classmates") and drop their paragraphs in as strings while the
layout was still changing.

Motion is Framer Motion. A 36-line `ScrollReveal` client component wraps `whileInView` with
`delay`, `duration`, `y` and `amount` props, and every heading, paragraph, panel and citation
card on the page goes through it, with delays staggered by index. A reading-progress bar across
the top takes `useScroll`, smooths it with `useSpring`, and applies the result as `scaleX`.

Tailwind v4 is imported, but every class name on the page is custom: the layout is 616 lines of
hand-written CSS in `globals.css`, with a `:root` token block for fonts and the night/paper
palette, a `float: right` for the wrap-right figure, and breakpoints at 980px and 640px.

```tsx
type PageSection = {
  id: string;
  navLabel: string;
  part: string;
  title: string;
  paragraphs: string[];
  quote?: string;
  solutionPanels?: SolutionPanel[];
  media?: SectionMedia;
  mediaPlacement?: "bottom" | "wrap-right";
  panelTitle?: string;
  bullets?: string[];
  cards?: StatCard[];
  closingNote?: string;
};
```
*The shape every section is written in; a single `ContentSection` renders the whole essay from it.*

## Highlights

- Eleven MLA 9 sources (PPIC, LAO, the California Budget & Policy Center, the Terner Center, the U.S. Census Bureau, and others) render as a works-cited card grid, one source per card.
- The three figures are sourced graphics (a minimum-wage map credited to VCU RISE, a county-level California income map, a racial-wealth-gap infographic) served through `next/image` with captions; the site generates no charts of its own.
- Runtime dependencies are only `next`, `react`, and `framer-motion`; there is no backend or database.
- 37 commits, all mine, from "intial scaffold" on 12 Mar 2026 to "final checks and corretions." on 13 Mar 2026.
