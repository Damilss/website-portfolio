---
title: "CSC 203 Project 5: Data Analysis and Intelligence"
summary: Java program that loads a 117-breed dog CSV into objects and answers queries with Streams, lambdas, and custom exceptions, plus an OpenAI chat client.
period: "May – Jun 2026"
status: archived
tags: [Java, OpenAI API, Git]
repo: https://github.com/Damilss/Project_5_Data_analysis_-_Intelligence
---

A CSC 203 project from late May and early June 2026 that reads `dog_breeds.csv`, 117 breeds across eight columns (Breed, Country of Origin, Fur Color, Height, Color of Eyes, Longevity, Character Traits, Common Health Problems), into `Dog` objects and answers questions about them with Java Streams instead of loops. The second half is a small `AI_Agent` class that sends the breed list to OpenAI's chat-completions endpoint and asks which breeds would make good guard dogs.

## How it works

`CsvAnalysis` opens the file with a `Scanner`, splits the first line on commas into a category list, and throws `EOFException` if there is no header line at all; every remaining line becomes a `String[]` in an `ArrayList`, and the `Scanner` is closed in a `finally` block. `Main` walks that list and calls `IDog.createDog(...)` with the eight columns, so the rest of the program talks to the `IDog` interface rather than the concrete class. Both `ICsvAnalysis` and `IDog` expose their constructors through static factory methods.

Each query method on `Dog` builds a `Predicate<IDog>` or `Function<IDog, Integer>` lambda and hands it to a stream: `filter(...).toArray()` for the breed, country, and fur-color lookups; `filter(...).map(...).forEach(System.out::println)` for a breed's traits, eye color, and health problems; and `parallelStream().map(...).reduce(0, ...)` to sum longevity and height before dividing for the averages. `getDogsFromCountry` is the one that throws: `EmptyListException` when the input list is empty and `NoResultException` when nothing matches. Both extend `RuntimeException` with a default-message and a caller-message constructor, and `Main` calls the method once with the real list and once with an empty one so the multi-catch fires.

```java
@Override
public String getDogsFromCountry(List<IDog> idogs, String country) throws EmptyListException, NoResultException {
    if (idogs.isEmpty()) throw new EmptyListException();

    Predicate <IDog> dogCountryOfOrg = (IDog dog) -> dog.getCountryOfOrigin().equals(country);
    Object[] myObj = idogs.stream()
            .filter(dogCountryOfOrg)
            .toArray();

    if (myObj.length == 0) throw new NoResultException();

    return myObj[0].toString();
}
```
*Country lookup: a lambda `Predicate` feeds a stream filter, with the two custom exceptions covering the empty-input and no-result cases.*

`AI_Agent.askAI` opens an `HttpURLConnection` to the chat-completions URL, sets a bearer `Authorization` header, writes a JSON body assembled by string concatenation with the model fixed to `gpt-5.4-mini-2026-03-17`, reads the response into a `StringBuffer`, and pulls the reply out by scanning for the `"content"` key and splitting on escaped newlines. `Main` builds the prompt from every breed name with a `StringBuilder`, then swaps in an eight-breed prompt to stay under token limits. The `askAI` call itself is commented out in the final commit, so the program as pushed runs only the CSV queries.

## Highlights

- Eight source files, 586 lines: two interfaces (`IDog`, `ICsvAnalysis`), two implementations, two exceptions, `AI_Agent`, and `Main`.
- The country and fur-color lookups return `myObj[0].toString()`, so each reports the first matching breed rather than every match.
- The two averages return `-1.0f` for an empty list instead of throwing.
- `Dog` implements `Comparable<Dog>` by breed name and overrides `equals` and `hashCode`; `hashCode` starts at `17*31` and adds the character values of the breed string.
- Eight commits between May 29 and June 4, 2026, ending with a pass that wired the custom-exception handling into `Main`.
