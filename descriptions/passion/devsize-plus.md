---
title: devsize-plus
summary: A native, client-only macOS disk-usage explorer in Swift and SwiftUI; the data model and view-model scaffolding exist, the scanner does not yet.
period: "Mar 2026"
status: paused
tags: [Swift, SwiftUI, Git]
repo: https://github.com/Damilss/devsize-plus
featured: 4
---

devsize-plus is a disk-usage explorer for macOS in the style of TreeSize: you
pick a folder, it scans everything underneath, and it shows which subfolders and
files are taking the space. I'm writing it as a native Swift and SwiftUI app
that runs entirely on the machine, with no backend, no database, and no
telemetry. Right now it is a design plus the first pieces of scaffolding, not a
working app.

## How it's meant to work

The design has three layers. A scanner walks the chosen folder with
`FileManager` and `URLResourceValues`, building an in-memory tree and summing
sizes from the leaves up so every folder knows its total. A view model owns the
scan and its state: the root URL and root node, the selected node, whether a
scan is running, a status line, the path currently being read, and a
files-scanned count. SwiftUI views sit on top, a sidebar tree plus a main list
of a folder's children sorted by size. The scan is meant to run as a cancellable
async `Task` that reports progress, so the window stays usable during a long
walk.

The tree is one value type. `FSNode` is `Identifiable` and `Hashable` with its
URL as the identity, and it carries `isDirectory`, `sizeBytes`, and a recursive
`children` array. Size starts at zero and children empty; the scanner is meant
to fill both in.

```swift
public struct FSNode: Identifiable, Hashable {
    //Using URL as a stable identity works well for filesystem models
    var id: URL { url }
    
    let url: URL
    let isDirectory: Bool
    
    //placeholder fields for file values. it'll get updated during scanning
    var sizeBytes: Int64 = 0
    var children: [FSNode] = []
```
*The core model: a value-type tree node keyed by its URL, with size and children left for the scanner to fill.*

Folder access is meant to follow the sandbox rules rather than ask for Full Disk
Access. The Xcode target has App Sandbox enabled with user-selected file access
set to read-only, so the app would only see a folder the user picks, and the
plan is to keep that grant across launches with a security-scoped bookmark.
Read-only covers scanning, but not the move-to-Trash item further down the
feature list.

## Where it stands

The repo holds four Swift files, 100 lines in total, all committed in March
2026. `FSNode` is finished. The view model exists as a `@MainActor`
`ObservableObject` with `@Published` properties for all of the scan state above,
but its only method, `chooseFolder()`, sets a title and prompt on a `panel` that
is never declared, so the project does not build. `ContentView` is still the
stock Xcode template view, and the app entry point shows it in a `WindowGroup`
without the view model attached. There is no scanner file, and nothing in the
sources uses `async`, `await`, `Task`, `FileManager`, or `URLResourceValues`;
those are decisions from the README, not code.

Next, in order: create the open panel and store the chosen folder's URL, write
the scanner as an async task with progress and cancellation, replace the
template view with the sidebar tree and size-sorted list, then work through the
rest of the planned v0 list: reveal in Finder, open, Quick Look, copy path, copy
a size report, rescan a node, and move to Trash.

## Highlights

- Client-only by design: no backend, no database, no telemetry.
- `FSNode` is a value type keyed by its URL, so a finished scan is a plain tree of structs.
- The view model is a `@MainActor` `ObservableObject`, and the target sets Swift's default actor isolation to `MainActor`.
- App Sandbox is on, with user-selected file access set to read-only in the build settings.
- Every feature in the README is listed as planned; none of them are implemented yet.
