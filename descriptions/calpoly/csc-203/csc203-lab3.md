---
title: "CSC 203 Lab 3: Subclasses and Inheritance"
summary: An unfinished Java lab modeling a vehicle class hierarchy with an abstract Vehicle base, one SUV subclass, and two empty stubs.
period: "Apr 2026"
status: archived
tags: [Java, Git]
repo: https://github.com/Damilss/csc203-lab3
---

A CSC 203 lab on subclasses, inheritance, and polymorphism, with all five commits landing on April 27th, 2026. The exercise was to model a small vehicle hierarchy in Java: put the state every vehicle shares on an abstract base class, then specialize it in concrete subclasses. I got the base class and one subclass in place and stopped there, so the repo shows the shape of the lab rather than a finished answer.

## Where it stands

`Vehicle` is declared `public abstract class Vehicle` and owns the three fields every vehicle shares, `make`, `model`, and `year`, all private. A three-argument constructor sets them, and each field has a getter and a setter, so a subclass reaches that state only through the public methods rather than touching the fields directly.

`SUV` is the only class that actually inherits. It declares `extends Vehicle`, chains to the base constructor with `super(make, model, year)`, and then adds its own state: a door count, a towing capacity, and an all-wheel-drive flag. That constructor is where the lab's core idea shows up, with the shared fields handled by the parent and the SUV-specific ones handled locally.

`Sedan` and `Truck` are empty class bodies with no `extends` clause, and `Main.main` is empty, so nothing is instantiated and no method is overridden anywhere in the five source files. The polymorphism half of the lab title is not demonstrated in the committed code. Finishing it would mean filling in the two stubs, overriding a base method in each subclass, and calling it through a `Vehicle` reference in `Main`.

```java
public class SUV extends Vehicle {
    private int numberOfDoors;
    private int towCapcity;
    private boolean hasAWD;

    public SUV(String make, String model, int  year, int numOfDoors, int towingCapacity, boolean AWD) {
        super(make, model, year);
        this.numberOfDoors = 4;
        this.numberOfDoors = numOfDoors;
        this.towCapcity = towingCapacity;
        this.hasAWD = AWD;
    }
}
```
*The one working subclass: `SUV` hands the shared fields to `Vehicle` through `super()` and keeps only its own.*

## Highlights

- `Vehicle` is abstract, so it can only be used through a subclass; `make`, `model`, and `year` are private fields behind getters and setters.
- `SUV` is the single class that extends `Vehicle`; its constructor calls `super(make, model, year)` before setting its three extra fields.
- `Sedan`, `Truck`, and `Main.main` are empty, so all five files compile but the program does nothing at runtime.
- Five commits, all on April 27th, 2026; `main` matches `origin/main` with a clean working tree.
