---
title: lilianal.com
summary: Freelance Next.js site for a Bay Area mortgage loan originator and realtor, built around a unit-tested mortgage payment estimator.
period: "Dec 2025 – Mar 2026"
status: paused
tags: [Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Vitest]
repo: https://github.com/Damilss/lilianal.com
live: https://lilianal-com.vercel.app
role: Solo developer, freelance client work
---

A freelance site for a Richmond and Bay Area mortgage loan originator and realtor who handles both
sides of a purchase, the financing and the listing. It is a frontend-only Next.js build: a long-scroll
home page (hero, about, who we serve, services, process, testimonials, calculator, contact) plus
`/services`, `/contact`, a custom 404, and an `/about` route that only redirects to a home-page anchor.

## How it works

The estimator is the one piece of real logic here, and its arithmetic sits in a single dependency-free
module that takes eight numbers and returns a payment breakdown. It normalizes before it calculates:
non-finite values become 0, negatives clamp to 0, home price floors at 1, the down payment is capped
at the home price, and the term floors at one year, so a half-typed input can't put `NaN` on screen.
PMI applies only when the down payment is under 20% and the loan is non-zero — the rule the helper
text reads from.

The calculator is a client component that owns the inputs, recomputes the estimate through
`useMemo` on every keystroke, and formats output with `Intl.NumberFormat` in USD. It clears a
field's validation error as soon as that field is edited, and re-caps the down payment whenever
either it or the home price changes, so the two can never disagree.

```ts
  if (principal === 0) {
    return 0;
  }

  if (annualRate === 0) {
    return principal / months;
  }

  const monthlyRate = annualRate / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, months);

  return (principal * monthlyRate * factor) / (factor - 1);
```

*The amortization formula, with a zero-rate branch that avoids dividing by `factor - 1` when it is 0.*

## Highlights

- Vitest with jsdom and Testing Library covers the math and the UI: a 30-year $400,000 loan at
  6.5% is asserted to ~$2,528.27, a 0% loan falls back to a straight principal split, and an
  invalid input set (NaN price, negative term) sanitizes down to a $1 loan instead of throwing.
- The UI tests drive the real component: changing the home price must change the rendered total,
  and the PMI helper copy must flip when the down payment crosses 20%.
- The contact form validates with React Hook Form and a Zod resolver, then fires a tsParticles
  confetti burst, resets, and confirms through an `aria-live` region. There is no network call
  yet, and the form says so itself: "No backend delivery yet. UI flow only."
- Motion is two reusable primitives rather than one-off animations: a `whileInView` reveal
  wrapper parameterized by delay, duration, offset and viewport amount, and a badge that repeats
  its label around an SVG circular `textPath` using a `useId`-derived path id.
- Tailwind v4 theming is CSS-first: the brand palette is declared as custom properties and
  re-exported through `@theme inline`, with two Google fonts loaded via `next/font`.

## Where it stands

Paused. 36 commits between December 2025 and March 2026, nothing since the confetti change merged on
16 March 2026. The build deploys and serves on Vercel, but the client's own domain still resolves
through GoDaddy nameservers to a website-builder page, so the cutover has not happened and the link
above is the Vercel URL. Inside the site, the three testimonial cards are still placeholder copy
waiting on real reviews, and the contact form needs an email integration before submissions deliver.
