---
title: "CSC 203 Lab 4: Comparables and Comparators"
summary: A one-day Java lab giving a Boat class a natural ordering by length plus three standalone Comparators for length, passenger capacity, and boat type.
period: "May 2026"
status: archived
tags: [Java, Git]
repo: https://github.com/Damilss/csc203-lab4
---

A one-day CSC 203 lab on Java's two ordering mechanisms, built side by side. `Boat` implements `Comparable<Boat>` to define a single natural ordering, and three separate classes implement `Comparator<Boat>` to supply alternate orderings without changing `Boat` itself. All 17 commits landed on May 18, 2026, between 9:57 am and 3:54 pm.

## How it works

`Boat` holds a `BoatTypes` enum value, an `int length`, and an `int passengerCapacity`, exposed through public getters and protected setters. Its `compareTo` is plain subtraction on length, `return this.length - other.length;`, so a longer boat compares positive against a shorter one and equal lengths compare as zero.

Each comparator lives in its own file. `BoatLengthComparator.compare` is a one-line delegation to `o1.compareTo(o2)`, the natural ordering repackaged as a standalone object. `BoatPassengerCapacityComparator` subtracts capacities the same way `Boat` subtracts lengths. `BoatTypeComparator` pulls each boat's `BoatTypes` and returns `type1.compareTo(type2)`, relying on the fact that Java enums compare by declaration order. That makes the order of the constants in `BoatTypes` the real ranking, so I reordered its eight constants by size in a dedicated commit, `change ordering of in enum by size`, running CRUISE, WORK_BOAT, YACHT, FERRY, SAILBOAT, FISHING_BOAT, SPEEDBOAT, CANOE. A cruise ship therefore compares negative against a tug, and two cruise ships compare equal.

Verification is a hand-rolled harness rather than JUnit. `BoatTest` keeps static `passed` and `failed` counters and a `check(String name, boolean condition)` helper that only bumps a counter; the name is never printed. `main` builds five fixture boats (two cruise ships, a tug, a yacht, and a canoe) and runs 12 assertions, three for `compareTo` and three per comparator, each set covering a positive, a negative, and a zero result, then prints the tally. Nothing in the repo calls a sort: there is no `Collections.sort` or `Arrays.sort`, and `Main.java` is an empty stub, so the comparators are asserted on directly rather than through a sorted list.

```java
    @Override
    public int compare(Boat o1, Boat o2){
        BoatTypes type1 = o1.getType();
        BoatTypes type2 = o2.getType();
        
        /**
         * Enums automatically implement compareTo, going based off the order the enum. similar to an array.
         * With the first item in the list being the ord 0, while the last being ord x, increasing for every 
         * item in the enum.
         */
        return type1.compareTo(type2);
    }
```
*`BoatTypeComparator.compare`: the enum's own `compareTo` does the ranking, so declaration order in `BoatTypes` is the sort key.*

## Highlights

- `Boat implements Comparable<Boat>` with a subtraction-based natural ordering on length; the class is otherwise fields, getters, and protected setters.
- Three `Comparator<Boat>` classes, one file each: length delegates to `compareTo`, passenger capacity subtracts, and type compares enum ordinals.
- `BoatTypes` declares eight constants, reordered by size in a dedicated commit so ordinal comparison ranks the largest vessel first.
- `BoatTest` runs 12 assertions from `main` over five fixture boats and prints a `Passed tests, N | Failed Tests, M` tally with no JUnit dependency.
- No build file and no sort call anywhere in the repo; `Main.java` is an empty stub.
- 17 commits, all on May 18, 2026, including `move tests to boattest class` and `update comparator names for specificity`.
