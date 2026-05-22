[repo link](https://github.com/Damilss/csc203-lab3)

# CSC 203 — Lab 3

> Subclasses, inheritance, and polymorphism in Java.

This lab works through inheritance and polymorphism: an abstract `Vehicle` base
class with concrete subclasses that share common state and override behavior.
The exercise is about getting the shape of a class hierarchy right — what
belongs on the base, and what each subclass specializes.

```java
public abstract class Vehicle {
    private String make;
    private String model;
    private int year;

    public Vehicle(String make, String model, int year) {
        this.make = make;
        this.model = model;
        this.year = year;
    }

    public String getMake()  { return this.make; }
    public String getModel() { return this.model; }
    public int    getYear()  { return this.year; }
    // ...setters; subclasses extend Vehicle
}
```

*The abstract base holds the shared state; each subclass extends it.*

## Tech stack

- Java

## Status

Archived — CSC 203 coursework.
