"use client";

import { useState } from "react";

const PROJECT_EMAIL = "hello@example.com";

export default function StartProjectContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(PROJECT_EMAIL);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1400);
    } catch {
      setIsCopied(false);
    }
  }

  return (
    <div className="start-project-wrap">
      <button
        type="button"
        className="cta-secondary start-project-trigger"
        onClick={() => setIsOpen((state) => !state)}
        aria-expanded={isOpen}
        aria-controls="start-project-panel"
      >
        Start a Project
      </button>

      <div
        id="start-project-panel"
        className={`start-project-reveal ${isOpen ? "is-open" : ""}`}
        aria-hidden={!isOpen}
      >
        <div className="start-project-chip">
          <span className="start-project-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              focusable="false"
            >
              <path
                d="M4 6.5C4 5.67157 4.67157 5 5.5 5H18.5C19.3284 5 20 5.67157 20 6.5V17.5C20 18.3284 19.3284 19 18.5 19H5.5C4.67157 19 4 18.3284 4 17.5V6.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M4.5 6L12 12L19.5 6"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
          </span>

          <p className="start-project-email">{PROJECT_EMAIL}</p>

          <button
            type="button"
            className={`start-project-copy ${isCopied ? "is-copied" : ""}`}
            onClick={handleCopy}
            aria-label={isCopied ? "Copied email" : "Copy email"}
            title={isCopied ? "Copied" : "Copy email"}
          >
            {isCopied ? (
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
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                focusable="false"
                aria-hidden="true"
              >
                <path
                  d="M9 9.5C9 8.67157 9.67157 8 10.5 8H18C18.8284 8 19.5 8.67157 19.5 9.5V17C19.5 17.8284 18.8284 18.5 18 18.5H10.5C9.67157 18.5 9 17.8284 9 17V9.5Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
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
