---
title: "CSC 203 Lab 2: Classes and Static State"
summary: Three-part Java lab moving from a fields-only Dog class to a Student class with a static enrollment counter and a HashMap of course grades.
period: "Apr 2026"
status: archived
tags: [Java, Git]
repo: https://github.com/Damilss/lab2
---

An early CSC 203 lab from the week of April 12th, 2026, covering the Monday, Wednesday, and Friday sessions, split into three task packages under one `src` root. Tasks 1 and 2 are the warm-up: a `Dog` class that is nothing but `String name` and `String breed`, beside a `Main` that prints a hello-world line. Task 3 is the real work: a `Student` class that owns its own state, plus a `Main` I used as a hand-rolled test harness.

## How it works

`Student` keeps a `private static int totalNumOfStudents` that the no-arg constructor increments and a static `getTotalNumberOfStudents()` reads back. Per-object state is a private `name` and a `HashMap<String, Double>` mapping course names to scores, reached only through getters and setters. A second, two-argument constructor takes a name and a prebuilt map but does not touch the counter, so `Main` builds both students with the no-arg form and fills the fields in through the setters.

`task_3/Main` constructs two students, names them, reads the enrollment total through the class rather than an instance, then gives each a two-course grade map and prints everything under labeled sections. `printCoursesAndGrades()` prints the map's `toString()` and then loops over a `String[]` sized to the key set but never filled, so the per-line output is `null, null` for each course; that bug is still in the final commit. The enrollment total also goes out through `System.err` while every other line uses `System.out`.

```java
public class Student {
    //class variables
    private static int totalNumOfStudents = 0;

    //object variables
    private String name;
    private HashMap<String, Double> courseAndGrades = new HashMap<>();

    //constructors
    Student(){totalNumOfStudents++;}

    Student(String stName, HashMap<String, Double> courseAndGrades) {
        this.name = stName;
        this.courseAndGrades = courseAndGrades;
    }
```
*Task 3's `Student`: private instance state next to a class-level counter that only the no-arg constructor bumps.*

## Highlights

- Three packages (`task_1`, `task_2`, `task_3`) share a single `src` root, with VS Code pointed at it through `java.project.sourcePaths`.
- `task_1` and `task_2` are identical apart from the package line: a two-field `Dog` with no constructor or methods, and a `Main` whose only statement is a hello-world print.
- Every `Student` field is `private`; the instance fields go through getters and setters, and the enrollment total lives on the class, not the instance.
- 17 commits between April 13 and 17, 2026, including cleanup passes for access modifiers and inline docs.
- One of those passes, `remove useless constructor`, deleted an instance setter that had been reassigning the static counter.
