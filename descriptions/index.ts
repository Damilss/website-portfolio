// =============================================================================
// descriptions/index.ts — extended-description registry for the /work modal.
//
// ProjectModal looks up `extendedDescriptions[project.id]` when a card is
// clicked. If a component exists for that id, it renders inside the modal
// below the short description. If not, the modal falls back to today's
// behavior (short description only) — no visual regression.
//
// To add a new extended description:
//   1. Create `descriptions/<slug>.tsx` that default-exports a React component.
//      The slug MUST match the card's `id` on /work and the home `projects[].slug`.
//   2. Import it here and add an entry to the map below.
//
// Assets for each project live under `public/projects/<slug>/` so `next/image`
// can serve them directly.
// =============================================================================
import type { ComponentType } from "react";

import MustangMarket from "./mustang-market";

export const extendedDescriptions: Record<string, ComponentType> = {
  "mustang-market": MustangMarket,
};
