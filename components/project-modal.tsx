"use client";

import { useEffect } from "react";

export type ProjectData = {
  id: string;
  title: string;
  year: string;
  status: "active" | "shipping" | "archived";
  stack: string[];
  description: string;
  links?: { label: string; href: string }[];
};

type Props = {
  project: ProjectData | null;
  onClose: () => void;
};

export default function ProjectModal({ project, onClose }: Props) {
  // scroll to top when modal opens
  useEffect(() => {
    if (!project) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [project]);

  // ESC key → close and return to card anchor
  useEffect(() => {
    if (!project) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  function handleClose() {
    const id = project?.id;
    onClose();
    if (id) {
      // wait one tick for the modal to unmount, then scroll to card
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }

  if (!project) return null;

  const slug = project.title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div
      className="pm-overlay"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div className="pm-window" onClick={(e) => e.stopPropagation()}>
        {/* topbar */}
        <div className="pm-topbar">
          <div className="terminal-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="pm-path mono">emilio@portfolio:~/{slug}</p>
          <button
            className="pm-close mono"
            onClick={handleClose}
            aria-label="Close"
          >
            esc
          </button>
        </div>

        {/* body */}
        <div className="pm-body">
          <p className="pm-command mono">$ cat README.md</p>

          <div className="pm-content">
            <div className="pm-title-row">
              <h2 className="pm-title">{project.title}</h2>
              <span className={`terminal-status mono terminal-status-${project.status}`}>
                {project.status}
              </span>
            </div>

            <p className="pm-year mono">year: {project.year}</p>

            <p className="pm-description">{project.description}</p>

            <div className="pm-stack-row">
              <span className="pm-stack-label mono">stack:</span>
              <ul className="pm-stack" aria-label="stack">
                {project.stack.map((tech) => (
                  <li key={tech} className="pm-stack-chip mono">{tech}</li>
                ))}
              </ul>
            </div>

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
