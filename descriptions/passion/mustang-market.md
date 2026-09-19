---
title: Mustang Market
summary: A peer-to-peer marketplace for verified Cal Poly students, built as a Next.js PWA and an Expo iOS app on a shared Firebase backend.
period: "Jan 2026 – present"
status: active
tags: [Next.js, TypeScript, Firebase, Cloud Firestore, React Native, Expo]
live: https://mustang-market.com
role: Co-founder, full-stack
featured: 2
---

Mustang Market is a peer-to-peer marketplace for the Cal Poly student community. I co-founded it
in January 2026 as one of three founders. Sign-in is restricted to `@calpoly.edu` accounts, so
every buyer and seller is a verified student, and the whole flow is built around meeting on
campus: students post products, services, rideshare routes, and housing, negotiate in real-time
chat, hand the item off in person, and rate each other afterward. It is an independent student
project, not a Cal Poly service, and it deliberately does not handle money — buyers and sellers
settle up between themselves however they agree.

![Mustang Market app icon](/work-assets/mustang-market/icon.png)

## How it works

We run two clients against one Firebase project. The web app is Next.js 16 on the App Router with
React 19, strict TypeScript, and Tailwind CSS 4, deployed to Vercel as an installable PWA — 21 page
routes and 4 API route modules, with privileged writes going through Server Actions and the
Firebase Admin SDK. The mobile app is Expo SDK 54 on React Native with Expo Router: 30 screens
backed by 10 Cloud Functions. Both clients read and write the same Cloud Firestore data. Both
repositories are private, so there is no repo link here.

Trust comes from identity rather than from holding money. On web, sign-in is Firebase Auth with
Microsoft OAuth plus a Cal Poly domain check; on mobile, Microsoft SSO or Apple Sign In is followed
by a six-digit code mailed to the student's campus address, which expires after ten minutes and is
throttled to three requests per ten-minute window. A listing moves from active to sold to
completed: the seller marks it sold and selects the buyer from the people who messaged them, the
buyer confirms receipt, and each side can then leave a 1–5 star rating that rolls into the average
shown on their profile. Listing text is screened by an LLM before it goes live, and the first photo
can optionally prefill title, description, category, condition, and a suggested price.

## My part

The original search only filtered the 50 listings the browser had already loaded, so anything on a
later page was invisible. Firestore has no full-text search, so I put the index on the listing
itself: at write time its text is normalized and tokenized, every token also emits its 2-to-12
character prefixes, and the result is capped at 180 terms per document. A query is tokenized the
same way and capped at 10 terms — Firestore's `array-contains-any` limit — then run across all
active inventory with cursor pagination. Each page is scored in the client on match quality (exact
title, title prefix, title/category/description hits, number of matched terms) plus a freshness
boost that decays with age. Existing listings had no index, so I also wrote an idempotent Admin SDK
migration that walks them 200 documents at a time and rewrites only the records whose derived index
actually changed, which makes it safe to re-run.

Earlier, in January, I built the first real-time messaging layer: a conversation ID derived
deterministically from the listing and the two sorted user IDs, so a buyer and seller can never end
up with duplicate threads; snapshot listeners for live inbox and message updates; a per-user read
timestamp compared against the conversation's last-message time to drive an unread-conversations
badge; and bounded queries so the inbox never pulls unbounded history. Teammates later layered
offers, reactions, unsend, and push notifications on top of it. I then built ratings and reviews
end to end — 1–5 stars with an optional review truncated to 500 characters, authenticated routes
that verify the caller really is the buyer or seller on that listing, duplicate-submission
protection, and a Firestore transaction that updates the ratee's average and count atomically. To
cut drive-by ratings, neither party can rate until both have sent at least five messages in the
thread. That gate is a heuristic, not proof that a handoff happened.

Two smaller pieces on web: the PWA install funnel, which is a custom install banner plus an
instructions page that detects the visitor's platform and shows separate steps for iOS/iPadOS
Safari, Android Chrome, and desktop; and a 38-file strict-TypeScript cleanup in April that replaced
unsafe `any` paths with concrete location and error types, moved derived map URLs into memoized
computation, made browser-relative timestamps client-safe, and fixed the server/client hydration
mismatches those timestamps were causing. On mobile I set up the initial Expo repository and its
Firebase client foundation in January; a co-founder built most of the native app from there, took
it through TestFlight in February, and pushed the first App Store build in March 2026.

## Highlights

- Search covers every active listing instead of the 50 already in the browser: up to 180 prefix
  terms per listing, 10-term queries, relevance-plus-freshness scoring, 250 ms input debounce.
- The search backfill reindexes legacy listings 200 documents per batch and skips unchanged
  records, so it is safe to re-run.
- Ratings are 1–5 stars with reviews up to 500 characters, transactional profile averages, and a
  five-messages-from-each-party gate before either side can rate.
- Listing photos (up to eight) are converted from HEIC, resized to a 1920×1920 bound, and
  re-encoded at JPEG quality 0.8 in the browser before upload.
- The strict-TypeScript pass touched 38 files (302 additions, 227 deletions) across UI, server
  actions, Firebase utilities, notifications, messaging, and map components.
- Team codebase scope: roughly 19.6k lines on web and 30.3k on mobile.
