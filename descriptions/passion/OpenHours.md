---
title: OpenHours
summary: Hackathon-built AI office hours where professors upload course files and students chat with an assistant scoped to those materials.
period: "May 2026"
status: shipped
tags: [Next.js, TypeScript, FastAPI, Supabase, pgvector, OpenAI API]
repo: https://github.com/Damilss/OpenHours
live: https://www.openhours.me
role: Co-founder, full-stack
links: [{ label: Devpost, href: https://devpost.com/software/openhours }]
---

OpenHours answers student questions from what the professor actually uploaded, instead of from the open internet. A professor creates a course, uploads PDFs or slide decks, and hands out a six-character join code; students enter the code and chat with an assistant whose prompt tells it to guide toward understanding rather than hand over answers. Four of us built it in a single day in May 2026 for a hackathon's Intellectual Pursuit track, and it is deployed at [openhours.me](https://www.openhours.me).

![OpenHours logo](/work-assets/OpenHours/logo.png)

## How it works

Uploads go to a FastAPI backend. It extracts text with pypdf or python-pptx (tagging each slide `[Slide n]`), splits it into 500-character chunks with 50 characters of overlap using LangChain's `RecursiveCharacterTextSplitter`, embeds the chunks with `text-embedding-3-small` in batches of 100, and inserts them into a Supabase Postgres table with a 1536-dimension pgvector column. Audio and video go through a local Whisper model when one is installed; Whisper is not in `requirements.txt`, so when it is missing the parser raises a plain message that the upload endpoint maps to a 400 rather than a stack trace.

A student question is embedded the same way and passed to one Postgres function, `match_documents`, which filters on the course id before ordering by vector distance and returns the six nearest chunks. Those chunks go into the system prompt along with the last six conversation turns, and `gpt-4o-mini` answers at temperature 0.4 with a 600-token cap. The prompt tells the model to treat the material as its primary source, flag anything it pulls from general knowledge, and steer off-topic questions back to the course. Every question is logged so the analytics page can cluster recent ones into topics.

The Next.js 16 frontend holds the landing page, Supabase Auth with professor and student roles, the student chat with a per-course session sidebar, and the professor dashboard with join codes, uploads, course deletion, and analytics. Its `app/api/*` routes are pure proxies to FastAPI that return a 502 when the backend is unreachable; all parsing, embedding, and model calls live in Python.

```python
def search_documents(
    supabase_client, course_id: str, query_embedding: List[float]
) -> List[str]:
    """Search pgvector for the most relevant document chunks."""
    result = supabase_client.rpc(
        "match_documents",
        {
            "query_embedding": query_embedding,
            "match_course_id": course_id,
            "match_count": MATCH_COUNT,
        },
    ).execute()

    return [row["content"] for row in (result.data or [])]
```
*Course-scoped retrieval: one pgvector RPC returns the six nearest chunks for that course, and nothing else reaches the model.*

## My part

I built this with Colin McDonald, Elias Santillan, and Tengis Tumur. I set up the Next.js scaffold, the landing page, and the styling passes that made the pages read as one product, brought in the logo and favicon assets, and added the 404 and post-signup email verification pages. I also owned the documentation and the deployment path: the README, the agent steering files, and the deploy guide covering Vercel for the frontend and Railway for the backend. A lot of that work was keeping the written record honest, repeatedly correcting the README's schema listing, endpoint table, and dependency list against what had actually been merged. In the days after the event I drafted the repository's license, terms, and privacy policy. One loose end survived my cleanup: I removed the email-a-professor feature and its booking page during the event, but the student page still renders a link pointing at the page I deleted.

## Highlights

- Retrieval is scoped in the database rather than the prompt: `match_documents` filters `where course_id = match_course_id` before ordering by distance, so one course's material cannot surface in another course's chat.
- Course access runs on auto-generated join codes. `courses.join_code` defaults to a six-character uppercase slice of a UUID, an `enrollments` table records who joined, and row-level security lets students manage only their own enrollments while professors read the roster for courses they own.
- Professor analytics pulls the last 200 logged questions, sends 50 to `gpt-4o-mini` in JSON mode to label three to eight topic clusters, and falls back to the first ten raw questions if that call fails.
- Three agent hooks ran automatically during the build: a Python review on every backend edit, an RLS-and-index review on schema edits, and a `next build` on every frontend save.
- The chat-history sidebar and the join-code enrollment flow were both written as spec files in the repo before they were implemented.
