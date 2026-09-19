---
title: "CSC 202 — Lab 6: Sorting Comparisons"
summary: Selection, insertion, and merge sort in Python for Cal Poly's CSC 202, each returning its comparison count, plus a seeded benchmark loop and unittest cases.
period: "Feb 2026"
status: archived
tags: [Python, unittest, Git]
repo: https://github.com/Damilss/sorting-comparisons
links: [{ label: CSC 202 coursework repo, href: https://github.com/Damilss/csc-202 }]
---

Lab 6 for CSC 202, Cal Poly's data structures course. The assignment was to implement
selection sort and insertion sort so that each sorts a list in place and returns the number
of element comparisons it made, then benchmark both against an instructor-provided merge
sort. Returning a count turns the O(n²) versus O(n log n) gap into something you can measure
rather than cite. I committed this copy to its own repo on Feb 28, 2026; the same code also
sits in my CSC 202 coursework repo.

## How it works

Every sort has the signature `(lst: list[Any]) -> int`. Selection sort bumps the counter once
per inner-loop iteration, so it always makes n(n−1)/2 comparisons regardless of input order.
Insertion sort counts one comparison each time it checks a neighbor while shifting and breaks
as soon as the element is in place, so its count drops to n−1 on already-sorted data. The
merge sort came with the lab: `merge_sort_partial` swaps the roles of source and target list
at each level of recursion, so `merge` writes into an existing buffer instead of allocating one.

`benchmarks.py` has a `time_sort` helper that calls `random.seed(1234)` before building
`random.choices(range(1000000), k=size)`, so all three algorithms sort the same list for a
given size, then times the call with `time.time()` and returns seconds and comparisons as a
tuple. I wrote `main()` as an interactive loop around it: it prompts for a list size, then a
letter (`s`, `m`, or `i`) to pick the sort, and prints the elapsed seconds to three decimals
next to the comparison count.

```python
    for idx in range(1, len(lst)):
        sort = lst[idx]
        j = idx - 1
        
        while j >= 0:
            comparison_count += 1
            if lst[j] > sort: 
                lst[j+1] = lst[j]
                j -=1
            else:
                break

        lst[j+1] = sort 
```
*Insertion sort's inner loop: count every neighbor check, and stop shifting the moment the element is in place.*

## Highlights

- Selection sort, insertion sort, the seven tests for them, and the benchmark loop are mine;
  merge sort, `time_sort`, and the two merge-sort tests were starter code.
- Seeding `random` with the same value before every list build makes timings and comparison
  counts directly comparable across the three sorts.
- `sort_tests.py` holds nine `unittest` cases covering empty, single-element, two-element, and
  unsorted lists, each asserting the sorted result plus an exact count or a ceiling on it.
- Known rough edge: the `e` option in the benchmark loop names `exit` without calling it, so
  it does not actually quit.
