"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export default function WorkProjectLink({
  slug,
  className,
  children,
}: {
  slug: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      className={className}
      href="/work"
      onClick={() => sessionStorage.setItem("pendingScroll", slug)}
    >
      {children}
    </Link>
  );
}
