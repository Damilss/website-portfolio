// =============================================================================
// 404 page — rendered by Next.js for any route that doesn't match a defined
// page in the App Router. The filename `not-found.tsx` is a Next convention.
//
// Visually, this reuses the same "terminal panel" language as /work so the
// 404 doesn't feel like a different site. CLAUDE.md notes this design intent:
// the 404 is in the same terminal panel language as /work.
// =============================================================================
import Link from "next/link";

export default function NotFound() {
  return (
    // We piggy-back on `work-page-shell` (the /work page wrapper) so background,
    // spacing and max-width match. `not-found-shell` adds 404-specific tweaks
    // (centering, smaller content area) on top.
    <main className="work-page-shell not-found-shell">
      {/* Same decorative ambient glow + film-grain layers as the rest of the
          site. aria-hidden because they're purely visual. */}
      <div className="ambient-layer" aria-hidden="true" />
      <div className="noise-layer" aria-hidden="true" />

      {/* `terminal-panel-compact` shrinks the panel for the lighter 404 content. */}
      <section className="terminal-panel terminal-panel-compact" aria-label="404 panel">
        {/* Faux macOS-terminal topbar: traffic-light dots + path label.
            Path uses `~/404` to play into the bit. */}
        <div className="terminal-topbar">
          <div className="terminal-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="terminal-path mono">emilio@portfolio:~/404</p>
        </div>

        {/* Faux shell command — purely decorative, sets the terminal motif. */}
        <p className="terminal-command mono">$ cat ./route.log</p>

        <div className="terminal-not-found-body">
          {/* The "error code" line, styled like a terminal log entry. */}
          <p className="terminal-not-found-code mono">404: page_not_found</p>
          <p className="terminal-not-found-copy">
            The page you requested is unavailable or was moved. Use one of the
            commands below to return to valid routes.
          </p>

          {/* Recovery actions — back to home or jump straight to /work.
              Using <Link> (not <a>) so navigation stays client-side. */}
          <div className="terminal-actions">
            <Link className="terminal-link mono" href="/">
              go_home
            </Link>
            <Link className="terminal-link mono" href="/work">
              open_work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
