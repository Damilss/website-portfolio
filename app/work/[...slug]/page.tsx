// =============================================================================
// /work/[...slug] — project detail page.
//
// Catch-all route: one statically generated page per markdown file under
// descriptions/. The slug array maps directly to a file path —
// ["passion","mustang-market"] -> descriptions/passion/mustang-market.md.
//
// Each file's YAML frontmatter (title, summary, period, status, tags, links —
// see lib/descriptions.ts) renders as a header block above the markdown body,
// and also feeds <title> / <meta name="description">. The body is rendered
// with react-markdown + remark-gfm (some files use GFM tables / strikethrough).
// `dynamicParams = false` makes any path that isn't a real markdown file render
// the 404 page.
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
  readMarkdown,
} from "@/lib/descriptions";
import type { FileMeta, MetaLink } from "@/lib/descriptions";

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
  const file = readMarkdown(slug);
  return file
    ? {
        title: `${file.meta.title} — Emilio Ledesma`,
        description: file.meta.summary,
      }
    : { title: "Not found" };
}

// Custom element renderers for the markdown body.
const markdownComponents: Components = {
  // External links open in a new tab; in-page links stay in-page.
  a({ href, children, ...props }) {
    const anchorProps = { ...props };
    delete anchorProps.node;
    const external = typeof href === "string" && /^https?:\/\//i.test(href);
    return (
      <a
        {...anchorProps}
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
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

// The link row under the header: repo and live first (fixed labels), then any
// extra `links` from the frontmatter, in file order.
function metaLinks(meta: FileMeta): MetaLink[] {
  const out: MetaLink[] = [];
  if (meta.repo) out.push({ label: "repo", href: meta.repo });
  if (meta.live) out.push({ label: "live", href: meta.live });
  if (meta.links) out.push(...meta.links);
  return out;
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const node = findFileNode(slug);
  const file = readMarkdown(slug);

  // Belt-and-suspenders alongside dynamicParams=false.
  if (!node || !file) notFound();

  const { meta, body, isEmpty } = file;
  const links = metaLinks(meta);
  // Overview files may omit period/status/role; only render the line if there
  // is something to show.
  const metaLine = [meta.period, meta.status, meta.role].filter(
    (part): part is string => Boolean(part),
  );

  // Links back to the finder carry this file's slug so /work can re-open the
  // folders it lives in — see the ?from= handling in components/finder-tree.tsx.
  const finderHref = `/work?from=${encodeURIComponent(slug.join("/"))}`;

  return (
    <main className="work-page-shell">
      <div className="ambient-layer" aria-hidden="true" />
      <div className="noise-layer" aria-hidden="true" />

      {/* Back-to-finder link, styled like the /work nav. */}
      <div className="work-page-header">
        <div className="work-nav-row">
          <Link className="work-back-link mono" href={finderHref}>
            cd .. /work
          </Link>
        </div>
      </div>

      <section className="terminal-panel" aria-label={`${meta.title} detail`}>
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
            <Link href={finderHref} className="finder-breadcrumb-link">
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

          {/* Frontmatter header: title, summary, period · status · role,
              tag chips, and links. Styled by .finder-meta* in globals.css. */}
          <header className="finder-meta">
            <h1 className="finder-meta-title">{meta.title}</h1>
            <p className="finder-meta-summary">{meta.summary}</p>

            {metaLine.length > 0 && (
              <p className="finder-meta-line mono">
                {metaLine.map((part, index) => (
                  <span key={part}>
                    {index > 0 && (
                      <span className="finder-meta-sep" aria-hidden="true">
                        {" · "}
                      </span>
                    )}
                    {part === meta.status ? (
                      // Status gets a colored dot via [data-status] in CSS.
                      <span className="finder-meta-status" data-status={meta.status}>
                        {part}
                      </span>
                    ) : (
                      part
                    )}
                  </span>
                ))}
              </p>
            )}

            {meta.tags && meta.tags.length > 0 && (
              <ul className="finder-meta-tags" aria-label="Tags">
                {meta.tags.map((tag) => (
                  <li key={tag} className="work-tag mono">
                    {tag}
                  </li>
                ))}
              </ul>
            )}

            {links.length > 0 && (
              <div className="finder-meta-links">
                {links.map((link) => (
                  <a
                    key={`${link.label}:${link.href}`}
                    className="terminal-link mono"
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </header>

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
                {body}
              </ReactMarkdown>
            </article>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
