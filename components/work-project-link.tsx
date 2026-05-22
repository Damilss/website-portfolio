// =============================================================================
// WorkProjectLink — a thin Next.js <Link> wrapper for the home page's
// "Selected Work" rows.
//
// Each row deep-links straight to that project's detail page under the /work
// finder (e.g. /work/passion/mustang-market). This is a plain passthrough to
// <Link>; it stays a named component so the home page JSX reads clearly and is
// easy to keep in sync with the `projects` array there.
// =============================================================================
import Link from "next/link";
import type { ReactNode } from "react";

export default function WorkProjectLink({
  href,
  className,
  children,
}: {
  href: string; // the project's detail-page path, e.g. "/work/passion/mustang-market".
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}
