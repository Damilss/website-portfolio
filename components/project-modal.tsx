// =============================================================================
// ProjectModal — full-screen-ish overlay that shows a project's full details
// when the user clicks a card on /work.
//
// Lifecycle:
//   - Parent (/work page) holds the open state in `active: ProjectData | null`.
//   - Passing a non-null project mounts/displays the modal.
//   - Passing null hides it. We don't unmount — we early-return null.
//
// Interaction model:
//   - Click the dimmed overlay → close.
//   - Click anywhere INSIDE the window → does NOT close (stopPropagation).
//   - Press Escape → close.
//   - Click the "esc" button in the topbar → close.
//   - On close, focus + scroll return to the triggering card.
//
// Accessibility:
//   - On open:  focus moves into the modal (close button).
//   - While open: Tab/Shift+Tab are trapped inside .pm-window.
//   - On close: focus is restored to the card that triggered the modal.
//
// Must be a client component because it uses useEffect, window, and document.
// =============================================================================
"use client";

import { useEffect, useRef } from "react";

// Public type — the work page imports this so its setActive() calls are typed.
// Adding a field here means updating every <li onClick={() => setActive({...})}>
// on the work page that needs the new field.
export type ProjectData = {
  id: string;       // matches the <li id="..."> on /work — used for focus/scroll-back-on-close.
  title: string;
  year: string;
  status: "active" | "shipping" | "archived";  // drives the status pill color.
  stack: string[];
  description: string;
  links?: { label: string; href: string }[];   // optional — projects without links omit this.
};

type Props = {
  project: ProjectData | null;
  onClose: () => void;
};

export default function ProjectModal({ project, onClose }: Props) {
  // Ref for the close button — receives focus on open.
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // Ref for the modal window — used to query focusable elements for the focus trap.
  const windowRef = useRef<HTMLDivElement>(null);

  // -- Scroll page to top when modal opens ------------------------------------
  // The modal is rendered at the top of the work page (above all panels).
  // If the user had scrolled deep before clicking a card, the modal would be
  // off-screen above. Smooth-scroll to top so the modal is in view on open.
  useEffect(() => {
    if (!project) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [project]);

  // -- Focus management on open -----------------------------------------------
  // Move focus to the close button as soon as the modal appears.
  // We defer one tick (setTimeout 0) so the DOM is fully painted before
  // calling .focus() — without the defer, the element may not be visible yet
  // and some browsers silently ignore the call.
  useEffect(() => {
    if (!project) return;
    const t = setTimeout(() => closeButtonRef.current?.focus(), 0);
    return () => clearTimeout(t);
  // Re-run only when the *project identity* changes (different card opened),
  // not on every re-render. project.id is stable per open session.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  // -- Keyboard: Escape + focus trap ------------------------------------------
  // Two responsibilities handled in one keydown listener to avoid double-
  // attaching/removing event listeners.
  //
  //   Escape → close the modal.
  //   Tab / Shift+Tab → trap focus inside .pm-window so keyboard users can't
  //     accidentally tab into the page behind the overlay.
  //
  // The eslint-disable on exhaustive-deps is intentional: the effect closes
  // over `handleClose` which closes over `project`, so listing `project` is
  // sufficient — pulling `handleClose` into deps would churn it every render.
  useEffect(() => {
    if (!project) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
        return;
      }

      if (e.key === "Tab" && windowRef.current) {
        // Collect all keyboard-reachable elements inside the modal window.
        const focusable = Array.from(
          windowRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled"));

        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          // Shift+Tab from first element → wrap to last.
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          // Tab from last element → wrap to first.
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  // Close handler — restores focus + scrolls back to the originating card.
  // Sequence is important:
  //   1. Capture the id BEFORE calling onClose() (which sets project=null).
  //   2. Call onClose() so React starts unmounting the modal.
  //   3. In the next animation frame (after modal is out of the DOM), move
  //      focus back to the card and scroll it into view.
  //      Waiting for rAF ensures the card is no longer obscured by the overlay
  //      when scrollIntoView calculates position.
  function handleClose() {
    const id = project?.id;
    onClose();
    if (id) {
      requestAnimationFrame(() => {
        const card = document.getElementById(id);
        card?.focus();
        card?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }

  // Null project = modal closed. We early-return rather than rendering an
  // invisible/empty wrapper so the DOM stays clean and effects above bail.
  if (!project) return null;

  // Build a slug for the faux-terminal path label in the topbar. This is
  // display-only — it doesn't have to match the actual id used elsewhere
  // (e.g. "Mustang Market" → "mustang-market" in the path bar).
  const slug = project.title.toLowerCase().replace(/\s+/g, "-");

  return (
    // Overlay = the dimmed full-screen layer behind the window.
    // - role="dialog" + aria-modal="true" tells assistive tech this is a modal.
    //   aria-modal also signals to screen readers to ignore content behind it.
    // - aria-label uses the project title for a meaningful accessible name.
    // - onClick on the overlay closes the modal (clicking outside the window).
    <div
      className="pm-overlay"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      {/* Window = the actual content card.
          - ref={windowRef} so the focus trap can query focusable elements.
          - stopPropagation prevents clicks inside from bubbling to the overlay's
            close handler. */}
      <div className="pm-window" ref={windowRef} onClick={(e) => e.stopPropagation()}>
        {/* topbar — same faux-terminal chrome as the rest of the site, plus
            an "esc" button on the right that doubles as a close affordance. */}
        <div className="pm-topbar">
          <div className="terminal-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="pm-path mono">emilio@portfolio:~/{slug}</p>
          {/* ref={closeButtonRef} so this button receives focus on modal open. */}
          <button
            ref={closeButtonRef}
            className="pm-close mono"
            onClick={handleClose}
            aria-label="Close"
          >
            esc
          </button>
        </div>

        {/* body — the actual project content. */}
        <div className="pm-body">
          {/* Faux shell command, decorative, sets terminal motif. */}
          <p className="pm-command mono">$ cat README.md</p>

          <div className="pm-content">
            {/* Title row: project name + status pill.
                The status pill uses the SAME class names as the cards on /work
                (terminal-status-active|shipping|archived) so the colors match. */}
            <div className="pm-title-row">
              <h2 className="pm-title">{project.title}</h2>
              <span className={`terminal-status mono terminal-status-${project.status}`}>
                {project.status}
              </span>
            </div>

            <p className="pm-year mono">year: {project.year}</p>

            <p className="pm-description">{project.description}</p>

            {/* Stack chips. aria-label gives the list a programmatic name
                since the visible "stack:" label is a separate <span>. */}
            <div className="pm-stack-row">
              <span className="pm-stack-label mono">stack:</span>
              <ul className="pm-stack" aria-label="stack">
                {project.stack.map((tech) => (
                  <li key={tech} className="pm-stack-chip mono">{tech}</li>
                ))}
              </ul>
            </div>

            {/* Action links — only rendered if the project supplied any.
                The `links?.length > 0` check covers both `links === undefined`
                and an explicit empty array. */}
            {project.links && project.links.length > 0 && (
              <div className="pm-actions">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    className="cta-primary mono pm-cta"
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
