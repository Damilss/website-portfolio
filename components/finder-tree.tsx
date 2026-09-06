// =============================================================================
// FinderTree — the interactive folder tree on /work.
//
// Receives the descriptions/ tree (built server-side, see lib/descriptions.ts)
// and renders it as an expandable finder: folders toggle open/closed inline,
// files link to their detail page (/work/<path>).
//
// "use client" because expand/collapse state is browser-only.
//
// Open folders survive navigation: the expanded set lives in the module-level
// store below and is mirrored into sessionStorage, so backing out of a project
// (back link, breadcrumb, browser back, reload) restores the tree as it was
// left. A new tab or a later visit still starts fully collapsed. Detail pages
// link back as /work?from=<slug>, which opens that project's ancestor folders
// even for a visitor who deep-linked in from the home page and never touched
// the finder.
// =============================================================================
"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import type { TreeNode } from "@/lib/descriptions";

// sessionStorage key holding the open folder keys as a JSON string array.
const STORAGE_KEY = "work-finder:expanded";

const NO_KEYS: ReadonlySet<string> = new Set();

// -----------------------------------------------------------------------------
// The expanded-folder store.
//
// A tiny external store rather than component state, for two reasons:
//   - useSyncExternalStore's server snapshot lets the prerendered HTML stay
//     "all collapsed" while the client picks up the persisted set right after
//     hydration — no mismatch, and no setState-inside-an-effect.
//   - The in-memory set is the source of truth and sessionStorage only mirrors
//     it, so the tree still expands normally when storage is unavailable
//     (Safari private mode, blocked site data).
// -----------------------------------------------------------------------------

// Read once when the module loads on the client; `window` is undefined while
// the component is prerendered on the server, where the set is always empty.
let expandedKeys: ReadonlySet<string> =
  typeof window === "undefined" ? NO_KEYS : new Set(readStoredKeys());

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Must stay referentially stable between changes — hence the cached set above.
function getSnapshot(): ReadonlySet<string> {
  return expandedKeys;
}

function getServerSnapshot(): ReadonlySet<string> {
  return NO_KEYS;
}

function sameKeys(a: ReadonlySet<string>, b: ReadonlySet<string>): boolean {
  if (a.size !== b.size) return false;
  for (const key of a) if (!b.has(key)) return false;
  return true;
}

// Commit a new set: in memory first, mirrored to storage, then broadcast.
function setExpandedKeys(next: ReadonlySet<string>): void {
  if (sameKeys(expandedKeys, next)) return;
  expandedKeys = next;
  writeStoredKeys(next);
  for (const listener of listeners) listener();
}

function toggleKey(key: string): void {
  const next = new Set(expandedKeys);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  setExpandedKeys(next);
}

// Read the persisted keys. sessionStorage throws when site data is blocked and
// the stored value is user-editable, so every failure mode collapses to
// "nothing was stored".
function readStoredKeys(): string[] {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((key): key is string => typeof key === "string")
      : [];
  } catch {
    return [];
  }
}

// Mirror the expanded set into sessionStorage. A no-op when storage is
// unavailable — persistence is a convenience, never a requirement.
function writeStoredKeys(keys: ReadonlySet<string>): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...keys]));
  } catch {
    // Ignore.
  }
}

// A node's stable identity: folder path or file slug, joined by "/".
function nodeKey(node: TreeNode): string {
  return node.kind === "folder"
    ? node.path.join("/")
    : node.slug.join("/");
}

// Every folder key present in the current tree. Restored and URL-supplied keys
// are intersected with this, which drops folders that were renamed or deleted
// and makes a hand-typed ?from= harmless — unknown keys simply fall away.
function collectFolderKeys(nodes: TreeNode[], out: Set<string>): Set<string> {
  for (const node of nodes) {
    if (node.kind === "folder") {
      out.add(node.path.join("/"));
      collectFolderKeys(node.children, out);
    }
  }
  return out;
}

// Ancestor folder keys of an "a/b/c" file slug -> ["a", "a/b"]; the last segment
// is the file itself. These match folder keys exactly — both are built from the
// same descriptions/ path segments.
function ancestorKeys(slugPath: string): string[] {
  const segments = slugPath.split("/").filter(Boolean).slice(0, -1);
  return segments.map((_, index) => segments.slice(0, index + 1).join("/"));
}

export default function FinderTree({ tree }: { tree: TreeNode[] }) {
  // Collapsed in the prerendered HTML, persisted set immediately after hydration.
  const expanded = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // Prune keys for folders that no longer exist, and fold in the ancestors of
  // ?from= so returning from a project detail page lands on that project. Both
  // only touch the external store, which re-renders through the subscription
  // above. window.location rather than useSearchParams(): the hook would force a
  // Suspense boundary and opt this statically generated route out of it.
  useEffect(() => {
    const valid = collectFolderKeys(tree, new Set<string>());
    const next = new Set<string>();

    for (const key of expandedKeys) {
      if (valid.has(key)) next.add(key);
    }

    const from = new URLSearchParams(window.location.search).get("from");
    if (from) {
      for (const key of ancestorKeys(from)) {
        if (valid.has(key)) next.add(key);
      }
      // Drop the param from the address bar. Bare replaceState — router.replace
      // would re-render the route for a purely cosmetic URL change.
      window.history.replaceState(null, "", window.location.pathname);
    }

    setExpandedKeys(next);
  }, [tree]);

  return (
    <ul className="finder-tree">
      {tree.map((node) => (
        <FinderNode
          key={nodeKey(node)}
          node={node}
          depth={0}
          expanded={expanded}
          onToggle={toggleKey}
        />
      ))}
    </ul>
  );
}

function FinderNode({
  node,
  depth,
  expanded,
  onToggle,
}: {
  node: TreeNode;
  depth: number;
  expanded: ReadonlySet<string>;
  onToggle: (key: string) => void;
}) {
  // Indentation is depth-driven; the CSS does the padding-left math.
  const depthStyle = { "--depth": depth } as CSSProperties;

  // --- File row: a link to its detail page. -------------------------------
  if (node.kind === "file") {
    return (
      <li className="finder-item">
        <Link
          href={`/work/${node.slug.map(encodeURIComponent).join("/")}`}
          className={`finder-row finder-row-file${node.isEmpty ? " is-empty" : ""}`}
          style={depthStyle}
        >
          {/* Empty cell keeps files aligned with the folder disclosure column. */}
          <span className="finder-disclosure" aria-hidden="true" />
          <span className="finder-label">{node.name}</span>
          {node.isOverview && (
            <span className="finder-overview-tag mono">overview</span>
          )}
        </Link>
      </li>
    );
  }

  // --- Folder row: a button that toggles its children open/closed. --------
  const key = node.path.join("/");
  const isOpen = expanded.has(key);

  return (
    <li className="finder-item">
      <button
        type="button"
        aria-expanded={isOpen}
        className="finder-row finder-row-folder"
        style={depthStyle}
        onClick={() => onToggle(key)}
      >
        {/* Disclosure triangle — rotates 90° via CSS when open. */}
        <span
          className={`finder-disclosure${isOpen ? " is-open" : ""}`}
          aria-hidden="true"
        >
          ▸
        </span>
        <span className="finder-label">{node.name}/</span>
        <span className="finder-count mono">
          {node.count} {node.count === 1 ? "item" : "items"}
        </span>
      </button>

      {/* Collapsible container — animated via the grid-template-rows 0fr→1fr
          trick (see globals.css). The nested list only exists while open, so
          collapsed links/buttons leave the tab order and accessibility tree
          without relying on `inert` browser support. */}
      <div className={`finder-children${isOpen ? " is-open" : ""}`}>
        {isOpen && (
          <ul className="finder-sublist">
            {node.children.map((child) => (
              <FinderNode
                key={nodeKey(child)}
                node={child}
                depth={depth + 1}
                expanded={expanded}
                onToggle={onToggle}
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
