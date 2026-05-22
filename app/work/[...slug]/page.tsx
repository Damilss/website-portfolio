// =============================================================================
// /work/[...slug] — project detail page.
//
// Catch-all route: one statically generated page per markdown file under
// descriptions/. The slug array maps directly to a file path —
// ["passion","mustang-market"] -> descriptions/passion/mustang-market.md.
//
// Markdown is rendered with react-markdown + remark-gfm (some files use GFM
// tables / strikethrough). `dynamicParams = false` makes any path that isn't a
// real markdown file render the 404 page.
// =============================================================================
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import Footer from "@/components/footer";
import {
  findFileNode,
  listAllMarkdownFiles,
  readMarkdownFile,
} from "@/lib/descriptions";

// Only the markdown files discovered at build time are valid routes.
export const dynamicParams = false;

export function generateStaticParams() {
  return listAllMarkdownFiles().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const node = findFileNode(slug);
  return { title: node ? `${node.label} — Emilio Ledesma` : "Not found" };
}

// Custom element renderers for the markdown body.
const markdownComponents: Components = {
  // External links open in a new tab; in-page links stay in-page.
  a({ href, children }) {
    const external = typeof href === "string" && /^https?:\/\//i.test(href);
    return (
      <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        {children}
      </a>
    );
  },
  // Wrap tables so they scroll horizontally on narrow screens.
  table({ children }) {
    return (
      <div className="finder-md-table">
        <table>{children}</table>
      </div>
    );
  },
  // Lazy-load embedded images so multi-image pages stay fast. A plain <img>
  // (not next/image) because markdown images carry no intrinsic width/height.
  img({ src, alt }) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={typeof src === "string" ? src : ""}
        alt={alt ?? ""}
        loading="lazy"
        decoding="async"
      />
    );
  },
};

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const node = findFileNode(slug);
  const raw = readMarkdownFile(slug);

  // Belt-and-suspenders alongside dynamicParams=false.
  if (!node || raw === null) notFound();

  // "Empty" matches the finder tree's definition (lib/descriptions.ts isEmpty:
  // a 0-byte file) so a file is never shown as empty in one place but not the
  // other. raw.length === 0 is exactly equivalent to the tree's size === 0.
  const isEmpty = raw.length === 0;

  return (
    <main className="work-page-shell">
      <div className="ambient-layer" aria-hidden="true" />
      <div className="noise-layer" aria-hidden="true" />

      {/* Back-to-finder link, styled like the /work nav. */}
      <div className="work-page-header">
        <div className="work-nav-row">
          <Link className="work-back-link mono" href="/work">
            cd .. /work
          </Link>
        </div>
      </div>

      <section className="terminal-panel" aria-label={`${node.label} detail`}>
        <div className="terminal-topbar">
          <div className="terminal-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="terminal-path mono">
            emilio@portfolio:~/work/{slug.join("/")}
          </p>
        </div>

        <p className="terminal-command mono">$ cat {node.name}</p>

        <div className="finder-detail">
          {/* Breadcrumb path. `work` links to the finder; folder segments are
              plain text (folders are not navigable routes). */}
          <nav className="finder-breadcrumb mono" aria-label="Breadcrumb">
            <Link href="/work" className="finder-breadcrumb-link">
              work
            </Link>
            {slug.map((segment, index) => (
              <span key={index} className="finder-breadcrumb-part">
                <span className="finder-breadcrumb-sep" aria-hidden="true">
                  /
                </span>
                {index === slug.length - 1 ? (
                  <span className="finder-breadcrumb-current">{segment}</span>
                ) : (
                  segment
                )}
              </span>
            ))}
          </nav>

          {isEmpty ? (
            <p className="finder-empty mono">
              {`// ${node.name} is empty — nothing documented here yet.`}
            </p>
          ) : (
            <article className="finder-md">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {raw}
              </ReactMarkdown>
            </article>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
