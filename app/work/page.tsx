"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Footer from "@/components/footer";
import ProjectModal, { type ProjectData } from "@/components/project-modal";

export default function WorkPage() {
  const [active, setActive] = useState<ProjectData | null>(null);
  const close = useCallback(() => setActive(null), []);

  return (
    <main className="work-page-shell">
      <div className="ambient-layer" aria-hidden="true" />
      <div className="noise-layer" aria-hidden="true" />

      <ProjectModal project={active} onClose={close} />

      <header className="work-page-header">
        <p className="work-page-kicker">Project Index / Terminal View</p>
        <h1>View Work</h1>
        <p className="work-page-copy">
          A focused archive of projects I have shipped or am actively building — split across passion, work, and school.
        </p>
        <div className="work-nav-row">
          <Link className="work-back-link mono" href="/">
            cd .. /home
          </Link>
          <a className="work-back-link mono" href="#mustang-market">./passion</a>
          <a className="work-back-link mono" href="#lilianal-com">./work</a>
          <a className="work-back-link mono" href="#calpoly-slo">./school</a>
        </div>
      </header>

      <section className="terminal-panel" aria-label="Passion terminal panel">
        <div className="terminal-topbar">
          <div className="terminal-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="terminal-path mono">emilio@portfolio:~/passion</p>
        </div>

        <p className="terminal-command mono">$ ls -la ./passion</p>

        <ol className="terminal-projects">
          {/* Project 01 */}
          <li
            id="mustang-market"
            className="terminal-project-card pm-trigger"
            onClick={() => setActive({
              title: "mustang market",
              year: "jan 2026",
              status: "active",
              description: "peer-to-peer `.edu`-verified marketplace built for cal poly slo.",
              stack: ["Next.js", "TypeScript", "Firebase", "Stripe Connect", "Groq", "Firestore", "Vercel"],
              links: [{ label: "open_live →", href: "https://mustang-market.com" }],
            })}
          >
            <header className="terminal-project-head">
              <span className="terminal-project-index mono">01</span>
              <h2>mustang market</h2>
              <span className="terminal-status mono terminal-status-active">active</span>
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
              <a className="terminal-link mono" href="https://mustang-market.com" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>open_live</a>
            </div>
          </li>

          {/* Project 02 */}
          <li
            id="devsize-plus"
            className="terminal-project-card pm-trigger"
            onClick={() => setActive({
              title: "devsize-plus",
              year: "mar 2026",
              status: "shipping",
              description: "a macos, client-only disk usage explorer (TreeSize-style) that scans a folder and shows where space is going. built to be native and fast: Swift + SwiftUI + Swift concurrency, no servers, no database.",
              stack: ["Swift", "SwiftUI"],
              links: [{ label: "open_repo →", href: "https://github.com/Damilss/devsize-plus" }],
            })}
          >
            <header className="terminal-project-head">
              <span className="terminal-project-index mono">02</span>
              <h2>devsize-plus</h2>
              <span className="terminal-status mono terminal-status-shipping">shipping</span>
            </header>
            <p className="terminal-summary">
              a macos, client-only disk usage explorer (TreeSize-style)
              that scans a folder and shows where space is going. built to be native and fast:
              Swift + SwiftUI + Swift concurrency, no servers, no database.
            </p>
            <div className="terminal-meta-row">
              <p className="mono">year: mar 2026</p>
              <p className="mono">stack:</p>
              <ul className="terminal-stack" aria-label="devsize-plus stack">
                <li className="mono">Swift</li>
                <li className="mono">SwiftUI</li>
              </ul>
            </div>
            <div className="terminal-actions">
              <a className="terminal-link mono" href="https://github.com/Damilss/devsize-plus" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>open_repo</a>
            </div>
          </li>

          {/* Project 03 */}
          <li
            id="swoosh-analytics"
            className="terminal-project-card pm-trigger"
            onClick={() => setActive({
              title: "swoosh analytics",
              year: "dec 2025",
              status: "shipping",
              description: "a python-based machine learning project that leverages historical nba game data to engineer performance features and train gradient boosted models for game outcome prediction and edge analysis.",
              stack: ["Python", "Pandas", "NumPy", "Scikit-learn", "MatPlotLib", "XGBoost", "LightGBM"],
            })}
          >
            <header className="terminal-project-head">
              <span className="terminal-project-index mono">03</span>
              <h2>swoosh analytics</h2>
              <span className="terminal-status mono terminal-status-shipping">shipping</span>
            </header>
            <p className="terminal-summary">
              a python-based machine learning project that
              leverages historical nba game data to engineer performance features and train gradient
              boosted models for game outcome prediction and edge analysis.
            </p>
            <div className="terminal-meta-row">
              <p className="mono">year: dec 2025</p>
              <p className="mono">stack:</p>
              <ul className="terminal-stack" aria-label="swoosh analytics stack">
                <li className="mono">Python</li>
                <li className="mono">Pandas</li>
                <li className="mono">NumPy</li>
                <li className="mono">Scikit-learn</li>
                <li className="mono">Matplotlib</li>
                <li className="mono">XGBoost / LightGBM</li>
              </ul>
            </div>
          </li>

          {/* Project 04 */}
          <li
            id="energy-usage-pattern-exploration"
            className="terminal-project-card pm-trigger"
            onClick={() => setActive({
              title: "energy usage pattern exploration",
              year: "dec 2025",
              status: "archived",
              description: "a data analysis pipeline built with pandas that processes 70,000+ household energy records, performing feature-level analysis and visualization to uncover consumption trends across temporal and environmental variables.",
              stack: ["Python", "Pandas", "NumPy"],
              links: [{ label: "open_repo →", href: "https://github.com/escott15/energy-usage-pattern-exploration" }],
            })}
          >
            <header className="terminal-project-head">
              <span className="terminal-project-index mono">04</span>
              <h2>energy usage pattern exploration</h2>
              <span className="terminal-status mono terminal-status-archived">archived</span>
            </header>
            <p className="terminal-summary">
              a data analysis pipeline built with pandas that processes 70,000+ household
              energy records, performing feature-level analysis and visualization to uncover consumption trends across temporal
              and environmental variables.
            </p>
            <div className="terminal-meta-row">
              <p className="mono">year: dec 2025</p>
              <p className="mono">stack:</p>
              <ul className="terminal-stack" aria-label="energy usage pattern exploration stack">
                <li className="mono">Python</li>
                <li className="mono">Pandas</li>
                <li className="mono">NumPy</li>
              </ul>
            </div>
            <div className="terminal-actions">
              <a className="terminal-link mono" href="https://github.com/escott15/energy-usage-pattern-exploration" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>open_repo</a>
            </div>
          </li>

          {/* Project 05 */}
          <li
            id="instagram-follower-analyzer"
            className="terminal-project-card pm-trigger"
            onClick={() => setActive({
              title: "instagram follower analyzer",
              year: "jan 2026",
              status: "archived",
              description: "a Python script that processes structured JSON data from instagram account exports to compute follower/following set differences and identify non-reciprocal connections.",
              stack: ["Python", ".JSON"],
              links: [{ label: "open_repo →", href: "https://github.com/Damilss/instagram-unfollow-list" }],
            })}
          >
            <header className="terminal-project-head">
              <span className="terminal-project-index mono">05</span>
              <h2>instagram follower analyzer</h2>
              <span className="terminal-status mono terminal-status-archived">archived</span>
            </header>
            <p className="terminal-summary">
              a Python script that processes
              structured JSON data from instagram account exports to compute
              follower/following set differences and identify non-reciprocal connections.
            </p>
            <div className="terminal-meta-row">
              <p className="mono">year: jan 2026</p>
              <p className="mono">stack:</p>
              <ul className="terminal-stack" aria-label="instagram follower analyzer stack">
                <li className="mono">Python</li>
                <li className="mono">.JSON</li>
              </ul>
            </div>
            <div className="terminal-actions">
              <a className="terminal-link mono" href="https://github.com/Damilss/instagram-unfollow-list" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>open_repo</a>
            </div>
          </li>
        </ol>
      </section>

      <section className="terminal-panel" aria-label="Work terminal panel">
        <div className="terminal-topbar">
          <div className="terminal-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="terminal-path mono">emilio@portfolio:~/work</p>
        </div>

        <p className="terminal-command mono">$ ls -la ./work</p>

        <ol className="terminal-projects">
          {/* Project 01 */}
          <li
            id="lilianal-com"
            className="terminal-project-card pm-trigger"
            onClick={() => setActive({
              title: "lilianal.com",
              year: "feb 2025",
              status: "active",
              description: "Designed and deployed a custom website for individual clients using Next.js, focusing on responsive design and scalable frontend architecture.",
              stack: ["Next.js", "Tailwind CSS", "Vercel"],
              links: [
                { label: "open_repo →", href: "https://github.com/Damilss/lilianal.com" },
                { label: "open_live →", href: "https://lilianal.com" },
              ],
            })}
          >
            <header className="terminal-project-head">
              <span className="terminal-project-index mono">01</span>
              <h2>lilianal.com</h2>
              <span className="terminal-status mono terminal-status-active">active</span>
            </header>
            <p className="terminal-summary">
              Designed and deployed a custom website for individual clients using Next.js,
              focusing on responsive design and scalable frontend architecture.
            </p>
            <div className="terminal-meta-row">
              <p className="mono">year: feb 2025</p>
              <p className="mono">stack:</p>
              <ul className="terminal-stack" aria-label="lilianal.com stack">
                <li className="mono">Next.js</li>
                <li className="mono">Tailwind CSS</li>
                <li className="mono">Vercel</li>
              </ul>
            </div>
            <div className="terminal-actions">
              <a className="terminal-link mono" href="https://github.com/Damilss/lilianal.com" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>open_repo</a>
              <a className="terminal-link mono" href="https://lilianal.com" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>open_live</a>
            </div>
          </li>

          {/* Project 02 */}
          <li
            id="westcoastbeautyco"
            className="terminal-project-card pm-trigger"
            onClick={() => setActive({
              title: "westcoastbeautyco",
              year: "2024",
              status: "active",
              description: "A beauty brand website built with Next.js, Tailwind CSS, and Vercel.",
              stack: ["Next.js", "Tailwind CSS", "Vercel"],
              links: [{ label: "open_live →", href: "https://westcoastbeautyco.com" }],
            })}
          >
            <header className="terminal-project-head">
              <span className="terminal-project-index mono">02</span>
              <h2>westcoastbeautyco</h2>
              <span className="terminal-status mono terminal-status-active">active</span>
            </header>
            <p className="terminal-summary">
              A beauty brand website built with Next.js, Tailwind CSS, and Vercel.
            </p>
            <div className="terminal-meta-row">
              <p className="mono">year: 2024</p>
              <p className="mono">stack:</p>
              <ul className="terminal-stack" aria-label="westcoastbeautyco stack">
                <li className="mono">Next.js</li>
                <li className="mono">Tailwind CSS</li>
                <li className="mono">Vercel</li>
              </ul>
            </div>
            <div className="terminal-actions">
              <a className="terminal-link mono" href="https://westcoastbeautyco.com" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>open_live</a>
            </div>
          </li>
        </ol>
      </section>

      <section className="terminal-panel" aria-label="School terminal panel">
        <div className="terminal-topbar">
          <div className="terminal-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="terminal-path mono">emilio@portfolio:~/school</p>
        </div>

        <p className="terminal-command mono">$ ls -la ./school</p>

        <ol className="terminal-projects">
          {/* 01 */}
          <li
            id="calpoly-slo"
            className="terminal-project-card pm-trigger"
            onClick={() => setActive({
              title: "calpoly slo",
              year: "2024 - 2026",
              status: "active",
              description: "Cal Poly San Luis Obispo — Computer Science Program",
              stack: ["Computer Science", "Software Engineering", "Data Structures", "Algorithms"],
            })}
          >
            <header className="terminal-project-head">
              <span className="terminal-project-index mono">01</span>
              <h2>calpoly slo</h2>
              <span className="terminal-status mono terminal-status-active">active</span>
            </header>
            <p className="terminal-summary">
              Cal Poly San Luis Obispo — Computer Science Program
            </p>
            <div className="terminal-meta-row">
              <p className="mono">year: 2024 - 2026</p>
              <p className="mono">stack:</p>
              <ul className="terminal-stack" aria-label="Cal Poly stack">
                <li className="mono">Computer Science</li>
                <li className="mono">Software Engineering</li>
                <li className="mono">Data Structures</li>
                <li className="mono">Algorithms</li>
              </ul>
            </div>
          </li>
        </ol>
      </section>

      <Footer />
    </main>
  );
}
