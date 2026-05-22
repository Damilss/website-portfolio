[repo link](https://github.com/Damilss/generational-wealth-inequality)

# Generational Wealth Inequality

> A one-page project site for an ENGL 133 research project on wealth inequality in California.

A built-from-scratch one-page site presenting an ENGL 133 research project on
generational wealth inequality in California. It pairs the writing with data
visualizations and scroll-driven motion — a research paper reframed as
something you scroll through.

![The racial wealth gap in California](/work-assets/generational-wealth-inequality/screenshot.jpg)

## How it's built

It's a single Next.js page driven by section data, with a small reusable
`ScrollReveal` wrapper that fades and lifts each section into view as you
scroll — built on Framer Motion's `whileInView`:

```tsx
export default function ScrollReveal({
  children, className, delay = 0, duration = 0.7,
  y = 18, amount = 0.12, once = true,
}: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

*One small wrapper — every section on the page reveals through it.*

![State minimum wages, January 2025](/work-assets/generational-wealth-inequality/state-map.jpg)

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4, Framer Motion

## Status

Archived — ENGL 133 coursework.
