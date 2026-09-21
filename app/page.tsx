// =============================================================================
// Home page (/).
//
// Sections:
f     //   1. Hero block — name, tagline, corner footer, portrait + hero copy beside
//      the GitHub graph, and the CTAs ("view-work", GitHub, "Start a Project").
//   2. Selected Work — project rows that deep-link into the /work finder.
//
// This file is a Server Component — note the absence of "use client" at the
// top. The interactive pieces (StartProjectContact, GithubContributions) are
// client components imported in.
//
// The Selected Work list is GENERATED: it's every descriptions/ file whose
// frontmatter sets `featured: N`, in ascending N (see lib/descriptions.ts
// listFeaturedProjects). To change what's featured, edit the markdown files —
// nothing here.
//
// Cross-file invariants this page participates in (see CLAUDE.md):
//   - The corner-variant Footer is rendered INSIDE the title row (intentional
//     — its top edge aligns to the hero label baseline). The default-variant
//     lives at /work bottom.
// =============================================================================
import Image from "next/image";
import Link from "next/link";
import portrait from "@/public/portrait.jpg";
import Footer from "@/components/footer";
import GithubContributions from "@/components/github-contributions";
import GithubCta from "@/components/github-cta";
import StartProjectContact from "@/components/start-project-contact";
import { listFeaturedProjects } from "@/lib/descriptions";

export default function Home() {
  // Read at build time from descriptions/ frontmatter (server-only).
  const projects = listFeaturedProjects();

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
            The Footer is INTENTIONALLY inside this row — its top edge aligns to
            the hero label baseline. Don't move it to the page bottom. */}
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

        {/* Hero secondary row: [portrait | pitch copy] on the left, GitHub
            contribution graph on the right. */}
        <div className="hero-row">
          <div className="hero-copy-row">
            {/* Static import gives next/image the intrinsic size and a hashed
                URL; `priority` because it's above the fold. The source file is
                already a 320px square (see CLAUDE.md), so the optimizer only
                serves 1x/2x variants of that. */}
            <Image
              src={portrait}
              alt="Emilio Ledesma"
              width={72}
              height={72}
              priority
              className="hero-portrait"
            />
            <p className="hero-copy">
              Passionate in Development Operations, low-level, and security
            </p>
          </div>
          <GithubContributions />
        </div>

        {/* Primary CTAs.
            - "view-work" is a Next <Link> (client-side route to /work).
            - GithubCta opens the GitHub profile in a new tab.
            - StartProjectContact is a client component that reveals an email
              chip with a copy-to-clipboard button. It stays LAST: its collapsed
              reveal panel still contributes max-content width to the flex row,
              so anything placed after it would float far right. */}
        <div className="hero-actions">
          <Link className="cta-primary" href="/work">
            <span className="mono">&lt;view-work /&gt;</span>
          </Link>
          <GithubCta />
          <StartProjectContact />
        </div>
      </section>

      {/* === SELECTED WORK ===
          List of featured project rows. id="work" lets `/#work` deep-link here.
          The class name is "footer-grid" for historical CSS reasons; it doesn't
          actually contain the footer anymore. */}
      <section className="footer-grid" id="work">
        <div className="work-list-wrap">
          <p className="work-label">Selected Work</p>
          <ol className="work-list">
            {projects.map((project, index) => {
              // Position in the list (01, 02, ...) — not the `featured` rank,
              // so gaps in ranks don't show up as gaps in numbering.
              const position = String(index + 1).padStart(2, "0");

              return (
                <li key={project.href}>
                  {/* Each row deep-links to the project's detail page. */}
                  <Link className="work-row" href={project.href}>
                    {/* Index badge on the left. */}
                    <span className="work-index mono">{position}</span>

                    {/* Middle column: title + tag chips. */}
                    <div className="work-content">
                      <span className="work-title">{project.meta.title}</span>
                      {/* aria-label gives the tag list a name for screen readers
                          since the visible label is implicit. */}
                      <ul
                        className="work-tags"
                        aria-label={`${project.meta.title} tags`}
                      >
                        {project.meta.tags.map((tag) => (
                          <li key={tag} className="work-tag mono">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Period on the right (the class name predates frontmatter). */}
                    <span className="work-year mono">{project.meta.period}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </main>
  );
}
