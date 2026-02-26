import Link from "next/link";

export default function NotFound() {
  return (
    <main className="work-page-shell not-found-shell">
      <div className="ambient-layer" aria-hidden="true" />
      <div className="noise-layer" aria-hidden="true" />

      <section className="terminal-panel terminal-panel-compact" aria-label="404 panel">
        <div className="terminal-topbar">
          <div className="terminal-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="terminal-path mono">emilio@portfolio:~/404</p>
        </div>

        <p className="terminal-command mono">$ cat ./route.log</p>

        <div className="terminal-not-found-body">
          <p className="terminal-not-found-code mono">404: page_not_found</p>
          <p className="terminal-not-found-copy">
            The page you requested is unavailable or was moved. Use one of the
            commands below to return to valid routes.
          </p>

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
