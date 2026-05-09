import Link from "next/link";
import Footer from "@/components/footer";
import StartProjectContact from "@/components/start-project-contact";
import WorkProjectLink from "@/components/work-project-link";
import GithubContributions from "@/components/github-contributions";

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
    <main className="portfolio-shell">
      <div className="ambient-layer" aria-hidden="true" />
      <div className="noise-layer" aria-hidden="true" />

      <section className="hero-block">
        <div className="hero-title-row">
          <div className="hero-title-copy">
            <p className="hero-label">B.S Computer Engineering - 2029</p>
            <h1>
              Emilio Ledesma
              <br />
              <span>building @ cal poly slo</span>
            </h1>
          </div>

          <Footer variant="corner" />
        </div>

        <div className="hero-row">
          <p className="hero-copy">
            Building software systems, focusing on cyber security, and
            low-level optimization, all while learning across the full stack.
          </p>
          <GithubContributions />
        </div>

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
                <WorkProjectLink slug={project.slug} className="work-row">
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
                </WorkProjectLink>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
