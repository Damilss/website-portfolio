// =============================================================================
// FinderTree — the interactive folder tree on /work.
//
// Receives the descriptions/ tree (built server-side, see lib/descriptions.ts)
// and renders it as an expandable finder: folders toggle open/closed inline,
// files link to their detail page (/work/<path>).
//
// "use client" because expand/collapse state is browser-only.
// =============================================================================
"use client";

import { useCallback, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import type { TreeNode } from "@/lib/descriptions";

// A node's stable identity: folder path or file slug, joined by "/".
function nodeKey(node: TreeNode): string {
  return node.kind === "folder"
    ? node.path.join("/")
    : node.slug.join("/");
}

export default function FinderTree({ tree }: { tree: TreeNode[] }) {
  // Set of expanded folder keys. Starts empty — all folders collapsed.
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = useCallback((key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  return (
    <ul className="finder-tree">
      {tree.map((node) => (
        <FinderNode
          key={nodeKey(node)}
          node={node}
          depth={0}
          expanded={expanded}
          onToggle={toggle}
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
  expanded: Set<string>;
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
          trick (see globals.css). `inert` when closed so the hidden children
          are not focusable or announced to screen readers. */}
      <div
        className={`finder-children${isOpen ? " is-open" : ""}`}
        inert={!isOpen}
      >
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
      </div>
    </li>
  );
}
