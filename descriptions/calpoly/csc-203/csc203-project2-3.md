---
title: "CSC 203 Projects 2 and 3: Rock Paper Scissors Simulation"
summary: A terminal Rock Paper Scissors simulation in Java, built once with standalone entity classes and then rebuilt around an interface and a shared superclass.
period: "Apr – May 2026"
status: archived
tags: [Java, Git]
repo: https://github.com/Damilss/csc203-project2
role: Co-author, primary contributor
---

A two-person CSC 203 project with Roscoe. The user picks a grid size and an entity count, `World` scatters Rocks, Papers, and Scissors onto random empty cells, and each round every entity picks a random neighboring cell: it steps in if the cell is empty, removes the occupant and steps in if that occupant is the type it beats, and otherwise stays put. Play continues until one type is left. Project 2 was the first working build, tagged `v1.0`; Project 3 rebuilt the same simulation under several class designs, and the one merged to `main` is tagged `v2.0`.

![UML class diagram of the interface version: Rock, Paper, and Scissors implement an Entity interface, World holds an Entity grid, and an EntityRegistry routes lookups](/work-assets/csc203-project2-3/uml.png)
*The Project 3 interface version. It was submitted as an archive and is not on the GitHub repo, whose `main` branch holds the abstract-superclass design described below.*

## How it works

Every entity registers itself in two static `HashMap`s, `positionById` and `idByPosition`, while a `String[][]` grid holds the printable symbol for each cell. That only works because `Point` overrides `equals` and `hashCode` to compare by coordinates, so a freshly built `Point` finds the entity stored under an equal one. `Main` validates every prompt in a retry loop and rejects an entity count above `(rows*columns)/2`, which is what lets `World.initEntities()` place each entity by retrying random coordinates until `cellisEmpty()` succeeds.

Project 2 had one standalone class per entity, each with its own maps and no shared parent. Feedback on it made two points: the exception handling was more than a game this small needed, and nearly every field was public. Project 3 answered with a design comparison. Two variants were packaged for grading, each with its own UML: an interface version, where `Entity` declares `getSymbol`, `getPreySymbol`, `moveEntity`, and `remove`, `World` holds an `Entity[][]` grid, and a static `EntityRegistry` routes position lookups across the three per-class maps; and a subclass version, where a concrete `Entity` parent owns the shared maps and the whole `moveEntity` routine, and subclasses mainly supply their symbol and prey symbol. On GitHub, the `abstract-classes` branch makes `Entity` abstract with abstract `move` and `attack`, and `ultimate-version` moves those into an `Action` interface with a default `remove`; that is what `main` holds. `position` and `id` are no longer public in any of them, but `Main` still parses input in a try/catch.

There is no build tool or test framework. Everything compiles with `javac`, and verification is a 274-line `Tests.java` that prints expected against actual for `addEntity`, `removeEntity`, `printWorld`, `playRound`, and each type's move and attack, clearing every static counter and map by hand between cases.

```java
    @Override 
    public boolean equals(Object obj) {
        if (this == obj){
            return true;
        }
        //if not same class of point, short circuit and return false.
        if (!(obj instanceof Point other)){
            return false;
        }
        return this.x == other.x && this.y == other.y;
    }
```
*`Point.equals` compares by coordinates; paired with `hashCode` returning `Objects.hash(x, y)`, it is what makes the position maps work.*

## Highlights

- `Point` overrides `equals` and `hashCode`, which the `HashMap`-based position tracking depends on.
- `Main` caps the entity count at half the grid so `World.initEntities()` always finds an empty cell.
- Project 3 produced two graded designs, interface and subclass, each with its own UML; the diagram above is the interface one.
- `main` is the `ultimate-version` merge (`v2.0`): abstract `Entity` plus an `Action` interface with `move`, `attack`, and a default `remove`.
- The `interfaces` and `subclasses` branches on GitHub hold only the Project 2 code and docs; the two graded variants exist only in the submission archives.
- No JUnit and no build tool: a hand-written 274-line `Tests.java` under plain `javac`.
