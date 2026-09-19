---
title: The Richmond Square
summary: Client marketing site for a nine-tenant retail plaza in Richmond, California, with every user-visible string held in a typed content layer.
period: "Jul – Sep 2026"
status: in-progress
tags: [Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Vercel]
repo: https://github.com/Damilss/therichmondsquare.com
live: https://www.therichmondsquare.com
role: Solo developer (client work)
---

Richmond Square is a retail plaza on San Pablo Avenue in Richmond, California, home to nine local businesses. The owner wanted a place customers could find the tenants and prospective tenants could find him, so I built a single page: navigation is five in-page anchors (`#directory`, `#about`, `#leasing`, `#visit`, `#contact`) with no sub-routes. It is live on Vercel behind Cloudflare, and the directory is the part that is finished.

![Richmond Square wordmark](/work-assets/therichmondsquare-com/logo.png)

## How it works

The rule the whole codebase holds to is that components hardcode nothing. `content/site.ts` (291 lines, typed by an exported `SiteContent` type) and `content/businesses.ts` (121 lines, nine tenant records) hold every string a visitor can see — copy, the address, hours, nav labels, form validation messages, even aria-labels — and the components import from there. Adding copy means extending the type first, which is deliberate: on client work the content is the thing that churns, and this way a copy change is a content edit rather than a hunt through JSX. Values the owner has not supplied yet stay marked `TODO: CLIENT DATA` or `TODO: CLIENT COPY` instead of being filled with a plausible guess; there are fifteen of those markers in `content/` today.

The tenant list was transcribed from the owner's signed-off sheet and is treated as the record of truth. Phone numbers are stored exactly as the sheet writes them and converted to `tel:` URIs only at render, so the string on screen always matches the document the owner approved. Map links work the same way — `lib/maps.ts` is a set of pure functions over an address string using a keyless Google embed, so the address exists in one place and nowhere else.

```ts
// lib/phone.ts
//
// Tenant phone numbers are stored verbatim from the owner's sheet
// (content/businesses.ts); normalize them into tel: URIs at render time only,
// so the displayed string always matches the sheet.

export function telHref(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return `tel:+${digits.length === 10 ? `1${digits}` : digits}`;
}
```
*The whole phone helper: display strings are never rewritten, only derived from.*

The UI primitives wrap Base UI in the shadcn `base-luma` style rather than Radix, which changes the idioms — polymorphism is `render={<a href="…" />}` with `nativeButton={false}`, and prop types come off the primitive namespace as `AccordionPrimitive.Root.Props`. The directory is a Base UI Accordion laid out as a grid of expand-in-place cards, rendered with `hiddenUntilFound` so collapsed panels stay in the DOM and browser find-in-page and crawlers can still reach the tenant descriptions.

## Where it stands

Built and deployed: the content layer, the design tokens, the header/footer/motion chrome, the `#directory` grid, and the owner-promo banner. `app/page.tsx` renders exactly those two sections. Not built: the `#about`, `#leasing`, `#visit`, and `#contact` sections that the nav links to, and the form handler behind them — their headings, blurbs, field labels, and validation strings are already written in `content/site.ts`, and Resend is installed as a dependency, but neither the sections nor the server handler exist yet. The last commit was 1 Sep 2026, and four asset commits sit on `dev` ahead of `main`.

## Highlights

- The site is live: `https://www.therichmondsquare.com` returns a prerendered page with all nine tenant cards in the HTML, served from Vercel through Cloudflare.
- Accessibility is structural rather than retrofitted — a global `MotionConfig reducedMotion="user"` provider, smooth anchor scrolling gated behind `prefers-reduced-motion: no-preference`, a skip link targeting `#main`, and 44px minimum tap targets via `h-11` / `size-11` on interactive elements, footer links included.
- The palette is a stark monochrome matched to the client's wordmark, defined once in `:root` with its AA contrast ratios recorded inline (~19.9:1 foreground on background, 21:1 primary on background). The site ships light-only; the `.dark` block is kept as an unused hook.
- Tenant intake is documented as a process: each business's supplied material is kept verbatim in an intake record, and the four places where that material disagrees with the owner's sheet are logged as open questions for him to settle rather than quietly reconciled by me.
- 18 commits between 22 Jul and 1 Sep 2026 on Next.js 16 and React 19, with Tailwind v4 configured CSS-first and no `tailwind.config`.
