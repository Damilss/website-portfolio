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
              <h2>mustang market</h2>
              <span className="terminal-status mono terminal-status-active">
                active
              </span>
            </header>

            <p className="terminal-summary">
              peer-to-peer `.edu`-verified marketplace built for cal poly slo.
            </p>

            <div className="terminal-meta-row">
              <p className="mono">year: jan 2026</p>
              <p className="mono">stack:</p>
              <ul className="terminal-stack" aria-label="mustang market stack">
                <li className="mono">Next.js</li>
                <li className="mono">TypeScript</li>
                <li className="mono">Firebase</li>
                <li className="mono">Stripe Connect</li>
                <li className="mono">Groq</li>
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
          <li id="cortex" className="terminal-project-card">
            <header className="terminal-project-head">
              <span className="terminal-project-index mono">02</span>
              <h2>cortex</h2>
              <span className="terminal-status mono terminal-status-shipping">
                shipping
              </span>
            </header>

            <p className="terminal-summary">
              a machine learning–driven mobile app that analyzes patient movement 
              through on-device motion tracking and delivers real-time corrective 
              feedback for prescribed physical therapy exercises.
            </p>

            <div className="terminal-meta-row">
              <p className="mono">year: feb 2026</p>
              <p className="mono">stack:</p>
              <ul
                className="terminal-stack"
                aria-label="Streaming QA Automation Console stack"
              >
                <li className="mono">TO BE DETERMINED</li>
              </ul>
            </div>
          </li>

          {/* Project 03 */}
          <li id="swoosh-analytics" className="terminal-project-card">
            <header className="terminal-project-head">
              <span className="terminal-project-index mono">03</span>
              <h2>swoosh analytics</h2>
              <span className="terminal-status mono terminal-status-shipping">
                shipping
              </span>
            </header>

            <p className="terminal-summary">
              a python-based machine learning project that 
              leverages historical nba game data to engineer performance features and train gradient 
              boosted models for game outcome prediction and edge analysis.
            </p>

            <div className="terminal-meta-row">
              <p className="mono">year: dec 2025</p>
              <p className="mono">stack:</p>
              <ul className="terminal-stack" aria-label="swoosh analytics">
                <li className="mono">Python</li>
                <li className="mono">Pandas</li>
                <li className="mono">NumPy</li>
                <li className="mono">Sckit-learn</li>
                <li className="mono">MatPlotLib</li>
                <li className="mono">Xgboost || Lightgbm</li>
              </ul>
            </div>
          </li>

          {/* Project 04 */}
          <li id="energy-usage-pattern-exploration" className="terminal-project-card">
            <header className="terminal-project-head">
              <span className="terminal-project-index mono">04</span>
              <h2>energy usage pattern exploration</h2>
              <span className="terminal-status mono terminal-status-archived">
                archived
              </span>
            </header>

            <p className="terminal-summary">
              a data analysis pipeline built with pandas that processes 70,000+ household 
              energy records, performing feature-level analysis and visualization to uncover consumption trends across temporal 
              and environmental variables.
            </p>

            <div className="terminal-meta-row">
              <p className="mono">year: dec 2025</p>
              <p className="mono">stack:</p>
              <ul className="terminal-stack" aria-label="Headless CMS Delivery Engine stack">
                <li className="mono">Python</li>
                <li className="mono">Pandas</li>
                <li className="mono">NumPy</li>
              </ul>
            </div>

            <div className="terminal-actions">
              <a
                className="terminal-link mono"
                href="https://github.com/escott15/energy-usage-pattern-exploration"
                target="_blank"
                rel="noreferrer"
              >
                open_repo
              </a>
            </div>
          </li>

          {/* Project 05 */}
          <li id="instagram-follower-analyzer" className="terminal-project-card">
            <header className="terminal-project-head">
              <span className="terminal-project-index mono">05</span>
              <h2>instagram follower analyzer</h2>
              <span className="terminal-status mono terminal-status-archived">
                archived
              </span>
            </header>

            <p className="terminal-summary">
              a Python script that processes 
              structured JSON data from instagram account exports to compute
              follower/following set differences and identify non-reciprocal connections.
            </p>
          
            <div className="terminal-meta-row">
              <p className="mono">year: jan 2026</p>
              <p className="mono">stack:</p>
              <ul className="terminal-stack" aria-label="Motion-First Design System stack">
                <li className="mono">Python</li>
                <li className="mono">.JSON</li>
              </ul>
            </div>

            <div className="terminal-actions">
              <a
                className="terminal-link mono"
                href="https://github.com/Damilss/instagram-unfollow-list"
                target="_blank"
                rel="noreferrer"
              >
                open_repo
              </a>
            </div>
          </li>

          {/* Project 06 */}
          <li id="lilianal-com" className="terminal-project-card">
            <header className="terminal-project-head">
              <span className="terminal-project-index mono">06</span>
              <h2>lilianal.com</h2>
              <span className="terminal-status mono terminal-status-active">
                active
              </span>
            </header>

            <p className="terminal-summary">
              Designed and deployed a custom website for individual clients using Next.js, 
              focusing on responsive design and scalable frontend architecture.
            </p>

            <div className="terminal-meta-row">
              <p className="mono">year: feb 2025</p>
              <p className="mono">stack:</p>
              <ul className="terminal-stack" aria-label="lilianal.com">
                <li className="mono">Next.js</li>
                <li className="mono">Tailwind CSS</li>
                <li className="mono">Vercel</li>
              </ul>
            </div>

            <div className="terminal-actions">
              <a
                className="terminal-link mono"
                href="https://github.com/Damilss/lilianal.com"
                target="_blank"
                rel="noreferrer"
              >
                open_repo
              </a>
              <a
                className="terminal-link mono"
                href="https://lilianal.com" 
                target="_blank"
                rel="noreferrer"
              >
                open_live
              </a>
            </div>
          </li>
        </ol>
      </section>

      <Footer />
    </main>
  );
}
