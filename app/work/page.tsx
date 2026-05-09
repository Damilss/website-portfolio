// /work — the project index page. Three "terminal panels" (passion / work / school)
// each hold hand-authored project cards. Each card opens a modal on click and has
// a stable `id` so the home page can deep-link to it via `/work#<slug>`.
//
// Why "use client": this page owns modal state and runs scroll-into-view on mount,
// both of which need the browser.
"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/footer";
import ProjectModal, { type ProjectData } from "@/components/project-modal";

export default function WorkPage() {
  // Which project (if any) is currently open in the modal. Null = closed.
  // We store the whole ProjectData rather than just an id so the modal doesn't
  // have to look anything up — the card's click handler hands it the data directly.
  const [active, setActive] = useState<ProjectData | null>(null);
  const close = useCallback(() => setActive(null), []);

  // Scroll-on-mount. Two ways the user can arrive here wanting to land on a card:
  //   1. They clicked a link on the home page, which set sessionStorage["pendingScroll"]
  //      to the card's slug *without* putting a hash in the URL (so Next's router
  //      doesn't fight our smooth-scroll).
  //   2. They typed/refreshed a URL like /work#mustang-market — fallback below.
  useEffect(() => {
    const pending = sessionStorage.getItem("pendingScroll");
    if (pending) {
      // Short delay (80ms) — just enough for the cards to mount and lay out.
      // We clear sessionStorage *inside* the timeout: React Strict Mode runs effects
      // twice in dev, and clearing eagerly would make the second run find nothing.
      const timer = setTimeout(() => {
        sessionStorage.removeItem("pendingScroll");
        document.getElementById(pending)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 80);
      return () => clearTimeout(timer);
    }

    // Fallback: read the URL hash. Longer delay (400ms) so the browser's own
    // jump-to-anchor settles first; otherwise it fights our smooth scroll.
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const timer = setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="work-page-shell">
      {/* Decorative background layers (gradient glow + film grain). aria-hidden so
          screen readers skip them — they carry no information. Styled in globals.css. */}
      <div className="ambient-layer" aria-hidden="true" />
      <div className="noise-layer" aria-hidden="true" />

      {/* Modal lives at the top of the tree so it can portal/overlay above all panels.
          When `active` is null the modal renders nothing. */}
      <ProjectModal project={active} onClose={close} />

      <header className="work-page-header">
        <p className="work-page-kicker">Project Index / Terminal View</p>
        <h1>View Work</h1>
        <p className="work-page-copy">
          A focused archive of projects I have shipped or am actively building — split across passion, work, and school.
        </p>
        {/* Quick-jump nav. Each button scrolls to the first card in that section.
            The slugs here must stay in sync with the corresponding <li id="..."> below. */}
        <div className="work-nav-row">
          <Link className="work-back-link mono" href="/">
            cd .. /home
          </Link>
          <button className="work-back-link mono" onClick={() => document.getElementById("mustang-market")?.scrollIntoView({ behavior: "smooth", block: "center" })}>./passion</button>
          <button className="work-back-link mono" onClick={() => document.getElementById("lilianal-com")?.scrollIntoView({ behavior: "smooth", block: "center" })}>./work</button>
          <button className="work-back-link mono" onClick={() => document.getElementById("calpoly-slo")?.scrollIntoView({ behavior: "smooth", block: "center" })}>./school</button>
        </div>
      </header>

      {/* === PASSION PANEL ===
          Each <li> is a hand-authored card (intentionally not a .map() — see CLAUDE.md
          and docs/landing-rework.md: cards need to be able to diverge independently).
          Pattern per card:
            - `id` is the slug used by home-page deep-links and the quick-jump nav.
            - `onClick` on the <li> opens the modal with the card's ProjectData.
            - Inner <a> links call e.stopPropagation() so clicking a link doesn't
              also fire the card's modal trigger. */}
      <section className="terminal-panel" aria-label="Passion terminal panel">
        {/* Topbar mimics a macOS terminal window: traffic-light dots on the left,
            a path-style label on the right. Purely decorative; aria-hidden on the dots
            keeps them out of the accessibility tree. */}
        <div className="terminal-topbar">
          <div className="terminal-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          {/* The "user@host:~/dir" prompt is the only labeled thing in the topbar.
              The .mono class pulls in the monospace font from globals.css. */}
          <p className="terminal-path mono">emilio@portfolio:~/passion</p>
        </div>

        {/* Faux-terminal "command" line — purely decorative, sets the visual tone. */}
        <p className="terminal-command mono">$ ls -la ./passion</p>

        {/* <ol> rather than <ul> because the index numbers (01, 02, ...) are part
            of the visual design — order matters semantically here. */}
        <ol className="terminal-projects">
          {/* --- Project 01: mustang market ---
              Status "active" = currently being built/iterated on.
              Note: the description and stack here are duplicated below in JSX
              because the modal needs the structured data and the card needs the
              rendered text. Keep them in sync if you edit one. */}
          <li
            id="mustang-market"
            className="terminal-project-card pm-trigger"
            onClick={() => setActive({
              id: "mustang-market",
              title: "mustang market",
              year: "jan 2026",
              status: "active",
              description: "peer-to-peer `.edu`-verified marketplace built for cal poly slo.",
              stack: ["Next.js", "TypeScript", "Firebase", "Stripe Connect", "Groq", "Firestore", "Vercel"],
              links: [{ label: "open_live →", href: "https://mustang-market.com" }],
            })}
          >
            {/* Card header: index badge · title · status pill.
                The status class (terminal-status-active|shipping|archived) drives
                the pill color in globals.css. */}
            <header className="terminal-project-head">
              <span className="terminal-project-index mono">01</span>
              <h2>mustang market</h2>
              <span className="terminal-status mono terminal-status-active">active</span>
            </header>
            {/* One-line pitch shown directly on the card. */}
            <p className="terminal-summary">
              peer-to-peer `.edu`-verified marketplace built for cal poly slo.
            </p>
            {/* Meta row: year + stack chips. The aria-label on the <ul> gives the
                stack list a name for screen readers (since the visible "stack:" label
                is a sibling, not a programmatic association). */}
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
            {/* External-link row. stopPropagation prevents the parent <li>'s
                onClick (which opens the modal) from firing when the user actually
                wanted to follow the link. target="_blank" + rel="noreferrer" is
                the standard hardening for new-tab links. */}
            <div className="terminal-actions">
              <a className="terminal-link mono" href="https://mustang-market.com" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>open_live</a>
            </div>
          </li>

          {/* --- Project 02: devsize-plus ---
              Status "shipping" = built and out, but no longer the daily focus. */}
          <li
            id="devsize-plus"
            className="terminal-project-card pm-trigger"
            onClick={() => setActive({
              id: "devsize-plus",
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

          {/* --- Project 03: swoosh analytics ---
              No `links` array on this one — there's no public repo/site, so the
              card has no terminal-actions row. The modal will also render no links. */}
          <li
            id="swoosh-analytics"
            className="terminal-project-card pm-trigger"
            onClick={() => setActive({
              id: "swoosh-analytics",
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

          {/* --- Project 04: energy usage pattern exploration ---
              Status "archived" = finished, not being touched again. The pill
              color shifts to a muted tone via .terminal-status-archived. */}
          <li
            id="energy-usage-pattern-exploration"
            className="terminal-project-card pm-trigger"
            onClick={() => setActive({
              id: "energy-usage-pattern-exploration",
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

          {/* --- Project 05: instagram follower analyzer --- archived utility script. */}
          <li
            id="instagram-follower-analyzer"
            className="terminal-project-card pm-trigger"
            onClick={() => setActive({
              id: "instagram-follower-analyzer",
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

      {/* === WORK PANEL === client websites I've shipped. Same card pattern as above. */}
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
              id: "lilianal-com",
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
              id: "westcoastbeautyco",
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

      {/* === SCHOOL PANEL === currently a single Cal Poly entry; structured as a
          panel anyway so future coursework / programs slot in without restructuring. */}
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
              id: "calpoly-slo",
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
