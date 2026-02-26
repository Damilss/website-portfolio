import Link from "next/link";
import Footer from "@/components/footer";
import StartProjectContact from "@/components/start-project-contact";

const projects = [
  {
    id: "01",
    slug: "realtime-commerce-observability",
    name: "Realtime Commerce Observability",
    year: "2026",
    tags: ["Next.js", "TypeScript", "Postgres"],
    href: "/work#realtime-commerce-observability",
  },
  {
    id: "02",
    slug: "streaming-qa-automation-console",
    name: "Streaming QA Automation Console",
    year: "2025",
    tags: ["Playwright", "Node.js", "CI/CD"],
    href: "/work#streaming-qa-automation-console",
  },
  {
    id: "03",
    slug: "motion-first-design-system",
    name: "Motion-First Design System",
    year: "2025",
    tags: ["React", "Tokens", "A11y"],
    href: "/work#motion-first-design-system",
  },
  {
    id: "04",
    slug: "headless-cms-delivery-engine",
    name: "Headless CMS Delivery Engine",
    year: "2024",
    tags: ["Prismic", "GraphQL", "Edge"],
    href: "/work#headless-cms-delivery-engine",
  },
  {
    id: "05",
    slug: "experimentation-insights-dashboard",
    name: "Experimentation Insights Dashboard",
    year: "2024",
    tags: ["Data Viz", "Python", "API"],
    href: "/work#experimentation-insights-dashboard",
  },
];

export default function Home() {
  return (
    <main className="portfolio-shell">
      <div className="ambient-layer" aria-hidden="true" />
      <div className="noise-layer" aria-hidden="true" />

      <section className="hero-block">
        <div className="hero-title-row">
          <div className="hero-title-copy">
            <p className="hero-label">B.S Computer Engineering</p>
            <h1>
              Emilio Scott
              <br />
              <span>Building @ Cal Poly SLO</span>
            </h1>
          </div>

          <Footer variant="corner" />
        </div>

        <p className="hero-copy">
          I design and ship high-polish digital products with a focus on
          performance, interaction quality, and scalable frontend architecture.
        </p>

        <div className="hero-actions">
          <Link className="cta-primary" href="/work">
            <span className="mono">&lt;view-work /&gt;</span>
          </Link>
          <StartProjectContact />
        </div>
      </section>

      <section className="footer-grid" id="work">
        <div className="work-list-wrap">
          <p className="work-label">Selected Work</p>
          <ol className="work-list">
            {projects.map((project) => (
              <li key={project.id}>
                <Link className="work-row" href={project.href}>
                  <span className="work-index mono">{project.id}</span>

                  <div className="work-content">
                    <span className="work-title">{project.name}</span>
                    <ul className="work-tags" aria-label={`${project.name} tags`}>
                      {project.tags.map((tag) => (
                        <li key={`${project.id}-${tag}`} className="work-tag mono">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <span className="work-year mono">{project.year}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
