import Link from "next/link";
import Footer from "@/components/footer";

const projectEntries = [
  {
    id: "01",
    slug: "realtime-commerce-observability",
    title: "Realtime Commerce Observability",
    year: "2026",
    status: "active",
    summary:
      "Monitoring suite for event-driven commerce flows with alerting, latency tracing, and replay debugging.",
    stack: ["Next.js", "TypeScript", "Postgres", "OpenTelemetry"],
    repoHref: "https://github.com",
    liveHref: "#",
  },
  {
    id: "02",
    slug: "streaming-qa-automation-console",
    title: "Streaming QA Automation Console",
    year: "2025",
    status: "shipping",
    summary:
      "Terminal-like test orchestration dashboard for browser suites, retries, snapshots, and flaky-run diagnostics.",
    stack: ["Playwright", "Node.js", "Redis", "GitHub Actions"],
    repoHref: "https://github.com",
    liveHref: "#",
  },
  {
    id: "03",
    slug: "motion-first-design-system",
    title: "Motion-First Design System",
    year: "2025",
    status: "active",
    summary:
      "Design token framework for consistent interaction timing, transitions, and accessibility-safe animation defaults.",
    stack: ["React", "Tailwind", "Storybook", "A11y"],
    repoHref: "https://github.com",
    liveHref: "#",
  },
  {
    id: "04",
    slug: "headless-cms-delivery-engine",
    title: "Headless CMS Delivery Engine",
    year: "2024",
    status: "archived",
    summary:
      "Content pipeline that normalizes CMS payloads and serves typed contracts for high-performance frontend delivery.",
    stack: ["Prismic", "GraphQL", "TypeScript", "Edge"],
    repoHref: "https://github.com",
    liveHref: "#",
  },
  {
    id: "05",
    slug: "experimentation-insights-dashboard",
    title: "Experimentation Insights Dashboard",
    year: "2024",
    status: "archived",
    summary:
      "Experiment tracking and statistical impact summaries for product teams running iterative A/B workflows.",
    stack: ["Python", "FastAPI", "Data Viz", "Postgres"],
    repoHref: "https://github.com",
    liveHref: "#",
  },
] as const;

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
          {projectEntries.map((project) => (
            <li key={project.id} id={project.slug} className="terminal-project-card">
              <header className="terminal-project-head">
                <span className="terminal-project-index mono">{project.id}</span>
                <h2>{project.title}</h2>
                <span
                  className={`terminal-status mono terminal-status-${project.status}`}
                >
                  {project.status}
                </span>
              </header>

              <p className="terminal-summary">{project.summary}</p>

              <div className="terminal-meta-row">
                <p className="mono">year: {project.year}</p>
                <p className="mono">stack:</p>
                <ul className="terminal-stack" aria-label={`${project.title} stack`}>
                  {project.stack.map((tech) => (
                    <li key={`${project.id}-${tech}`} className="mono">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="terminal-actions">
                <a
                  className="terminal-link mono"
                  href={project.repoHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  open_repo
                </a>
                <a
                  className="terminal-link mono"
                  href={project.liveHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  open_live
                </a>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <Footer />
    </main>
  );
}
