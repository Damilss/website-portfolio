// =============================================================================
// Footer — the contact links block, used in two places:
//
//   1. <Footer variant="corner" /> — embedded in the home page's hero title
//      row, anchored top-right. Compact layout, signature renders inline.
//   2. <Footer />  (variant="default") — at the bottom of /work. Full-width
//      layout, signature on its own line.
//
// Both variants share the same data — the only difference is layout, driven
// by the `contact-footer-corner` class which the CSS in globals.css uses to
// rearrange the grid.
//
// Editing contact info: the email also appears in
// components/start-project-contact.tsx as PROJECT_EMAIL — keep them in sync
// (called out in CLAUDE.md "Cross-file invariants").
// =============================================================================

// Single source of truth for the contact links. Order here = render order.
// Add/remove entries here to change what shows up; no JSX edits needed.
const contactLinks = [
  { label: "GitHub", href: "https://github.com/Damilss" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/emilio-ledesma-scott-41146138a/" },
  // mailto: link — note this is NOT the same constant as PROJECT_EMAIL in
  // start-project-contact.tsx. They must be kept in sync manually.
  { label: "Email", href: "mailto:me@emilioledesma.com" },
];

// The variant prop controls layout only. "corner" packs the footer into a
// small top-right block; "default" renders a full-width row at the page
// bottom. Defaults to "default" so a bare <Footer /> Just Works.
type FooterProps = {
  variant?: "default" | "corner";
};

export default function Footer({ variant = "default" }: FooterProps) {
  // Convenience flag — a few className-conditionals below read cleaner this way.
  const isCorner = variant === "corner";

  return (
    // The conditional `contact-footer-corner` class triggers the corner-variant
    // layout in globals.css. Both variants share the base `contact-footer`.
    <footer
      className={`contact-footer ${isCorner ? "contact-footer-corner" : ""}`}
      aria-label="Contact footer"
    >
      <div className="contact-footer-main">
        {/* Faux shell prompt — keeps the terminal motif consistent across the site. */}
        <p className="contact-footer-label mono">$ ./contact --links</p>

        <nav className="contact-footer-links" aria-label="Contact links">
          {contactLinks.map((link) => {
            // External links (http://, https://) open in a new tab and get
            // rel="noreferrer" hardening. The mailto: link does NOT — opening
            // a mail client in a new tab is awkward and noreferrer is irrelevant
            // for non-HTTP schemes.
            const isExternal = link.href.startsWith("http");

            return (
              <a
                key={link.label}
                className="terminal-link mono"
                href={link.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Copyright signature.
          - In "default" variant: stacks below the links.
          - In "corner" variant: the extra `contact-footer-signature-corner` class
            tucks it into the corner layout.
          The signature uses a Unicode escape (\u00A9) for the © symbol so
          the source file stays ASCII-safe regardless of editor encoding. */}
      <p
        className={`contact-footer-signature contact-footer-label mono ${
          isCorner ? "contact-footer-signature-corner" : ""
        }`}
      >
        {"\u00A9 Emilio Ledesma 2026"}
      </p>
    </footer>
  );
}
