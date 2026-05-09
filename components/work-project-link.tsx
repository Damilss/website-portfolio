// =============================================================================
// WorkProjectLink — a Next.js <Link> that ALSO writes the target project's
// slug to sessionStorage before navigating.
//
// Why this exists:
//   The home page's Selected Work rows need to navigate to /work AND make sure
//   the target card is scrolled into view on arrival. The naive way is to use
//   `/work#<slug>` URLs, but Next's router and the browser's native anchor-
//   jump fight a smooth-scroll effect on the destination side.
//
//   So instead, we navigate to bare `/work` (no hash) and stash the slug in
//   sessionStorage["pendingScroll"]. The /work page's mount effect reads that
//   key and performs a smooth scrollIntoView. See app/work/page.tsx — the
//   useEffect at the top of the component is the receiver.
//
// Marked "use client" because sessionStorage is browser-only.
// =============================================================================
"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export default function WorkProjectLink({
  slug,
  className,
  children,
}: {
  slug: string;       // matches the <li id="..."> on /work the user wants to land on.
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      className={className}
      // Bare /work — intentionally no hash. The hash would trigger native
      // anchor-jump behavior, which fights the smooth-scroll on the destination.
      href="/work"
      // Set the pendingScroll key on click. We don't preventDefault — Next's
      // <Link> still navigates as normal. The /work page's mount effect picks
      // this up and scrolls to the matching id, then clears the key.
      onClick={() => sessionStorage.setItem("pendingScroll", slug)}
    >
      {children}
    </Link>
  );
}
