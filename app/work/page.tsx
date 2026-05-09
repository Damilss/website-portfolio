// =============================================================================
// /work — the Project Index page.
//
// Three "terminal panels" (passion / work / school) each hold hand-authored
// project cards. Each card opens a ProjectModal on click and has a stable
// `id` so other pages can deep-link to it via `/work#<slug>`.
//
// Why "use client":
//   - this page owns modal state (useState),
//   - it runs scroll-into-view effects on mount (needs `window` / `sessionStorage` /
//     `document`), both of which require the browser.
//
// Why hand-authored cards (not a .map()):
//   See CLAUDE.md and docs/landing-rework.md. Each card is intentionally explicit
//   so it can diverge from its siblings (different actions row, different copy
//   shape, etc.) without growing data-driven branching. Three similar JSX blocks
//   beat one parameterized component here.
//
// Cross-file invariants this page participates in:
//   - Each <li id="..."> here must match a `projects[].slug` on the home page so
//     `/work#<slug>` deep links resolve.
//   - The home page sets `sessionStorage["pendingScroll"]` on click — the effect
//     below is what actually performs the scroll.
// =============================================================================
"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/footer";
import ProjectModal, { type ProjectData } from "@/components/project-modal";

export default function WorkPage() {
  // -- Modal state ------------------------------------------------------------
  // `active` holds the *whole* ProjectData for the currently open card, or null
  // when the modal is closed. We store the data itself (not just an id) so the
  // modal doesn't need to look anything up — the click handler hands it the
  // object directly.
  const [active, setActive] = useState<ProjectData | null>(null);

  // useCallback so the close handler has a stable identity across renders
  // (ProjectModal can rely on it for memoization / effect deps).
  const close = useCallback(() => setActive(null), []);

  // -- Scroll-on-mount --------------------------------------------------------
  // Two ways the user can arrive here wanting to land on a specific card:
  //
  //   1. They clicked a link on the home page, which sets
  //      sessionStorage["pendingScroll"] to the card slug *without* putting a
  //      hash in the URL. We deliberately avoid the hash so Next's router and
  //      the browser's native anchor-jump don't fight our smooth scroll.
  //
  //   2. They typed or refreshed a URL like `/work#mustang-market`. That's the
  //      fallback path, lower in the effect.
  useEffect(() => {
    const pending = sessionStorage.getItem("pendingScroll");
    if (pending) {
      // Short delay (80ms) — just enough for the cards to mount and lay out
      // before we measure their position. Anything longer feels laggy.
      //
      // We `removeItem` *inside* the timeout callback, NOT before scheduling it.
      // React Strict Mode runs effects twice in dev: if we cleared eagerly, the
      // second run would find an empty key and silently do nothing.
      const timer = setTimeout(() => {
        sessionStorage.removeItem("pendingScroll");
        document.getElementById(pending)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 80);
      return () => clearTimeout(timer);
    }

    // Fallback: read the URL hash directly. `slice(1)` drops the leading `#`.
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    // Longer delay (400ms) here than for the sessionStorage path: when the URL
    // contains a hash, the browser performs its own instant jump-to-anchor on
    // load. Waiting lets that settle so our smooth scroll lands cleanly instead
    // of fighting the native jump.
    const timer = setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    // `work-page-shell` is the page-level wrapper styled in globals.css —
    // sets up the dark background, max-width, vertical rhythm, etc.
    <main className="work-page-shell">
      {/* Decorative background layers, both styled in globals.css:
          - ambient-layer:  soft radial gradient glow.
          - noise-layer:    subtle film-grain texture.
          aria-hidden because they carry no information for screen readers. */}
      <div className="ambient-layer" aria-hidden="true" />
      <div className="noise-layer" aria-hidden="true" />

      {/* Modal sits at the top of the tree so it can portal/overlay above all
          panels regardless of which card opened it. When `active` is null,
          ProjectModal renders nothing. */}
      <ProjectModal project={active} onClose={close} />

      {/* Page header: kicker label + h1 + intro copy + quick-jump nav. */}
      <header className="work-page-header">
        <p className="work-page-kicker">Project Index / Terminal View</p>
        <h1>View Work</h1>
        <p className="work-page-copy">
          A focused archive of projects I have shipped or am actively building — split across passion, work, and school.
        </p>

        {/* Quick-jump nav row.
            - First item is a real <Link> back to /home (uses Next's client routing).
            - The other three are <button>s that scroll to the FIRST card in each
              panel. The slugs hard-coded here ("mustang-market", "lilianal-com",
              "calpoly-slo") MUST stay in sync with the corresponding <li id="...">
              below — if you reorder cards, update this nav too. */}
        <div className="work-nav-row">
          <Link className="work-back-link mono" href="/">
            cd .. /home
          </Link>
          <button className="work-back-link mono" onClick={() => document.getElementById("mustang-market")?.scrollIntoView({ behavior: "smooth", block: "center" })}>./passion</button>
          <button className="work-back-link mono" onClick={() => document.getElementById("lilianal-com")?.scrollIntoView({ behavior: "smooth", block: "center" })}>./work</button>
          <button className="work-back-link mono" onClick={() => document.getElementById("calpoly-slo")?.scrollIntoView({ behavior: "smooth", block: "center" })}>./school</button>
        </div>
      </header>

      {/* ============================================================
          === PASSION PANEL ===
          Personal projects — things built for fun / learning / portfolio.
          Card anatomy (re-used in all three panels):
            <li id={slug} ...onClick={openModal}>
              <header>     index badge · title · status pill
              <p .summary> one-line pitch
              <meta-row>   year + stack chips
              <actions>    external links (open_repo / open_live)
            </li>
          The status pill class drives color in globals.css:
            - terminal-status-active   = currently being worked on
            - terminal-status-shipping = released, low-touch maintenance
            - terminal-status-archived = done, not coming back to it
          ============================================================ */}
      <section className="terminal-panel" aria-label="Passion terminal panel">
        {/* Topbar mimics a macOS terminal window: the three "traffic light" dots
            on the left, a path-style label on the right. Dots are aria-hidden
            since they're decorative; the path is the only labeled element. */}
        <div className="terminal-topbar">
          <div className="terminal-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          {/* `.mono` pulls in the monospace font defined in globals.css. */}
          <p className="terminal-path mono">emilio@portfolio:~/passion</p>
        </div>

        {/* Faux shell prompt — purely decorative, reinforces the terminal motif. */}
        <p className="terminal-command mono">$ ls -la ./passion</p>

        {/* <ol> rather than <ul> because the visible "01, 02, 03..." indices
            convey order — semantically appropriate. */}
        <ol className="terminal-projects">

          {/* --- Project 01: mustang market -----------------------------------
              The data passed to setActive() (modal payload) intentionally
              duplicates fields rendered below in JSX (description, stack, etc.).
              The card needs them as rendered text; the modal needs them as a
              structured object. Keep the two in sync when editing. */}
          <li
            id="mustang-market"
            className="terminal-project-card pm-trigger"
            role="button"
            tabIndex={0}
            // Enter/Space delegate to click so keyboard users can trigger the modal.
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") e.currentTarget.click(); }}
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
            {/* Card header row: ordinal index · title · status pill. */}
            <header className="terminal-project-head">
              <span className="terminal-project-index mono">01</span>
              <h2>mustang market</h2>
              <span className="terminal-status mono terminal-status-active">active</span>
            </header>

            {/* One-line elevator pitch shown directly on the card. */}
            <p className="terminal-summary">
              peer-to-peer `.edu`-verified marketplace built for cal poly slo.
            </p>

            {/* Meta row: year + stack chips.
                aria-label on the inner <ul> gives the stack a programmatic name
                for screen readers, since the visible "stack:" label is a sibling
                <p>, not associated via <label for>. */}
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

            {/* External-link actions row.
                stopPropagation on each <a> is critical: without it, clicking
                a link would also fire the parent <li>'s onClick and pop the
                modal open behind the new tab.
                target/rel pairing is the standard hardening for new-tab links
                (rel="noreferrer" implies noopener too). */}
            <div className="terminal-actions">
              <a className="terminal-link mono" href="https://mustang-market.com" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>open_live</a>
            </div>
          </li>

          {/* --- Project 02: devsize-plus -------------------------------------
              Native macOS app — different stack shape from the web projects. */}
          <li
            id="devsize-plus"
            className="terminal-project-card pm-trigger"
            role="button"
            tabIndex={0}
            // Enter/Space delegate to click so keyboard users can trigger the modal.
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") e.currentTarget.click(); }}
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

          {/* --- Project 03: swoosh analytics ---------------------------------
              Note: NO `links` field in the modal payload and NO terminal-actions
              row in JSX — this project has no public repo or live URL. The
              modal will simply render no link buttons. */}
          <li
            id="swoosh-analytics"
            className="terminal-project-card pm-trigger"
            role="button"
            tabIndex={0}
            // Enter/Space delegate to click so keyboard users can trigger the modal.
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") e.currentTarget.click(); }}
            onClick={() => setActive({
              id: "swoosh-analytics",
              title: "swoosh analytics",
              year: "dec 2025",
              status: "shipping",
              description: "a python-based machine learning project that leverages historical nba game data to engineer performance features and train gradient boosted models for game outcome prediction and edge analysis.",
              stack: ["Python", "Pandas", "NumPy", "Scikit-learn", "Matplotlib", "XGBoost", "LightGBM"],
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

          {/* --- Project 04: energy usage pattern exploration -----------------
              Status "archived" — the pill renders in a muted tone via
              .terminal-status-archived in globals.css. */}
          <li
            id="energy-usage-pattern-exploration"
            className="terminal-project-card pm-trigger"
            role="button"
            tabIndex={0}
            // Enter/Space delegate to click so keyboard users can trigger the modal.
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") e.currentTarget.click(); }}
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

          {/* --- Project 05: instagram follower analyzer ---------------------- */}
          <li
            id="instagram-follower-analyzer"
            className="terminal-project-card pm-trigger"
            role="button"
            tabIndex={0}
            // Enter/Space delegate to click so keyboard users can trigger the modal.
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") e.currentTarget.click(); }}
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

      {/* ============================================================
          === WORK PANEL ===
          Paid client websites. Same card pattern as the passion panel —
          see the comments above for the per-card anatomy.
          ============================================================ */}
      <section className="terminal-panel" aria-label="Work terminal panel">
        {/* Same terminal-window chrome; only the path label changes per panel. */}
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

          {/* --- Project 01: lilianal.com -------------------------------------
              First card in this panel — its id is the target of the "./work"
              quick-jump button at the top of the page. Two external links
              (repo + live), both present in the modal payload AND rendered as
              separate <a> elements in the actions row. */}
          <li
            id="lilianal-com"
            className="terminal-project-card pm-trigger"
            role="button"
            tabIndex={0}
            // Enter/Space delegate to click so keyboard users can trigger the modal.
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") e.currentTarget.click(); }}
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

          {/* --- Project 02: westcoastbeautyco -------------------------------- */}
          <li
            id="westcoastbeautyco"
            className="terminal-project-card pm-trigger"
            role="button"
            tabIndex={0}
            // Enter/Space delegate to click so keyboard users can trigger the modal.
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") e.currentTarget.click(); }}
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

      {/* ============================================================
          === SCHOOL PANEL ===
          Currently a single Cal Poly entry. Structured as a full panel
          anyway so future coursework / programs slot in without restructuring.
          ============================================================ */}
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

          {/* --- Cal Poly SLO ------------------------------------------------- */}
          <li
            id="calpoly-slo"
            className="terminal-project-card pm-trigger"
            role="button"
            tabIndex={0}
            // Enter/Space delegate to click so keyboard users can trigger the modal.
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") e.currentTarget.click(); }}
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

      {/* Default-variant footer — sits at the page bottom on /work.
          (The home page uses <Footer variant="corner" /> inline in its title row;
          see CLAUDE.md "Cross-file invariants".) */}
      <Footer />
    </main>
  );
}
