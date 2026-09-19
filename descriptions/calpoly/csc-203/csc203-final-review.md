---
title: "CSC 203 Final Review: Comparators and Streams"
summary: Two-file Java scratchpad from CSC 203 finals review that rehearses Comparable, chained Comparators, and Javadoc, with a stream filter left as a stub.
period: "Jun 2026"
status: archived
tags: [Java, Git]
repo: https://github.com/Damilss/csc203-final
---

A two-file Java scratchpad I wrote while reviewing for the CSC 203 final, with all five commits landing on June 8, 2026. It is study material rather than a project: a `Book` class and a `Main` that seeds four invented titles and prints them, written to rehearse `Comparable`, `Comparator` chaining, Javadoc conventions, and a stream pipeline. The README says only `203 final review`.

## How it works

`Book` keeps a title, author, year, and page count behind getters and implements `Comparable<Book>` with a `compareTo` that returns `this.year - o1.year`, so the natural order is by publication year. Two `Comparator<Book>` fields practice the chaining idiom: `byPageCount` wraps `Comparator.comparing(Book::getPageCount)`, and `byAuthor` adds `.thenComparing(Book::getYear)` as a tie-break, though its key is `Book::toString` rather than `Book::getAuthor`, so it actually orders on the printed line. `Main` fills an `ArrayList<Book>` with four books and prints each `toString()` in an enhanced for loop; neither the natural order nor the comparators is ever applied.

```java
    /**
     * Comparator to compare books by pageCount
     */
    Comparator<Book> byPageCount  = Comparator.comparing(Book::getPageCount);

    /**
     * Comparator to compare by author that breaks ties by year
     */
    Comparator<Book> byAuthor = Comparator.comparing(Book::toString).thenComparing(Book::getYear);
```
*The two comparator fields in `Book`: one key extractor, then a chained tie-break.*

## Where it stands

The last method, `printAuthors`, is a stub: its `Predicate<Book>` lambda body is the placeholder `...author`, the stream ends in `.forEach(null)`, and `Predicate` is never imported, so `Book.java` does not compile as committed. The final commit, `docs add javadocs`, added Javadoc blocks to the class and every getter, each with an empty `@return`, and dropped an unused `Comparator<Book>` from the class's implements clause. There is no build file and no test, and nothing has changed since that review session.
