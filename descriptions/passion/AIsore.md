[repo link](https://github.com/TobiasH453/AIsore) · [aisoreapp.com](https://aisoreapp.com)

# AIsore

> Tell whether text, photos, video, or links were made by a human or by AI.

AIsore is an AI content-detection platform. You submit content through the
mobile app; the backend scores it on a human-to-AI spectrum and returns a
verdict — Likely AI, Likely Human, or Uncertain — with a confidence score and
the suspected model. It runs on a credit system, so every detection has a
clear, metered cost.

![AIsore logo](/work-assets/AIsore/logo.png)

## How it works

Detections are slow and external — they call the Hive AI API — so the API
never blocks on them. Each request is gated on the user's credit balance,
validated, written to Postgres as a `DetectionJob`, and pushed onto a
Redis-backed BullMQ queue. A separate worker drains the queue, calls Hive, and
writes the result back; the mobile app polls a status endpoint until the job
finishes.

```ts
// POST /api/detect/text — credit-gate, validate, enqueue an async job
const CREDIT_COSTS = { VIDEO: 10, PHOTO: 4, TEXT: 2, LINK: 10 } as const;

router.post("/text", async (req, res, next) => {
  const userId = (req as any).userId;

  if (!(await hasCredits(userId, CREDIT_COSTS.TEXT))) {
    res.status(402).json({ error: { code: "INSUFFICIENT_CREDITS" } });
    return;
  }

  const { text } = textSchema.parse(req.body);

  const job = await prisma.detectionJob.create({
    data: { userId, contentType: "TEXT", status: "PENDING" },
  });
  await detectionQueue.add("detection", { jobId: job.id, userId, input: { text } });

  res.status(202).json({ job_id: job.id, status: "processing" });
});
```

*Every detection route follows the same shape: check credits → validate with Zod → persist a job → enqueue → return `202`.*

## Credit model

| Content type | Credits |
|---|---|
| Text | 2 |
| Photo | 4 |
| Video | 10 |
| Link | 10 |

Free plan: 30 credits/month. Pro: 350 credits/month at $4.99/mo.

## Tech stack

- **Backend** — Node.js, Express 5, TypeScript, PostgreSQL + Prisma, BullMQ + Redis, JWT auth with refresh-token rotation, Zod
- **Mobile** — React Native 0.76, Expo 52, Expo Router, plus an iOS Share Extension so content can be checked straight from other apps
- **Infrastructure** — Hive AI for detection, DigitalOcean Spaces for file storage

## Status

Active — proprietary, all rights reserved.
