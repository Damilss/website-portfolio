[repo link](https://github.com/Damilss/devsize-plus)

# devsize-plus

> A native macOS disk-usage explorer — see where your storage actually went.

devsize-plus is a TreeSize-style disk explorer for macOS: point it at a folder
and it scans recursively, aggregates sizes bottom-up, and shows you the biggest
offenders. It's 100% client-side — no servers, no telemetry, no database — and
built to feel native and fast with Swift, SwiftUI, and Swift Concurrency.

## How it works

The scanner walks the filesystem and builds an in-memory tree of `FSNode`s —
each one holds its own size plus its children, and folder sizes aggregate up
from the leaves. The scan runs as a cancellable async `Task` that reports
progress, so the UI stays responsive even on huge directories. Access comes
through a folder picker and security-scoped bookmarks — no Full Disk Access
required.

```swift
public struct FSNode: Identifiable, Hashable {
    // A URL makes a stable identity for a filesystem model
    public var id: URL { url }

    let url: URL
    let isDirectory: Bool

    // filled in during the scan
    var sizeBytes: Int64 = 0
    var children: [FSNode] = []

    var name: String {
        let last = url.lastPathComponent
        return last.isEmpty ? url.path : last
    }
}
```

*The whole scan is a tree of these — sizes aggregate from the leaves up.*

## What it does

Scan a folder with live progress and cancel · browse children sorted by size ·
drill into subfolders · reveal in Finder, Quick Look, open, copy path · move to
Trash · rescan any node.

## Tech stack

- Swift, SwiftUI
- Swift Concurrency — `async`/`await` with `Task` cancellation
- `FileManager` + `URLResourceValues` for the filesystem walk
- Folder picker + security-scoped bookmarks for sandbox-friendly access

## Status

Shipping — an early, working v0.
