// =============================================================================
// Home page (/).
//
// Sections:
//   1. Hero block — name, tagline, corner footer, hero copy + GitHub graph,
//      and the two CTAs ("view-work" and "Start a Project").
//   2. Selected Work — a list of project rows that link into /work#<slug>.
//
// This file is a Server Component — note the absence of "use client" at the
// top. It's just static JSX over a hardcoded `projects` array. The interactive
// pieces (StartProjectContact, GithubContributions, WorkProjectLink) are
// client components imported in.
//
// Cross-file invariants this page participates in (see CLAUDE.md):
//   - Each `projects[].slug` here MUST match a corresponding <li id="..."> on
//     /work so the `/work#<slug>` deep-link resolves.
//   - The corner-variant Footer is rendered INSIDE the title row (intentional
//     — see docs/landing-rework.md). The default-variant lives at /work bottom.
// =============================================================================
import Link from "next/link";
import Footer from "@/components/footer";
import StartProjectContact from "@/components/start-project-contact";
import WorkProjectLink from "@/components/work-project-link";
import GithubContributions from "@/components/github-contributions";

// `projects` is the single source of truth for the home-page Selected Work
// list. Order in this array = render order. Editing here will NOT change the
// /work page — that page has its own hand-authored cards. When adding a project,
// remember to:
//   1. Add an entry here (for the home list).
//   2. Add a matching <li id={slug}> card on /work (for the detail panel).
//   3. Make sure `slug` here === `id` there.
const projects = [
  {
    id: "01",
      slug: "mustang-market",
    name: "mustang market",
    year: "jan 2026",
    tags: [
      "Next.js",
      "TypeScript",
      "Firebase",
      "Stripe Connect",
      "Groq",
      "Firestore",
      "Vercel",
    ],
    href: "/work#mustang-market",
  },
  {
    id: "02",
    slug: "devsize-plus",
    name: "devsize-plus",
    year: "mar 2026",
    tags: [
      "Swift",
      "SwiftUI"
    ],
    href: "/work#devsize-plus",
  },
  {
    id: "03",
    slug: "westcoastbeautyco",
    name: "westcoastbeautyco",
    year: "2024",
    tags: [
      "Next.js",
      "Tailwind CSS",
      "Vercel",
    ],
    href: "/work#westcoastbeautyco",
  },
  {
    id: "04",
    slug: "energy-usage-pattern-exploration",
    name: "energy usage pattern exploration",
    year: "dec 2025",
    tags: ["Python", "Pandas", "NumPy"],
    href: "/work#energy-usage-pattern-exploration",
  },
  {
    id: "05",
    slug: "instagram-follower-analyzer",
    name: "instagram follower analyzer",
    year: "jan 2026",
    tags: ["Python", ".JSON"],
    href: "/work#instagram-follower-analyzer",
  },
];

export default function Home() {
  return (
    // `portfolio-shell` is the home-page wrapper styled in globals.css —
    // sets up the dark background, max-width, and vertical rhythm.
    <main className="portfolio-shell">
      {/* Decorative background layers (gradient glow + film grain).
          aria-hidden so screen readers skip them. */}
      <div className="ambient-layer" aria-hidden="true" />
      <div className="noise-layer" aria-hidden="true" />

      {/* === HERO BLOCK === intro / identity / CTAs. */}
      <section className="hero-block">
        {/* Title row: name + tagline on the left, corner-variant Footer on the right.
            The Footer is INTENTIONALLY inside this row (see docs/landing-rework.md
            "Home corner-footer alignment contract") — its top edge aligns to the
            hero label baseline. Don't move it to the page bottom. */}
        <div className="hero-title-row">
          <div className="hero-title-copy">
            <p className="hero-label">B.S Computer Engineering - 2029</p>
            <h1>
              Emilio Ledesma
              <br />
              <span>building @ cal poly slo</span>
            </h1>
          </div>

          {/* Corner variant = compact layout, top-right anchored. */}
          <Footer variant="corner" />
        </div>

        {/* Hero secondary row: pitch copy + GitHub contribution graph side-by-side. */}
        <div className="hero-row">
          <p className="hero-copy">
            Building software systems, focusing on cyber security, and
            low-level optimization, all while learning across the full stack.
          </p>
          <GithubContributions />
        </div>

        {/* Primary CTAs.
            - "view-work" is a Next <Link> (client-side route to /work).
            - StartProjectContact is a client component that reveals an email
              chip with a copy-to-clipboard button. */}
        <div className="hero-actions">
          <Link className="cta-primary" href="/work">
            <span className="mono">&lt;view-work /&gt;</span>
          </Link>
          <StartProjectContact />
        </div>
      </section>

      {/* === SELECTED WORK ===
          List of project rows. id="work" lets `/#work` deep-link here.
          The class name is "footer-grid" for historical CSS reasons; it doesn't
          actually contain the footer anymore. */}
      <section className="footer-grid" id="work">
        <div className="work-list-wrap">
          <p className="work-label">Selected Work</p>
          <ol className="work-list">
            {/* Each row is a single clickable area. WorkProjectLink wraps a
                Next <Link> to /work and ALSO writes the slug to sessionStorage,
                so the work page's mount effect can scroll the right card into
                view without using a URL hash. See components/work-project-link.tsx
                and the useEffect in app/work/page.tsx. */}
            {projects.map((project) => (
              <li key={project.id}>
                <WorkProjectLink slug={project.slug} className="work-row">
                  {/* Index badge on the left (01, 02, ...). */}
                  <span className="work-index mono">{project.id}</span>

                  {/* Middle column: title + tag chips. */}
                  <div className="work-content">
                    <span className="work-title">{project.name}</span>
                    {/* aria-label gives the tag list a name for screen readers
                        since the visible label is implicit. */}
                    <ul className="work-tags" aria-label={`${project.name} tags`}>
                      {project.tags.map((tag) => (
                        <li key={`${project.id}-${tag}`} className="work-tag mono">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Year on the right. */}
                  <span className="work-year mono">{project.year}</span>
                </WorkProjectLink>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
