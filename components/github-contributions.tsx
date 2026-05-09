// =============================================================================
// GitHub contribution graph for the home page hero.
//
// Renders the classic "year of squares" GitHub contribution heatmap inside
// a terminal-window panel that matches the site's design language.
//
// Wraps `react-github-calendar`, which fetches data from GitHub's public
// contribution endpoint at runtime — no API key, no server-side proxy.
// Because that fetch happens in the browser, this component must be a
// client component ("use client" directive at top).
// =============================================================================
"use client";

import { GitHubCalendar } from "react-github-calendar";

// The GitHub username to render contributions for. Hardcoded because the
// portfolio belongs to one person — no need to make this a prop.
const GITHUB_USERNAME = "Damilss";

// Color ramp for the contribution heatmap. Values, low → high:
//   index 0 = no contributions (background square color)
//   index 4 = the most contributions in the year
// We intentionally use the SAME palette for `light` and `dark` so the graph
// matches the site's dark theme regardless of the user's OS setting. The
// hex values are GitHub's own dark-mode green ramp.
const ghTheme = {
  light: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
};

export default function GithubContributions() {
  return (
    // .gh-panel is a terminal-window-styled wrapper defined in globals.css —
    // matches the panels on /work for visual consistency.
    <section className="gh-panel" aria-label="GitHub contributions">
      {/* Same faux-terminal topbar pattern used elsewhere on the site. */}
      <div className="terminal-topbar">
        <div className="terminal-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="terminal-path mono">emilio@portfolio:~/github</p>
        {/* Username link in the topbar — clicking opens the GitHub profile.
            target="_blank" + rel="noreferrer" is the standard new-tab hardening. */}
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

      {/* Faux git-log command + a blinking cursor. The cursor is a span styled
          via .gh-cursor in globals.css; aria-hidden because it's purely decorative. */}
      <p className="terminal-command mono">
        {`$ git log --since="1 year ago" --pretty=oneline `}
        <span className="gh-cursor" aria-hidden="true">_</span>
      </p>

      {/* The actual heatmap.
          - blockSize: 9px squares (small, fits the hero panel without overflow).
          - blockMargin: 2px gap between squares.
          - fontSize: 10px for axis labels (months / day initials).
          - colorScheme="dark": tells the library which palette key to use from `theme`.
          - labels.totalCount: overrides the library's default tooltip-summary string.
            `{{count}}` is a placeholder the library substitutes at render time. */}
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
