"use client";

import { GitHubCalendar } from "react-github-calendar";

const GITHUB_USERNAME = "Damilss";

// Classic GitHub contribution colors (dark mode palette).
const ghTheme = {
  light: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
};

export default function GithubContributions() {
  return (
    <section className="gh-panel" aria-label="GitHub contributions">
      <div className="terminal-topbar">
        <div className="terminal-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="terminal-path mono">emilio@portfolio:~/github</p>
        <a
          className="gh-username mono"
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${GITHUB_USERNAME} on GitHub`}
        >
          @{GITHUB_USERNAME}
        </a>
      </div>

      <p className="terminal-command mono">
        {`$ git log --since="1 year ago" --pretty=oneline `}
        <span className="gh-cursor" aria-hidden="true">_</span>
      </p>

      <div className="gh-graph-wrap">
        <GitHubCalendar
          username={GITHUB_USERNAME}
          blockSize={9}
          blockMargin={2}
          fontSize={10}
          colorScheme="dark"
          theme={ghTheme}
          labels={{
            totalCount: "{{count}} contributions in the last year",
          }}
        />
      </div>
    </section>
  );
}
