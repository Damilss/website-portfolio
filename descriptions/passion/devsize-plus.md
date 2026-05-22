[repo link](https://github.com/Damilss/devsize-plus)

# devsize-plus
A macOS, client-only disk usage explorer (TreeSize-style) that scans a folder and shows where space is going. Built to be **native** and **fast**: Swift + SwiftUI + Swift Concurrency, no servers, no database.

## Goals

- Native macOS app with a TreeSize-like experience
- 100% client-side (no telemetry, no backend)

## Core Features (planned)

**v0**
- Pick a folder to scan (user-consented access)
- Async scan with progress + cancel
- Show children sorted by size
- Navigate into folders (breadcrumb +/or sidebar tree)
- Reveal selected item in Finder
- Open (default app)
- Quick Look (spacebar preview)
- Copy Path (POSIX path + file:// URL variants)
- Copy Size Report (e.g., “Folder X: 12.4 GB, 3,421 items”)
- Rescan (selected node or root)
- Move to Trash ✅

**Later**
- Exclusions (e.g., `.git`, `node_modules`)
- Search + filters
- Sort by size/name/modified
- “Treat packages as files” toggle (e.g., `.app`, `.photoslibrary`)
- Optional actions (Move to Trash, etc.)

## Tech Stack

- **Language:** Swift
- **UI:** SwiftUI
- **Concurrency:** async/await, `Task` cancellation
- **Filesystem:** `FileManager`, `URLResourceValues`
- **Permissions:** Folder picker + security-scoped bookmarks (no Full Disk Access required)

## Architecture (high level)

- **Scanner**: Walks the filesystem and builds an in-memory tree of nodes (size aggregates bottom-up).
- **ViewModel**: Owns scan task state (progress, cancellation, selected node).
- **SwiftUI Views**: Sidebar tree + main list/table for children, with sorting/filtering.

## Getting Started

1. Install Xcode (latest stable recommended).
2. Clone the repo:
   ```bash
   git clone <repo-url>
   cd devsize-plus
   
   #LICENSE
   See `Licesne.md` 