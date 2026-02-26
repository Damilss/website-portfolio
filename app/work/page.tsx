import Link from "next/link";
import Footer from "@/components/footer";

export default function WorkPage() {
  return (
    <main className="work-page-shell">
      <div className="ambient-layer" aria-hidden="true" />
      <div className="noise-layer" aria-hidden="true" />

      <header className="work-page-header">
        <p className="work-page-kicker">Project Index / Terminal View</p>
        <h1>View Work</h1>
        <p className="work-page-copy">
          A focused archive for projects I have shipped or am actively building.
          Replace this data with your real links and deployment URLs.
        </p>
        <Link className="work-back-link mono" href="/">
          cd .. /home
        </Link>
      </header>

      <section className="terminal-panel" aria-label="Projects terminal panel">
        <div className="terminal-topbar">
          <div className="terminal-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="terminal-path mono">emilio@portfolio:~/work</p>
        </div>

        <p className="terminal-command mono">$ ls -la ./projects</p>


        <ol className="terminal-projects">
          {/* Project 01 */}
          <li id="mustang-market" className="terminal-project-card">
            <header className="terminal-project-head">
              <span className="terminal-project-index mono">01</span>
              <h2>Mustang Market</h2>
              <span className="terminal-status mono terminal-status-active">
                active
              </span>
            </header>

            <p className="terminal-summary">
              Peer-to-peer `.edu`-verified marketplace built for Cal Poly SLO.
            </p>

            <div className="terminal-meta-row">
              <p className="mono">year: Jan 2026</p>
              <p className="mono">stack:</p>
              <ul className="terminal-stack" aria-label="Mustang Market stack">
                <li className="mono">Next.js</li>
                <li className="mono">TypeScript</li>
                <li className="mono">Firebase</li>
                <li className="mono">Stripe Connect</li>
                <li className="mono">Firestore</li>
                <li className="mono">Vercel</li>
              </ul>
            </div>

            <div className="terminal-actions">
              <a
                className="terminal-link mono"
                href="https://mustang-market.com"
                target="_blank"
                rel="noreferrer"
              >
                open_live
              </a>
            </div>
          </li>

          {/* Project 02 */}
          <li id="streaming-qa-automation-console" className="terminal-project-card">
            <header className="terminal-project-head">
              <span className="terminal-project-index mono">02</span>
              <h2>Streaming QA Automation Console</h2>
              <span className="terminal-status mono terminal-status-shipping">
                shipping
              </span>
            </header>

            <p className="terminal-summary">
              Terminal-like test orchestration dashboard for browser suites,
              retries, snapshots, and flaky-run diagnostics.
            </p>

            <div className="terminal-meta-row">
              <p className="mono">year: 2025</p>
              <p className="mono">stack:</p>
              <ul
                className="terminal-stack"
                aria-label="Streaming QA Automation Console stack"
              >
                <li className="mono">Playwright</li>
                <li className="mono">Node.js</li>
                <li className="mono">Redis</li>
                <li className="mono">GitHub Actions</li>
              </ul>
            </div>

            <div className="terminal-actions">
              <a
                className="terminal-link mono"
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
              >
                open_repo
              </a>
            </div>
          </li>

          {/* Project 03 */}
          <li id="motion-first-design-system" className="terminal-project-card">
            <header className="terminal-project-head">
              <span className="terminal-project-index mono">03</span>
              <h2>Motion-First Design System</h2>
              <span className="terminal-status mono terminal-status-active">
                active
              </span>
            </header>

            <p className="terminal-summary">
              Design token framework for consistent interaction timing,
              transitions, and accessibility-safe animation defaults.
            </p>

            <div className="terminal-meta-row">
              <p className="mono">year: 2025</p>
              <p className="mono">stack:</p>
              <ul className="terminal-stack" aria-label="Motion-First Design System stack">
                <li className="mono">React</li>
                <li className="mono">Tailwind</li>
                <li className="mono">Storybook</li>
                <li className="mono">A11y</li>
              </ul>
            </div>

            <div className="terminal-actions">
              <a
                className="terminal-link mono"
                href="#"
                target="_blank"
                rel="noreferrer"
              >
                open_live
              </a>
            </div>
          </li>

          {/* Project 04 */}
          <li id="headless-cms-delivery-engine" className="terminal-project-card">
            <header className="terminal-project-head">
              <span className="terminal-project-index mono">04</span>
              <h2>Headless CMS Delivery Engine</h2>
              <span className="terminal-status mono terminal-status-archived">
                archived
              </span>
            </header>

            <p className="terminal-summary">
              Content pipeline that normalizes CMS payloads and serves typed
              contracts for high-performance frontend delivery.
            </p>

            <div className="terminal-meta-row">
              <p className="mono">year: 2024</p>
              <p className="mono">stack:</p>
              <ul className="terminal-stack" aria-label="Headless CMS Delivery Engine stack">
                <li className="mono">Prismic</li>
                <li className="mono">GraphQL</li>
                <li className="mono">TypeScript</li>
                <li className="mono">Edge</li>
              </ul>
            </div>
          </li>

          {/* Project 05 */}
          <li id="experimentation-insights-dashboard" className="terminal-project-card">
            <header className="terminal-project-head">
              <span className="terminal-project-index mono">05</span>
              <h2>Experimentation Insights Dashboard</h2>
              <span className="terminal-status mono terminal-status-archived">
                archived
              </span>
            </header>

            <p className="terminal-summary">
              Experiment tracking and statistical impact summaries for product
              teams running iterative A/B workflows.
            </p>

            <div className="terminal-meta-row">
              <p className="mono">year: 2024</p>
              <p className="mono">stack:</p>
              <ul
                className="terminal-stack"
                aria-label="Experimentation Insights Dashboard stack"
              >
                <li className="mono">Python</li>
                <li className="mono">FastAPI</li>
                <li className="mono">Data Viz</li>
                <li className="mono">Postgres</li>
              </ul>
            </div>
          </li>
        </ol>
      </section>

      <Footer />
    </main>
  );
}
