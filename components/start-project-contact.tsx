// =============================================================================
// StartProjectContact — the "Start a Project" CTA on the home page hero.
//
// Behavior:
//   - Click the button → reveals an email chip below it.
//   - Inside the chip: an email icon, the email address, and a copy button.
//   - Click the copy button → writes the email to the clipboard, swaps the
//     icon to a checkmark for ~1.4s as visual confirmation.
//
// The reveal animation itself is CSS-only (driven by the `is-open` class
// applied below) — see `.start-project-reveal` in globals.css.
//
// Cross-file invariant (CLAUDE.md): the email here must stay in sync with
// the `mailto:` link in components/footer.tsx.
// =============================================================================
"use client";

import { useState } from "react";

// The email address shown in the chip and copied to the clipboard.
// Mirror this constant in components/footer.tsx (mailto: link) when changing.
const PROJECT_EMAIL = "me@emilioledesma.com";

export default function StartProjectContact() {
  // Whether the email chip is currently revealed below the button.
  const [isOpen, setIsOpen] = useState(false);

  // Whether the copy button is currently in its "just copied" state
  // (icon swapped to a checkmark). Auto-resets after 1.4s.
  const [isCopied, setIsCopied] = useState(false);

  // Copy the email to clipboard. navigator.clipboard.writeText can throw if
  // - the document isn't focused,
  // - clipboard permission is denied,
  // - the API is unavailable (older browsers / insecure contexts).
  // We swallow the error and reset isCopied to false — the user gets no
  // visual confirmation, which is the right "failure mode" (no false success).
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(PROJECT_EMAIL);
      setIsCopied(true);
      // Auto-revert the icon back to clipboard after 1.4s. Using window.setTimeout
      // (not the global) for explicit-browser-context typing.
      window.setTimeout(() => setIsCopied(false), 1400);
    } catch {
      setIsCopied(false);
    }
  }

  return (
    <div className="start-project-wrap">
      {/* The trigger button.
          - aria-expanded mirrors `isOpen` so screen readers announce the state.
          - aria-controls points to the panel id below for the ARIA association.
          - The functional setState form (state => !state) avoids any stale-
            state issues if React batches multiple toggles. */}
      <button
        type="button"
        className="cta-primary start-project-trigger"
        onClick={() => setIsOpen((state) => !state)}
        aria-expanded={isOpen}
        aria-controls="start-project-panel"
      >
        Start a Project
      </button>

      {/* The reveal panel.
          - The `is-open` class drives the open/close transition in globals.css
            (height + opacity animation).
          - aria-hidden mirrors the visual state so the panel is hidden from
            assistive tech when collapsed. */}
      <div
        id="start-project-panel"
        className={`start-project-reveal ${isOpen ? "is-open" : ""}`}
        aria-hidden={!isOpen}
      >
        {/* The chip itself: icon · email · copy button. */}
        <div className="start-project-chip">
          {/* Envelope icon. Using inline SVG so we can color it with currentColor
              and keep the bundle small. focusable="false" so the SVG isn't
              tab-stoppable in older IE-derived behavior. aria-hidden because
              it's decorative — the visible email text is the actual content. */}
          <span className="start-project-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              focusable="false"
            >
              {/* Envelope rectangle. */}
              <path
                d="M4 6.5C4 5.67157 4.67157 5 5.5 5H18.5C19.3284 5 20 5.67157 20 6.5V17.5C20 18.3284 19.3284 19 18.5 19H5.5C4.67157 19 4 18.3284 4 17.5V6.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              {/* Envelope flap (the V on top). */}
              <path
                d="M4.5 6L12 12L19.5 6"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
          </span>

          <p className="start-project-email">{PROJECT_EMAIL}</p>

          {/* Copy button. The aria-label and title both reflect the current
              state (Copy email / Copied email) so screen-reader and tooltip
              users see the same feedback as the visual icon swap. */}
          <button
            type="button"
            className={`start-project-copy ${isCopied ? "is-copied" : ""}`}
            onClick={handleCopy}
            aria-label={isCopied ? "Copied email" : "Copy email"}
            title={isCopied ? "Copied" : "Copy email"}
          >
            {/* Conditional icon: checkmark when just copied, clipboard otherwise.
                Both icons are aria-hidden — the surrounding button's aria-label
                carries the semantic info. */}
            {isCopied ? (
              // Checkmark — shown for ~1.4s after a successful copy.
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                focusable="false"
                aria-hidden="true"
              >
                <path
                  d="M5 13L9.5 17.5L19 8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              // Clipboard icon — the default "copy" affordance.
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                focusable="false"
                aria-hidden="true"
              >
                {/* Front sheet. */}
                <path
                  d="M9 9.5C9 8.67157 9.67157 8 10.5 8H18C18.8284 8 19.5 8.67157 19.5 9.5V17C19.5 17.8284 18.8284 18.5 18 18.5H10.5C9.67157 18.5 9 17.8284 9 17V9.5Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                {/* Back sheet (peeking out behind the front one). */}
                <path
                  d="M6 15.5C5.17157 15.5 4.5 14.8284 4.5 14V6.5C4.5 5.67157 5.17157 5 6 5H13.5C14.3284 5 15 5.67157 15 6.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
