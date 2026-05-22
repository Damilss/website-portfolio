[repo link](https://github.com/Damilss/project1-aweeklynumber)

# CSC 203 — Project 1: A Weekly Number

> A weekly calendar manager — the team's job was the delete-event function.

A team CSC 203 project (with Jude Roscoe Parzybok): a command-line weekly
calendar that adds, moves, prints, and deletes events. Our slice of the work
was `deleteEvent()` — finding an event by name across every day of the week and
removing it cleanly.

```java
static void deleteEvent(ArrayList<ArrayList<String>> calendar, String userInputEvent) {
    boolean removedFlag = false;

    for (ArrayList<String> dayOfWeek : calendar) {
        ArrayList<String> kept = new ArrayList<>();
        for (String event : dayOfWeek) {
            int splitAt = event.lastIndexOf(" at ");
            String eventName = event.substring(0, splitAt);

            if (eventName.equalsIgnoreCase(userInputEvent)) {
                removedFlag = true;            // drop it
            } else {
                kept.add(event);               // keep it
            }
        }
        dayOfWeek.clear();
        dayOfWeek.addAll(kept);
    }

    if (!removedFlag) System.err.println("No events found! Check your input.");
}
```

*Each event is stored as `"<name> at <time>"`; the function rebuilds each day without the matched event.*

## Tech stack

- Java

## Status

Archived — CSC 203 coursework.
