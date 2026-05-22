[repo link](https://github.com/Damilss/csc203-project4)

# CSC 203 — Project 4: Virtual World

> A simulated grid-world of autonomous entities — built, then refactored for cohesion.

A CSC 203 project: a visual grid-world simulation rendered with Processing.
Entities — Dudes, Fairies, Trees — move around the world, gather resources, and
animate, all driven by an event scheduler that fires timed actions. Project 4
was as much a refactoring exercise as a feature one: taking a working
simulation and reshaping it for cohesion and clear responsibilities.

```java
public final class Functions {

    public static int getIntFromRange(int max, int min) {
        Random rand = new Random();
        return min + rand.nextInt(max - min);
    }

    public static int clamp(int value, int low, int high) {
        return Math.min(high, Math.max(value, low));
    }
}
```

*Small shared utilities — random ranges and clamping — used throughout the simulation.*

## Tech stack

- Java, Processing

## Status

Archived — CSC 203 coursework.
