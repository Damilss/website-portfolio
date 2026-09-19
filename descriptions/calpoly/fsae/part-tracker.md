---
title: FSAE Part Tracker
summary: CI, secret scanning, and dependency hardening for Cal Poly FSAE's internal part-tracking web app, a SvelteKit site on Cloudflare Pages and D1.
period: "Aug – Sep 2026"
status: in-progress
role: CI & tooling contributor
tags: [SvelteKit, Cloudflare, Drizzle ORM, GitHub Actions, Bash]
---

Part Tracker is the Cal Poly FSAE team's internal web app for tracking car parts, built by the
team's software group on SvelteKit and Tailwind with Drizzle ORM, Better Auth (Slack sign-in), and
Cloudflare D1 and Pages. The app itself was written by a teammate; my contribution was the layer
around it: the CI gate, secret scanning, dependency hardening, and the doc that explains them. The
repo is private to the team's GitHub org, so it isn't linked here.

## My part

I started with dependencies. Two transitive packages, `esbuild` and `cookie`, had published
advisories (GHSA-67mh-4wv8-2f99 and GHSA-pxg6-pf52-xh8x), so I added pnpm `overrides` that force
patched versions through the packages that pull them in, and pinned Node 24 in `.nvmrc` so everyone
builds on the same runtime.

Next was CI. I first added a GitHub Actions workflow that ran `pnpm run lint`, `pnpm run check`, and
`pnpm run build`; at a teammate's request I then deleted it and moved lint and typecheck into the
existing Cloudflare Pages build script, so the checks run inside the Pages build script instead of in
a second pipeline.

The larger piece is secret scanning. The Gitleaks workflow runs on pushes and pull requests to
`main` plus manual dispatch. Rather than the official `gitleaks/gitleaks-action`, which is
proprietary and wants a paid license key for org-owned repos, it downloads the MIT-licensed CLI at a
pinned version and checks out full history so the scanner can walk commits. The scan range depends
on the trigger: a PR scans only `base..head`, a push scans `before..after`, and a branch's first push
or a manual run scans everything. Every run passes `--redact` and uploads a JSON report as an
artifact even when the scan fails, so a finding is debuggable without reprinting the secret into
logs that anyone with repo access can read.

```yaml
      - name: Install gitleaks
        run: |
          set -euo pipefail
          curl -sSfL \
            "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz" \
            | sudo tar -xz -C /usr/local/bin gitleaks
          gitleaks version
```
*Installing the pinned Gitleaks CLI directly instead of the license-gated action; the version is set once in the workflow's `env`.*

## Highlights

- 22 of the repo's 67 commits, all in CI, secret scanning, dependency overrides, and docs; the CI branch merged to `main` on Sep 14, 2026.
- The Gitleaks config extends the default rules and allowlists only placeholder, generated, and lock files by path; `wrangler.jsonc` is deliberately left unexempted so a real secret committed there still fails the gate.
- The tooling doc covers reproducing the scan locally, bumping the pinned version in one place, and preferring a per-rule allowlist or a `gitleaks:allow` comment over a whole-file exemption.
- Scheduled scans were dropped on Sep 9; a full-history re-audit is now a manual dispatch.

## Where it stands

The tooling is merged. The app is early: today it has a sign-in page and a home page, the database
schema is still just Better Auth's tables, and the part-tracking schema and queries haven't been
written yet. There is no test suite, so nothing in the gate covers tests.
