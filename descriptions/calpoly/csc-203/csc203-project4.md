---
title: "CSC 203 Project 4: Virtual World Cohesion Refactor"
summary: A Java refactor of an instructor-provided Processing grid-world simulation, replacing two enum-switched classes with a cohesive type hierarchy.
period: "May 2026"
status: archived
tags: [Java, Processing, JUnit, Git]
repo: https://github.com/Damilss/csc203-project4
---

A CSC 203 refactoring assignment built on an instructor-provided "forest" simulation: a 640x480 Processing sketch where dudes, fairies, trees, saplings, stumps, houses and obstacles sit on a 32-pixel tile grid and take turns off a priority-queue event scheduler. The task was not to add features. It was to find the classes with low cohesion, split them into a hierarchy rooted at a common parent type, and delete the `EntityKind` and `ActionKind` enums the starter used in place of real subtypes, while keeping the program's behavior the same.

## How it works

The starter's `Entity` was a 497-line class that carried every entity's fields at once (`resourceLimit`, `resourceCount`, `actionPeriod`, `animationPeriod`, `health`, `healthLimit`) and chose behavior with `switch (this.kind)`; a house was built as `new Entity(EntityKind.HOUSE, id, position, images, 0, 0, 0, 0, 0, 0)`. `Action` was a tagged final class whose `executeActivityAction` switched on `entity.getKind()` to call `executeSaplingActivity`, `executeTreeActivity` and so on.

I replaced that with abstract classes layered by what an entity actually does. `Entity` now holds only an id, a position and an image list. `AnimatedEntity` adds an animation period, `ActiveEntity` adds an action period and an abstract `executeActivity`, and `MovableEntity` adds `nextPosition` plus a shared `moveToward` step. Concrete classes attach at the level that fits: `House` and `Stump` extend `Entity` directly, `Obstacle` extends `AnimatedEntity`, `Fairy` extends `MovableEntity`, `Tree` and `Sapling` extend a `Plant` class that owns `health` and the shared transform-to-stump logic, and `DudeFull` and `DudeNotFull` extend an abstract `Dude`. `Action` became an interface with two implementations: `ActivityAction` just calls `entity.executeActivity(...)`, and `AnimationAction` advances the frame and reschedules itself.

With the enums gone, "find the nearest tree or sapling" became a type query. `WorldModel.findNearest` takes a `List<Class<? extends Entity>>` and filters with `Class.isInstance`, so `DudeNotFull` asks for `List.of(Tree.class, Sapling.class)`, `DudeFull` for `List.of(House.class)` and `Fairy` for `List.of(Stump.class)`. Each entity class owns its own `KEY`, `NUM_PROPERTIES` and property-index constants, and `parseEntity` switches on those keys into private `parseTree`, `parseSapling` and similar helpers.

```java
public Optional<Entity> findNearest(Point pos, List<Class<? extends Entity>> kinds) {
    List<Entity> ofType = new LinkedList<>();
    for (Class<? extends Entity> kind : kinds) {
        for (Entity entity : this.entities) {
            if (kind.isInstance(entity)) {
                ofType.add(entity);
            }
        }
    }

    return Entity.nearestEntity(ofType, pos);
}
```
*Nearest-entity search after the refactor: callers pass classes instead of enum values, and the switch on kind is gone.*

## Highlights

- `src/` went from 15 files and 1,625 lines to 28 files and 2,001 lines: 15 new classes, two enums deleted, and `Entity` cut from 497 lines to 116.
- The deepest chain is six levels (`Entity` to `AnimatedEntity` to `ActiveEntity` to `MovableEntity` to `Dude` to `DudeNotFull`), and each field the starter zero-padded now lives on the level that introduces it: `animationPeriod` on `AnimatedEntity`, `actionPeriod` on `ActiveEntity`, `health` on `Plant`, `resourceLimit` and `resourceCount` on `Dude`.
- The starter ships 19 JUnit 5 tests that run the simulation headlessly through `VirtualWorld.headlessMain` and compare logged entity states, and the assignment required them to keep passing; the refactored tree compiles without errors against the bundled Processing and JUnit jars.
- The linked repo currently holds the pre-refactor starter; the refactored source lives in a local working copy and has not been pushed.
