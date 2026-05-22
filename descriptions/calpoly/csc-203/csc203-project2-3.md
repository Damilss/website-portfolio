[repo link](https://github.com/Damilss/csc203-project2)

# CSC 203 — Projects 2 & 3: Rock Paper Scissors Simulation

> A grid-based Rock Paper Scissors simulation — entities that move, fight, and get eliminated.

A CSC 203 project (with Roscoe): Rock, Paper, and Scissors entities are placed
randomly on a 2D grid and move one cell per round. When an entity steps onto a
cell holding a type it beats, the loser is removed — the simulation runs until
a single type is left standing.

![Class structure — Rock Paper Scissors](/work-assets/csc203-project2-3/uml.png)

## How it's built

`Rock`, `Paper`, and `Scissors` all extend an abstract `Entity` superclass that
owns the shared state — a grid position, a unique id, and static maps tracking
who is where. Each subclass then defines its own `move` and `attack`. Project 3
revisited the same simulation through a cleaner class design (the UML above).

```java
public abstract class Entity {
    private Point position;
    private final String id;
    protected static int entityCount = 0;

    // shared position bookkeeping for every entity on the grid
    public static HashMap<String, Point> positionById = new HashMap<>();
    public static HashMap<Point, String> idByPosition = new HashMap<>();

    // each subclass defines how it moves and attacks on the shared grid
    public abstract void move(String[][] map, int rows, int columns);
    public abstract void attack(String[][] map, int targetRow, int targetCol);
}
```

*The abstract `Entity` carries shared state; `Rock`, `Paper`, and `Scissors` specialize `move` and `attack`.*

## Tech stack

- Java

## Status

Archived — CSC 203 coursework.
