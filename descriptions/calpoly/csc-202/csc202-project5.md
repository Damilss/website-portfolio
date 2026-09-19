---
title: "CSC 202 — Topological Sort and Two-Colorability"
summary: "Two graph algorithms in Python for Cal Poly's CSC 202: Kahn's topological sort with cycle detection and a BFS check for two-colorability."
period: "Mar 2026"
status: archived
tags: [Python, unittest, Git]
repo: https://github.com/Damilss/csc202-2262-project5
links: [{ label: CSC 202 coursework repo, href: https://github.com/Damilss/csc-202 }]
---

Project 5 from CSC 202, Cal Poly's data structures course, is a pair of graph
algorithms that share one input format: an edge list, a list of two-element
lists of vertex names. `tsort.py` topologically sorts a directed acyclic graph
and raises on a cycle; `two_colorable.py` decides whether an undirected graph is
bipartite. Each module has its own `unittest` file; the repo is linted with Ruff.

## How it works

I wrote `tsort` as Kahn's algorithm. One pass over the edge list fills a
`defaultdict` adjacency list, a `defaultdict` of in-degrees, and the vertex set.
Every vertex with in-degree zero goes onto a stack; the main loop pops a vertex,
appends it to the result, and decrements each successor's in-degree, pushing any
that reach zero. There is no separate cycle check: a vertex on a cycle never
reaches in-degree zero, so if the result comes out shorter than the vertex set
the function raises `ValueError("input contains a cycle")`.

`is_two_colorable` builds an undirected adjacency list by adding each edge in
both directions, then colors it by breadth-first search, restarting from every
vertex that is still uncolored so each component of a disconnected graph gets
checked. The start vertex is colored 0, each newly reached neighbor gets
`1 - colors[vertex]`, and the function returns `False` the moment a neighbor
already matches the vertex being expanded. A self-loop fails that check at once.

```python
        colors[start] = 0
        queue = deque([start])

        while queue:
            vertex = queue.popleft()

            for neighbor in graph[vertex]:
                if neighbor not in colors:
                    colors[neighbor] = 1 - colors[vertex]
                    queue.append(neighbor)
                elif colors[neighbor] == colors[vertex]:
                    return False
```
*The BFS inner loop of `is_two_colorable`: flip the color across each edge and stop the first time a neighbor already matches.*

## Highlights

- The `tsort` suite checks validity rather than one expected list: a
  `check_valid_tsort` helper asserts the result holds exactly the input's
  vertices and that `v1` precedes `v2` for every edge.
- That helper and one `test_simple` case per file were in the first commit; the
  other five `tsort` cases (including a disconnected graph and a cycle that must
  raise) and six two-colorability cases (path, even and odd cycles, disconnected
  graphs, and a self-loop) are the ones I added.
- Ruff runs in preview mode with E/F/W, pep8-naming, commented-out code, missing
  type annotations, import order, docstrings, builtin shadowing, and print calls.
