const contactLinks = [
  { label: "GitHub", href: "https://github.com/Damilss" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/emilio-ledesma-scott-41146138a/" },
  { label: "Email", href: "mailto:me@emilioledesma.com" },
];

type FooterProps = {
  variant?: "default" | "corner";
};

export default function Footer({ variant = "default" }: FooterProps) {
  const isCorner = variant === "corner";

  return (
    <footer
      className={`contact-footer ${isCorner ? "contact-footer-corner" : ""}`}
      aria-label="Contact footer"
    >
      <div className="contact-footer-main">
        <p className="contact-footer-label mono">$ ./contact --links</p>

        <nav className="contact-footer-links" aria-label="Contact links">
          {contactLinks.map((link) => {
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
