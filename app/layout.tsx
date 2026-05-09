// =============================================================================
// Root layout — wraps every route in the App Router.
//
// Next.js 16 / App Router calls this for ANY page under `app/`. Anything here
// (the <html>/<body> wrapper, global styles, metadata) applies site-wide.
// Per-route metadata can override `metadata` below from the leaf page file.
//
// This layout is intentionally minimal: there's no top-level nav or shared
// chrome — each page (home, /work, 404) renders its own header and footer
// inline so they can diverge visually (see CLAUDE.md "Architecture").
// =============================================================================
import type { Metadata } from "next";
// Importing globals.css here (and only here) is what makes the stylesheet
// apply across every route. globals.css holds the entire design system —
// color tokens, terminal panel chrome, motion timings, etc.
import "./globals.css";

// Default <head> metadata. Next.js renders these into <title> and
// <meta name="description"> automatically. Individual pages can export their
// own `metadata` object to override these on a per-route basis.
export const metadata: Metadata = {
  title: "Emilio Ledesma | Computer Engineer",
  description:
    "Personal portfolio focused on minimal interfaces, strong interaction design, and modern frontend systems.",
};

// `RootLayout` MUST render <html> and <body> — the App Router requires it.
// The `children` prop is whatever route is currently active (e.g. app/page.tsx
// for `/`, app/work/page.tsx for `/work`, etc.).
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // lang="en" is important for accessibility (screen readers) and SEO.
    <html lang="en">
      {/* `antialiased` is a Tailwind utility class — smooths font rendering
          on macOS/iOS WebKit. No other body-level classes; per-page shells
          (`portfolio-shell`, `work-page-shell`) handle layout. */}
      <body className="antialiased">{children}</body>
    </html>
  );
}
