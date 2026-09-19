---
title: West Coast Beauty Co.
summary: Client marketing site that replaced a Shopify Dawn storefront with a Next.js app, plus a Resend contact form and a public Instagram feed.
period: "Mar 2026 – present"
status: active
tags: [Next.js, TypeScript, React, Resend, Shopify Liquid, Vercel]
repo: https://github.com/Damilss/westcoastbeautyco.com
live: https://www.westcoastbeautyco.com
role: Solo developer, client project
---

West Coast Beauty Co. is a beauty and wellness studio that was running on a Shopify Dawn
storefront. They no longer wanted to sell online — they wanted a site that explains the
business — so I rebuilt the front end as a Next.js app and dropped commerce entirely, with
bookings handing off to Booksy from the main nav. The exported Dawn theme (v15.3.0, 95
`.liquid` files) is committed under `references/working-site` as a read-only reference for
matching the old layout and animations, which is why GitHub still labels the repo Liquid
even though none of it is served.

![The West Coast Beauty Co. homepage](/work-assets/westcoastbeautyco-com/site.jpg)

## How it works

Two integrations do the real work. The `/contact` form is a server action: it collapses
whitespace and length-caps each field, validates the email, then sends through Resend with
the submitter's address as the reply-to, so the studio can answer straight from its inbox.
Each failure path returns its own message — a missing API key, a missing sender address and
a malformed sender address all read differently — instead of reporting a silent success.

The homepage Instagram section reads a public Behold JSON feed client-side, with no API key
and no backend route of its own. Normalizing that payload is most of the work: carousel
posts fall back to their first child's media, videos use the poster size, and images walk a
medium → small → large → full ladder, because Behold does not guarantee every size exists.
One caveat worth naming — the profile's total-post count is a hardcoded constant I bump by
hand, and the most recent commits are exactly those bumps.

```tsx
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof DOMException && error.name === "AbortError") return;
        setHasError(true);
        setItems([]);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [limit, resolvedFeedUrl]);
```

*The feed fetch cancels on unmount and treats an AbortError as a non-error, so navigating
away mid-request never flips the section into its error state.*

## Highlights

- A migration rather than a fresh build: the untouched Dawn theme sits beside the shipped
  Next.js 16 / React 19 app as the reference for layout and motion parity.
- Animation parity comes from Motion, the renamed Framer Motion package. One `ScrollReveal`
  wrapper handles section reveals and is used 13 times on the home page alone.
- Styling is per-component CSS Modules, with Tailwind v4 supplying theme tokens and a few
  layout utilities — not a Tailwind-first build.
- A BottleRock 2026 campaign added a dedicated landing page and an iPhone-style scripted
  texting demo that answers common questions through tappable prompt chips.
- The campaign's homepage promo gates itself on three storage keys: a permanent visited
  flag, a 24-hour popup re-show timestamp, and a session-scoped banner dismissal. The
  override that forces the popup on every load for client demos is still enabled on `main`.
- Each campaign feature shipped with an implementation log and a written retirement guide
  listing every file, prop, storage key and asset to unwind once the event passes.
