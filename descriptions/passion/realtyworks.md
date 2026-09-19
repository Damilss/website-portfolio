---
title: RealtyWorks
summary: Work-order platform for property managers where vendors sign in through a magic link and Postgres row-level security is the authorization model.
period: "Mar 2026 – present"
status: in-progress
tags: [Next.js, TypeScript, Supabase, PostgreSQL, Playwright, GitHub Actions]
repo: https://github.com/Damilss/RealtyWorks
role: Solo developer
featured: 3
---

RealtyWorks is a maintenance-operations tool for property managers and landlords. A work order is opened against a property or unit, assigned to a vendor, moved through statuses with notes and photo or receipt attachments, and every change lands in a timestamped activity trail. The design bet was written into the engineering guide in May 2026, two months before the first migration existed: the audit trail is a product feature, not a nice-to-have. That decides the rest of the system, because a trail that depends on a handyman finishing a signup form is a trail with holes in it.

## How it works

There is no separate backend service. The app is one Next.js 16 App Router codebase on Supabase; backend logic lives in Postgres (RLS policies, check constraints, triggers) and in Next.js server actions and route handlers, with Supabase Edge Functions reserved for a later phase. I enforce authorization in the database rather than the UI. Every table's RLS policies ship in the same migration that creates it, so staff read every work order while a vendor sees only rows where `vendor_id = current_vendor_id()` — a one-line `security definer` lookup of the caller's vendor row. The enforcement is split three ways: RLS picks rows; column grants handle the uniform rules (`status` and `vendor_id` are excluded from INSERT, so every order starts `open` and assignment is an audited UPDATE); and the one role-dependent rule, that a vendor may change only `status`, is a `BEFORE UPDATE` trigger, because landlord, manager and vendor all share the same Postgres role.

```sql
create function public.guard_work_order_update() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if public.current_app_role() = 'vendor' then
    if (to_jsonb(new) - 'status' - 'updated_at')
       is distinct from (to_jsonb(old) - 'status' - 'updated_at') then
      raise exception 'vendors may only change work order status' using errcode = '42501';
    end if;
    if new.status is distinct from old.status
       and new.status not in ('in_progress', 'completed') then
      raise exception 'vendors may only move a work order to in_progress or completed'
        using errcode = '42501';
    end if;
```
*The fail-closed vendor guard: it diffs the whole row as JSON rather than listing columns, so a column added in a later migration is protected without touching the trigger.*

The trail is written by the database too, not by the app. An `AFTER` trigger on `work_orders` logs creation, status changes and reassignment with old and new values; clients hold an INSERT grant on only `(work_order_id, note)`, so the action and actor columns fall to their defaults; and the table has no UPDATE and no DELETE policy for anyone. The history is append-only by construction rather than by convention.

Vendors never create an account. Staff press "Create sign-in link" on a work order; the server action creates a Supabase auth user for the vendor contact, mints a magic-link token with `auth.admin.generateLink`, and builds a URL to `/auth/confirm`, which redeems the token with `verifyOtp` into a server-written cookie session and deep-links to the job. Because the vendor is a real authenticated user, `auth.uid()` exists, the same RLS policies cover the least-trusted actor, and the activity trail names a person rather than "someone with a valid link". The token is single-use and expires after an hour; revoking access is unlinking the vendor row from its auth user, which resolves to null on the very next request, mid-session. The `next` destination in that link is parsed with the URL parser, reduced to a same-origin path, and then parsed a second time and required to still mean the same thing — a round trip rather than a denylist, which is what closes both `/\evil.example` on the way in and `//evil.example` on the way out.

Exactly one Supabase client bypasses RLS. It exists for the two writes that have no client grant by design (attachment metadata, which is inserted only after the file is confirmed in Storage, and the vendor-to-auth-user link) plus the invite's `auth.admin` calls, and it is only reached after the caller's own session has established access. It reads its secret at call time rather than at module scope, so `next build` in CI succeeds with no Supabase stack, and it refuses to start with a publishable key, since that would silently run the privileged writes under RLS.

## Where it stands

Phases 1–3 are done: tooling and CI, the schema with RLS and a pgTAP suite, and a vertical slice merged to `main` on 2026-08-04 (PR #94) in which a manager signs in, creates a work order, assigns a vendor and mints a link, and the vendor opens it, updates status and uploads a photo, with the trail recording each step. Email confirmation for self-service signup landed 2026-08-25. The app runs only against a local Supabase stack today; Phase 4, a hosted deployment on Vercel and Supabase Cloud with PR previews, is next and is the critical path. The repo is public, but the license is proprietary.

## Highlights

- CI runs three parallel jobs on every push and pull request: `verify` (lint, format check, typecheck, unit tests, build, then a blocking `pnpm audit --audit-level=high`; each step still runs after an earlier failure so one run reports every problem), `e2e` (boots an eight-container Supabase stack, resets it to the seed, and runs the Playwright slice against the real app), and `db` (a three-container stack running the 94-assertion pgTAP RLS and write-guard suite).
- The Playwright vendor-loop spec redeems a real magic link in a second browser context, then checks that a replayed token is rejected, that reassignment clears the outgoing vendor's link, and that `/auth/confirm` refuses a hostile post-login destination while still deep-linking to the job.
- A self-registered account is deliberately inert: it lands as a vendor profile with no link to a vendor row, so RLS returns nothing until staff link it.
- Session refresh runs in `src/proxy.ts` (Next.js 16 renamed the root `middleware` convention to `proxy`); the browser and per-request server clients both use the publishable key, so RLS applies identically on both sides.
- Beyond CI, the repo runs gitleaks over the full history, Semgrep SAST, a weekly osv-scanner lockfile scan, and Dependabot.
- About 9,800 lines of TypeScript across 75 files, 24 Vitest and Playwright test files, and 14 SQL migrations.
