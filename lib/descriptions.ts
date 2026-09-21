// =============================================================================
// descriptions/ → tree helper.
//
// Server-only: this module reads the filesystem (node:fs) and parses YAML
// frontmatter with gray-matter. It is imported only by Server Components
// (app/page.tsx, app/work/page.tsx, app/work/[...slug]/page.tsx). The finder
// client component imports the TYPES below with `import type`, which is erased
// at compile time — so this runtime code never enters the client bundle.
//
// The /work finder mirrors the on-disk `descriptions/` directory: every folder
// is a tree node, every `.md` file is a leaf. Non-`.md` files and dotfiles are
// skipped.
//
// Path mapping: descriptions/<a>/<b>/<name>.md  <->  route slug ["<a>","<b>","<name>"]
//
// Frontmatter contract: every markdown file MUST start with a YAML block (see
// FileMeta below and CLAUDE.md "Authoring descriptions/ content"). The whole
// tree is validated the first time it is built, and any problem throws with a
// message naming the file and the field — so a bad file fails `next build`
// instead of silently rendering wrong. Files with `featured: N` make up the
// Home "Selected Work" list, in ascending N order.
// =============================================================================
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import matter from "gray-matter";

const DESCRIPTIONS_ROOT = join(process.cwd(), "descriptions");

// -----------------------------------------------------------------------------
// Frontmatter types.
// -----------------------------------------------------------------------------

export const PROJECT_STATUSES = [
  "active",
  "shipped",
  "in-progress",
  "paused",
  "archived",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type MetaLink = { label: string; href: string };

type BaseMeta = {
  title: string; // page h1 + <title>
  summary: string; // one sentence; also the <meta name="description">
  repo?: string; // public repo URL (omit for private repos)
  live?: string; // deployed URL
  role?: string; // the owner's role on a team project
  links?: MetaLink[]; // extra links (Devpost, docs, ...)
};

// A folder overview file — its filename matches the parent folder
// (descriptions/passion/passion.md). Only title + summary are required; the
// project fields are optional and `featured` is never allowed.
export type OverviewMeta = BaseMeta & {
  kind: "overview";
  period?: string;
  tags?: string[];
  status?: ProjectStatus;
};

// A project writeup. period/tags/status are required; `featured: N` puts the
// project on the Home page at position N.
export type ProjectMeta = BaseMeta & {
  kind: "project";
  period: string; // human label, e.g. "Jan 2026 – present"
  tags: string[]; // 1–8 canonical tag names
  status: ProjectStatus;
  featured?: number;
};

export type FileMeta = OverviewMeta | ProjectMeta;

// -----------------------------------------------------------------------------
// Tree types.
// -----------------------------------------------------------------------------

export type TreeFile = {
  kind: "file";
  name: string; // on-disk filename incl. extension, e.g. "csc203-lab2.md"
  label: string; // filename without ".md"
  slug: string[]; // route segments, e.g. ["calpoly","csc-203","csc203-lab2"]
  isOverview: boolean; // filename (sans .md) matches the parent folder name
  isEmpty: boolean; // frontmatter present but no body text
  meta: FileMeta;
};

export type TreeFolder = {
  kind: "folder";
  name: string; // directory name, e.g. "csc-203"
  label: string;
  path: string[]; // segments from the descriptions root, e.g. ["calpoly","csc-203"]
  count: number; // number of direct children
  children: TreeNode[];
};

export type TreeNode = TreeFolder | TreeFile;

// A Home "Selected Work" entry — a featured project plus its detail-page href.
export type FeaturedProject = {
  slug: string[];
  href: string;
  meta: ProjectMeta;
};

// -----------------------------------------------------------------------------
// Frontmatter parsing + validation.
// -----------------------------------------------------------------------------

const ALLOWED_KEYS = [
  "title",
  "summary",
  "period",
  "tags",
  "status",
  "repo",
  "live",
  "role",
  "featured",
  "links",
] as const;

type ParseResult =
  | { ok: true; meta: FileMeta; body: string }
  | { ok: false; errors: string[] };

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

// For error messages: "a number", "a date", "an array", ...
function describe(value: unknown): string {
  if (value instanceof Date) return "a date";
  if (Array.isArray(value)) return "an array";
  if (value === null) return "null";
  return `a ${typeof value}`;
}

// Body text after the frontmatter, ignoring whitespace. This is the finder's
// definition of an "empty" file (the old 0-byte check can no longer happen —
// a 0-byte file has no frontmatter and fails validation instead).
export function isBlankBody(body: string): boolean {
  return body.trim().length === 0;
}

// Parse one file's frontmatter into a FileMeta, collecting every problem
// rather than stopping at the first so a broken file is fixed in one pass.
// `relPath` is only used to prefix the error messages.
function parseProjectFile(
  raw: string,
  relPath: string,
  isOverview: boolean,
): ParseResult {
  const errors: string[] = [];
  const fail = (message: string) => errors.push(`${relPath}: ${message}`);

  if (!matter.test(raw)) {
    fail('no frontmatter block — the file must start with a "---" YAML block');
    return { ok: false, errors };
  }

  let data: Record<string, unknown>;
  let body: string;
  try {
    const file = matter(raw);
    data = file.data as Record<string, unknown>;
    body = String(file.content);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    fail(`frontmatter is not valid YAML — ${reason}`);
    return { ok: false, errors };
  }

  // Unknown keys are errors so a typo (`tag:` for `tags:`) can't slip through.
  for (const key of Object.keys(data)) {
    if (!(ALLOWED_KEYS as readonly string[]).includes(key)) {
      fail(
        `unknown frontmatter field "${key}" (allowed: ${ALLOWED_KEYS.join(", ")})`,
      );
    }
  }

  // gray-matter uses YAML 1.1 rules: a bare `2026` is a number and a bare
  // `2026-03-01` is a Date, so string fields get a "quote it" hint.
  const stringField = (field: string, required: boolean): string | undefined => {
    const value = data[field];
    if (value === undefined) {
      if (required) fail(`missing required field "${field}"`);
      return undefined;
    }
    if (!isNonEmptyString(value)) {
      const hint =
        typeof value === "number" ||
        typeof value === "boolean" ||
        value instanceof Date
          ? " — wrap the value in quotes"
          : "";
      fail(`"${field}" must be a non-empty string (got ${describe(value)})${hint}`);
      return undefined;
    }
    return value.trim();
  };

  const title = stringField("title", true);
  const summary = stringField("summary", true);
  const period = stringField("period", !isOverview);
  const role = stringField("role", false);
  const repo = stringField("repo", false);
  const live = stringField("live", false);
  if (repo !== undefined && !isHttpUrl(repo)) fail('"repo" must be an http(s) URL');
  if (live !== undefined && !isHttpUrl(live)) fail('"live" must be an http(s) URL');

  let status: ProjectStatus | undefined;
  const rawStatus = data.status;
  if (rawStatus === undefined) {
    if (!isOverview) fail('missing required field "status"');
  } else if (
    typeof rawStatus !== "string" ||
    !(PROJECT_STATUSES as readonly string[]).includes(rawStatus)
  ) {
    fail(
      `"status" must be one of ${PROJECT_STATUSES.join(" | ")} (got ${JSON.stringify(rawStatus)})`,
    );
  } else {
    status = rawStatus as ProjectStatus;
  }

  let tags: string[] | undefined;
  const rawTags = data.tags;
  if (rawTags === undefined) {
    if (!isOverview) fail('missing required field "tags"');
  } else if (
    !Array.isArray(rawTags) ||
    rawTags.length < 1 ||
    rawTags.length > 8 ||
    !rawTags.every(isNonEmptyString)
  ) {
    fail('"tags" must be an array of 1–8 non-empty strings');
  } else {
    tags = rawTags.map((tag: string) => tag.trim());
    // Tags are React keys on both the Home rows and the detail header, so a
    // repeat would collide as well as read as a mistake.
    const duplicate = tags.find((tag, index) => tags!.indexOf(tag) !== index);
    if (duplicate !== undefined) {
      fail(`"tags" contains a duplicate entry (${JSON.stringify(duplicate)})`);
      tags = undefined;
    }
  }

  let links: MetaLink[] | undefined;
  const rawLinks = data.links;
  if (rawLinks !== undefined) {
    const isLink = (entry: unknown): entry is MetaLink =>
      typeof entry === "object" &&
      entry !== null &&
      isNonEmptyString((entry as MetaLink).label) &&
      isNonEmptyString((entry as MetaLink).href) &&
      isHttpUrl((entry as MetaLink).href);
    if (!Array.isArray(rawLinks) || !rawLinks.every(isLink)) {
      fail('"links" must be an array of { label, href } objects with http(s) hrefs');
    } else {
      links = rawLinks.map((link) => ({ label: link.label, href: link.href }));
    }
  }

  let featured: number | undefined;
  const rawFeatured = data.featured;
  if (rawFeatured !== undefined) {
    if (isOverview) {
      fail('"featured" is only allowed on project files, not the folder overview');
    } else if (!Number.isInteger(rawFeatured) || (rawFeatured as number) < 1) {
      fail(
        `"featured" must be a positive integer (got ${JSON.stringify(rawFeatured)})`,
      );
    } else {
      featured = rawFeatured as number;
    }
  }

  if (errors.length > 0 || title === undefined || summary === undefined) {
    return { ok: false, errors };
  }

  // Build the meta without undefined-valued keys — the tree is handed to a
  // client component as a prop, so keep it plain JSON.
  const base: BaseMeta = { title, summary };
  if (repo !== undefined) base.repo = repo;
  if (live !== undefined) base.live = live;
  if (role !== undefined) base.role = role;
  if (links !== undefined) base.links = links;

  if (isOverview) {
    const meta: OverviewMeta = { ...base, kind: "overview" };
    if (period !== undefined) meta.period = period;
    if (tags !== undefined) meta.tags = tags;
    if (status !== undefined) meta.status = status;
    return { ok: true, meta, body };
  }

  // Unreachable in practice: a missing period/tags/status was recorded in
  // `errors` above. This keeps the narrowing explicit for TypeScript.
  if (period === undefined || tags === undefined || status === undefined) {
    return { ok: false, errors };
  }
  const meta: ProjectMeta = { ...base, kind: "project", period, tags, status };
  if (featured !== undefined) meta.featured = featured;
  return { ok: true, meta, body };
}

function formatErrors(errors: string[]): string {
  const noun = errors.length === 1 ? "problem" : "problems";
  return `descriptions/ frontmatter validation failed (${errors.length} ${noun}):\n  - ${errors.join("\n  - ")}`;
}

// -----------------------------------------------------------------------------
// Directory walk.
// -----------------------------------------------------------------------------

const collator = new Intl.Collator("en", { sensitivity: "base" });

// Exact-case ".md" on purpose: readMarkdown() rebuilds the path as
// `<slug>.md`, so accepting "NOTES.MD" here would produce a tree node whose
// file can't be re-opened on a case-sensitive filesystem (macOS hides this,
// Linux CI doesn't).
function isMarkdown(name: string): boolean {
  return name.endsWith(".md");
}

// Recursively walk one directory into a sorted node list:
// overview file first, then sub-folders (alpha), then remaining files (alpha).
// Frontmatter problems are appended to `errors`; the offending file is skipped.
function walkDir(absDir: string, segments: string[], errors: string[]): TreeNode[] {
  const entries = readdirSync(absDir, { withFileTypes: true });
  const folders: TreeFolder[] = [];
  const overview: TreeFile[] = [];
  const files: TreeFile[] = [];
  const parentName = segments[segments.length - 1] ?? "";

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue; // skip dotfiles

    if (entry.isDirectory()) {
      const childSegments = [...segments, entry.name];
      const children = walkDir(join(absDir, entry.name), childSegments, errors);
      folders.push({
        kind: "folder",
        name: entry.name,
        label: entry.name,
        path: childSegments,
        count: children.length,
        children,
      });
      continue;
    }

    if (!entry.isFile() || !isMarkdown(entry.name)) continue; // skip index.ts, *.tsx

    const label = entry.name.slice(0, -3); // drop ".md"
    const isOverview = label.toLowerCase() === parentName.toLowerCase();
    const relPath = ["descriptions", ...segments, entry.name].join("/");
    const parsed = parseProjectFile(
      readFileSync(join(absDir, entry.name), "utf8"),
      relPath,
      isOverview,
    );
    if (!parsed.ok) {
      errors.push(...parsed.errors);
      continue;
    }

    const node: TreeFile = {
      kind: "file",
      name: entry.name,
      label,
      slug: [...segments, label],
      isOverview,
      isEmpty: isBlankBody(parsed.body),
      meta: parsed.meta,
    };
    (isOverview ? overview : files).push(node);
  }

  folders.sort((a, b) => collator.compare(a.name, b.name));
  files.sort((a, b) => collator.compare(a.name, b.name));
  return [...overview, ...folders, ...files];
}

// Depth-first visit of every file node.
function forEachFile(nodes: TreeNode[], visit: (file: TreeFile) => void): void {
  for (const node of nodes) {
    if (node.kind === "file") visit(node);
    else forEachFile(node.children, visit);
  }
}

// The walked tree is memoized at module scope. A single Next build runs
// generateStaticParams, generateMetadata, and every page render in one
// process — without this cache each helper below re-walks and re-validates
// the whole descriptions/ directory. Only a VALID tree is cached, so in
// `next dev` a fixed frontmatter error clears on the next request. Trade-off:
// a newly added descriptions/ file still needs a dev-server restart to appear.
let treeCache: TreeNode[] | null = null;

// Build the whole descriptions/ tree (top-level folders + any root-level files).
// Throws with a file-and-field message if any frontmatter is invalid.
export function buildDescriptionsTree(): TreeNode[] {
  if (treeCache !== null) return treeCache;

  const errors: string[] = [];
  const tree = walkDir(DESCRIPTIONS_ROOT, [], errors);

  // Cross-file checks: `featured` ranks must be unique, and at least one file
  // must be featured or the Home "Selected Work" list would render empty.
  // Skipped when per-file errors exist — those may be the featured files.
  if (errors.length === 0) {
    const byRank = new Map<number, string>();
    let featuredCount = 0;
    forEachFile(tree, (file) => {
      if (file.meta.kind !== "project" || file.meta.featured === undefined) return;
      featuredCount += 1;
      const relPath = `descriptions/${file.slug.join("/")}.md`;
      const previous = byRank.get(file.meta.featured);
      if (previous !== undefined) {
        errors.push(
          `duplicate "featured" rank ${file.meta.featured}: ${previous} and ${relPath}`,
        );
      } else {
        byRank.set(file.meta.featured, relPath);
      }
    });
    if (featuredCount === 0) {
      errors.push(
        'no file sets "featured" — the Home "Selected Work" list would be empty',
      );
    }
  }

  if (errors.length > 0) throw new Error(formatErrors(errors));

  treeCache = tree;
  return tree;
}

// Flat list of every markdown file's slug — for generateStaticParams.
export function listAllMarkdownFiles(): string[][] {
  const out: string[][] = [];
  forEachFile(buildDescriptionsTree(), (file) => out.push(file.slug));
  return out;
}

// Find a file node by its route slug (for breadcrumb labels / metadata).
export function findFileNode(slug: string[]): TreeFile | null {
  const target = slug.join("/");
  let match: TreeFile | null = null;
  forEachFile(buildDescriptionsTree(), (file) => {
    if (match === null && file.slug.join("/") === target) match = file;
  });
  return match;
}

// The Home "Selected Work" list: every project with `featured`, ascending.
export function listFeaturedProjects(): FeaturedProject[] {
  const out: FeaturedProject[] = [];
  forEachFile(buildDescriptionsTree(), (file) => {
    if (file.meta.kind !== "project" || file.meta.featured === undefined) return;
    out.push({
      slug: file.slug,
      href: `/work/${file.slug.map(encodeURIComponent).join("/")}`,
      meta: file.meta,
    });
  });
  return out.sort((a, b) => (a.meta.featured ?? 0) - (b.meta.featured ?? 0));
}

// Read one markdown file by route slug: parsed frontmatter + the body below
// it. Returns null if the file is missing or the resolved path escapes the
// descriptions root; throws (same message format as the build error) if the
// frontmatter is invalid. Reads fresh rather than through the tree cache so
// edits to an existing file show on refresh in `next dev`.
export function readMarkdown(
  slug: string[],
): { meta: FileMeta; body: string; isEmpty: boolean } | null {
  const abs = resolve(DESCRIPTIONS_ROOT, slug.join(sep) + ".md");
  if (abs !== DESCRIPTIONS_ROOT && !abs.startsWith(DESCRIPTIONS_ROOT + sep)) {
    return null;
  }

  let raw: string;
  try {
    raw = readFileSync(abs, "utf8");
  } catch {
    return null;
  }

  const label = slug[slug.length - 1] ?? "";
  const parentName = slug[slug.length - 2] ?? "";
  const isOverview = label.toLowerCase() === parentName.toLowerCase();
  const parsed = parseProjectFile(raw, `descriptions/${slug.join("/")}.md`, isOverview);
  if (!parsed.ok) throw new Error(formatErrors(parsed.errors));

  return { meta: parsed.meta, body: parsed.body, isEmpty: isBlankBody(parsed.body) };
}
