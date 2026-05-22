// =============================================================================
// descriptions/ → tree helper.
//
// Server-only: this module reads the filesystem (node:fs). It is imported only
// by Server Components (app/work/page.tsx, app/work/[...slug]/page.tsx). The
// finder client component imports the TYPES below with `import type`, which is
// erased at compile time — so this runtime code never enters the client bundle.
//
// The /work finder mirrors the on-disk `descriptions/` directory: every folder
// is a tree node, every `.md` file is a leaf. Non-`.md` files (index.ts, *.tsx,
// dotfiles) are skipped.
//
// Path mapping: descriptions/<a>/<b>/<name>.md  <->  route slug ["<a>","<b>","<name>"]
// =============================================================================
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, sep } from "node:path";

const DESCRIPTIONS_ROOT = join(process.cwd(), "descriptions");

export type TreeFile = {
  kind: "file";
  name: string; // on-disk filename incl. extension, e.g. "csc203-lab2.md"
  label: string; // filename without ".md"
  slug: string[]; // route segments, e.g. ["calpoly","csc-203","csc203-lab2"]
  isOverview: boolean; // filename (sans .md) matches the parent folder name
  isEmpty: boolean; // 0-byte file
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

const collator = new Intl.Collator("en", { sensitivity: "base" });

function isMarkdown(name: string): boolean {
  return name.toLowerCase().endsWith(".md");
}

// Recursively walk one directory into a sorted node list:
// overview file first, then sub-folders (alpha), then remaining files (alpha).
function walkDir(absDir: string, segments: string[]): TreeNode[] {
  const entries = readdirSync(absDir, { withFileTypes: true });
  const folders: TreeFolder[] = [];
  const overview: TreeFile[] = [];
  const files: TreeFile[] = [];
  const parentName = segments[segments.length - 1] ?? "";

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue; // skip dotfiles

    if (entry.isDirectory()) {
      const childSegments = [...segments, entry.name];
      const children = walkDir(join(absDir, entry.name), childSegments);
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
    const node: TreeFile = {
      kind: "file",
      name: entry.name,
      label,
      slug: [...segments, label],
      isOverview: label.toLowerCase() === parentName.toLowerCase(),
      isEmpty: statSync(join(absDir, entry.name)).size === 0,
    };
    (node.isOverview ? overview : files).push(node);
  }

  folders.sort((a, b) => collator.compare(a.name, b.name));
  files.sort((a, b) => collator.compare(a.name, b.name));
  return [...overview, ...folders, ...files];
}

// Build the whole descriptions/ tree (top-level folders + any root-level files).
export function buildDescriptionsTree(): TreeNode[] {
  return walkDir(DESCRIPTIONS_ROOT, []);
}

// Flat list of every markdown file's slug — for generateStaticParams.
export function listAllMarkdownFiles(): string[][] {
  const out: string[][] = [];
  const collect = (nodes: TreeNode[]) => {
    for (const node of nodes) {
      if (node.kind === "file") out.push(node.slug);
      else collect(node.children);
    }
  };
  collect(buildDescriptionsTree());
  return out;
}

// Find a file node by its route slug (for breadcrumb labels / metadata).
export function findFileNode(slug: string[]): TreeFile | null {
  const target = slug.join("/");
  let match: TreeFile | null = null;
  const search = (nodes: TreeNode[]) => {
    for (const node of nodes) {
      if (match) return;
      if (node.kind === "file") {
        if (node.slug.join("/") === target) match = node;
      } else {
        search(node.children);
      }
    }
  };
  search(buildDescriptionsTree());
  return match;
}

// Read one markdown file's raw content by route slug. Returns null if the file
// is missing or the resolved path escapes the descriptions root.
export function readMarkdownFile(slug: string[]): string | null {
  const abs = resolve(DESCRIPTIONS_ROOT, slug.join(sep) + ".md");
  if (abs !== DESCRIPTIONS_ROOT && !abs.startsWith(DESCRIPTIONS_ROOT + sep)) {
    return null;
  }
  try {
    return readFileSync(abs, "utf8");
  } catch {
    return null;
  }
}
