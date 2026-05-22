// =============================================================================
// /work — the project finder.
//
// A terminal-styled file browser over the on-disk `descriptions/` directory.
// This is a Server Component: it builds the folder tree from the filesystem at
// build time (see lib/descriptions.ts) and hands it to <FinderTree/>, the client
// component that owns the expand/collapse interaction.
//
// Each file in the tree links to /work/<path> — see app/work/[...slug]/page.tsx.
// Adding a project is just dropping a `.md` file into descriptions/ — no code
// change needed here.
// =============================================================================
import Link from "next/link";
import Footer from "@/components/footer";
import FinderTree from "@/components/finder-tree";
import { buildDescriptionsTree } from "@/lib/descriptions";

export default function WorkPage() {
  // Built at request/build time on the server — the filesystem read never
  // reaches the client bundle.
  const tree = buildDescriptionsTree();

  return (
    // `work-page-shell` is the page-level wrapper styled in globals.css.
    <main className="work-page-shell">
      {/* Decorative background layers (gradient glow + film grain). */}
      <div className="ambient-layer" aria-hidden="true" />
      <div className="noise-layer" aria-hidden="true" />

      {/* Page header: kicker + h1 + intro copy + back-to-home link. */}
      <header className="work-page-header">
        <p className="work-page-kicker">Project Index / Terminal View</p>
        <h1>View Work</h1>
        <p className="work-page-copy">
          A focused archive of everything I have shipped or am actively building.
          Open a folder to browse projects by category — open a file to read the
          full writeup.
        </p>

        <div className="work-nav-row">
          <Link className="work-back-link mono" href="/">
            cd .. /home
          </Link>
        </div>
      </header>

      {/* Terminal panel housing the finder. Topbar mimics a macOS terminal
          window (traffic-light dots + path label); the faux command line
          reinforces the motif. The interactive tree itself is FinderTree. */}
      <section className="terminal-panel" aria-label="Project finder">
        <div className="terminal-topbar">
          <div className="terminal-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="terminal-path mono">emilio@portfolio:~/work</p>
        </div>

        <p className="terminal-command mono">$ ls -R ~/work</p>

        <FinderTree tree={tree} />
      </section>

      {/* Default-variant footer at the page bottom (home uses the corner variant). */}
      <Footer />
    </main>
  );
}
