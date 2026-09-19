---
title: AIsore
summary: AI-detection app scoring text, photos, video, and links; I worked on failure handling, error reporting, and secret scanning.
period: "May – Jun 2026"
status: paused
tags: [TypeScript, Express, BullMQ, PostgreSQL, React Native, GitHub Actions]
live: https://aisoreapp.com
role: Backend, mobile, and CI/security contributor
---

AIsore is a mobile app for checking whether a piece of text, a photo, a video, or a link points to AI-generated content. It returns a verdict on a five-step scale from AI to Human, a confidence score, and a suspected generator model, and every check costs credits — 2 for text, 4 for a photo, 10 for a video or link — against a monthly allowance. The repo belongs to a teammate, who built the first Expo app and Express API over five days; I started contributing the day his last commit landed, and most of what followed is mine. It grew out of an earlier Lovable-generated web prototype whose detection results were mocked in the browser.

![AIsore logo](/work-assets/AIsore/logo.png)

## How it works

The mobile client never calls a detection provider directly. Each submission is credit-gated, validated with Zod, written to Postgres as a detection job, and pushed onto a Redis-backed BullMQ queue; the route answers 202 with a job id. A worker in the same Node process drains the queue, sends photos and video to one provider and text to another, writes the analysis, and deducts credits only on success while the app polls a status endpoint. Link submissions are downloaded with yt-dlp first, which is where most of the real-world failures came from.

## My part

The first piece was link submissions failing at the download step, where the app surfaced whatever text came back as a bare alert. I added a failure classifier that turns downloader and provider errors into a small set of user-safe error codes plus a finer-grained telemetry reason, a hostname-based platform tagger (handling `youtu.be`, `x.com`, and `fb.watch`, and rejecting lookalike hosts like `instagram.com.evil.com`), and Sentry reporting tagged with `detection_platform`, `error_code`, and `failure_reason`. The submitted URL is stripped from both the error message and its stack before send and replaced by a hash, since Sentry indexes both. On the mobile side I replaced four copied polling loops and their bare alerts with one shared poll function and error presenter giving code-keyed titles, a Retry action, and a prefilled "Report this link" action for fetch failures.

The second piece was secret hygiene. I added a gitleaks GitHub Actions gate that scans the full commit history on every pull request and push to main, with the tool version and its SHA-256 checksum pinned in the workflow, plus a matching pre-commit hook, an allowlist config, and a rotation runbook. Along the way I expanded the three READMEs, pinned the Node version, aligned the mobile dependencies to Expo SDK 52, and fixed the Xcode Cloud archive build.

```ts
export function classifyDownloadStderr(stderr: string, hasCookies: boolean): FailureReason {
  const s = (stderr || '').toLowerCase();

  if (/timed out|timeout/.test(s)) return 'timeout';

  // Login / auth wall (Instagram et al). The platform message often combines this with
  // "rate-limit", so check it before the rate-limit pattern.
  if (
    /login required|requested content is not available|content is not available|sign in to confirm|only available for registered|account is private|this video is private/.test(
      s
    )
  ) {
    return hasCookies ? 'cookies_rejected' : 'auth_required';
  }
```
*Classifying a download failure: a login wall hit with an authenticated session present means the session was rejected, which is a different alert from a plain anonymous login wall.*

## Highlights

- Failed jobs never persist raw tool output; the status endpoint returns only a classified code and its friendly message.
- Tagging failures by platform and reason turns a spike on one source, or a rejected session, into an alert rather than a support ticket.
- The secret-scan workflow checks out with full history, so every commit is scanned rather than just the diff, and the pre-commit hook pins the same tool version.
- Backend tests run on Vitest and include four `fast-check` property-test suites covering credits, cleanup, text validation, and the video downloader.
- 66 of the repo's 125 commits are mine (9 of them merges), spanning 18 May to 22 June 2026.

## Where it stands

The backend, the mobile app with its iOS share extension and Android share intent, and the secret-scan CI are all in place. The last commit on any branch is 22 June 2026, so the project is stopped rather than finished.
