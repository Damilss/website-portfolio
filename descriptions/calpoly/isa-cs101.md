---
title: CS 101 Instructional Student Assistant
summary: Grader and course support for Cal Poly's introductory Python course, reviewing GitHub Classroom submissions for correctness, documentation, and test quality.
period: "Spring 2026 – present"
status: active
role: Instructional Student Assistant
tags: [Python, unittest, Git]
---

Since Spring 2026 I have been an Instructional Student Assistant for CS 101, Cal Poly's introductory
programming course, which is taught in Python. This is a role rather than a codebase: the code is the
students', and my part is reading their submissions, running their tests, and giving feedback. Assignments
are distributed and collected through GitHub Classroom, so each submission arrives as its own repository,
roughly 22 per assignment. I graded through Spring 2026 and am continuing in Fall 2026.

## The assignments

Programming Assignments 1 and 2 have students implement typed functions against an instructor-provided
module of small classes. PA1 works over `Price`, `Point`, `Rectangle`, `Circle`, `Book`, and `Employee`
objects; PA2 moves to constructing and traversing `Point`, `Duration`, `Song`, and `Rectangle` objects.
Both require the student to submit their own `unittest` suite alongside the solution, so the tests are
part of what is graded, not just the functions.

Programming Assignment 4 is a larger command-line data-processing program. Students read an operations
file line by line and run `display`, `filter-state`, `filter-gt`, `filter-lt`, `population-total`,
`population`, and `percent` over a roughly 7 MB US county demographics dataset. A course-provided
`some_errors.ops` script feeds the program non-numeric thresholds, unknown field names, unknown
operations, and lines with the wrong number of arguments, so handling malformed input is part of the grade.

## My part

For each submission I open the repository, run the student's own tests, and evaluate three things:
whether the functions are correct, whether the design-recipe documentation the assignments require
(purpose, representation, and hand-test comments) is present and accurate, and the quality of the
student's test suite. None of the code in this work is mine; each repository's history is the student's
commits plus the GitHub Classroom setup commits.

## Highlights

- Two terms so far: Spring 2026 (PA1, PA2, and PA4 graded) and Fall 2026.
- Roughly 22 GitHub Classroom repositories per assignment, each reviewed individually.
- PA1 covers eight typed functions over provided classes; PA2 covers six on object construction and traversal.
- PA4 is a seven-operation interpreter over a colon-delimited operations file and a county demographics dataset, graded on error handling as well as output.
- Test quality is graded alongside correctness because every PA1 and PA2 submission includes a student-written `unittest` file.
