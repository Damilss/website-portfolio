---
title: "CSC 203 Project 1: A Weekly Number"
summary: Two-person slice of a class-wide Java weekly-calendar CLI; our team owned deleteEvent(), which removes an event by name from any day of the week.
period: "Apr 2026"
status: archived
tags: [Java, Git]
repo: https://github.com/Damilss/project1-aweeklynumber
role: "Two-person team; wrote deleteEvent() and its docs"
---

A CSC 203 class project from April 2026 in which teams across the class each wrote one function of a shared Java command-line weekly calendar, working against a scaffold the instructor handed out. Jude Roscoe Parzybok and I were assigned `deleteEvent()`. The calendar is an `ArrayList<ArrayList<String>>` with one inner list per day, and each event is a single string like `"Math class at 10:00am"`, so deleting means recovering the name from that string before comparing. It is plain JDK code with no build tool and no test framework.

## My part

I started with `docs/DeleteEvent.md`: a sketch of the data structure, a seven-day example calendar, and the questions to settle before coding (invalid input, empty days, how to get back to the menu). I then pulled the instructor's scaffold from `sandbox/` into `src/` and wrote `deleteEvent()` on April 10. It walks all seven day lists, splits each event on the last `" at "`, compares the name case-insensitively, and collects the survivors into a fresh `newEventsInDay` list instead of removing from the list mid-iteration. My first draft assumed a day's events were one comma-joined string at index 0; a refactor the same day switched to iterating the day's list directly, and `docs/notes.md` records the debate between rebuilding the list and nulling out entries. I also seeded `main()` with the sample calendar from the visual aid so the function could be run against real data.

Jude's April 11 pass flattened a leftover outer index loop from my draft and added the `clear()` plus `addAll()` write-back that commits the rebuilt list to the day. His April 17 commit, "synthesized all classmate code + test file", replaced `src/Main.java` with the merged program: a Scanner-driven six-option menu, `addEvent` with duplicate rejection and chronological insertion, `moveEventDay`, `moveEventTime`, `printDay`, and `printCalendar`. The same commit added `src/Tests.java`, a nine-function harness that prints actual and expected values from a plain `main()`.

```java
for (String event : dayOfWeek) {
    int splitAt = event.lastIndexOf(" at ");
    if (splitAt < 0) {
        newEventsInDay.add(event);
        continue;
    }
    String eventName = event.substring(0, splitAt);
    String eventRest = event.substring(splitAt);

    if (eventName.equalsIgnoreCase(userInputEvent)) {
        removedFlag = true;
    } else {
        newEventsInDay.add(eventName + eventRest);
    }
}
```
*The per-day loop inside `deleteEvent()` at HEAD: survivors accumulate in `newEventsInDay`, and the day is cleared and refilled from it once the loop ends.*

## Highlights

- `deleteEvent()` searches every day, not just one, and on success prints the updated calendar; otherwise it prints a `No events found` error to stderr.
- A null calendar or null day list is reported and skipped, and an event with no `" at "` separator passes through untouched.
- `src/Tests.java` covers `isValidTime`, `isValidOption`, `dayIndex`, add, delete, both moves, and both prints with no dependency beyond `java.util.ArrayList`.
- `addEvent` in the merged program converts 12-hour times to minutes with `getTimeInMinutes()` so each new event lands in time order.
- 36 commits between April 6 and 17, 2026: 29 mine, 7 from Jude.
