[repo link](https://github.com/Damilss/csc203-lab4)

# CSC 203 — Lab 4

> Comparables and comparators — sorting Java objects more than one way.

This lab is about Java's `Comparator` interface: sorting `Boat` objects by
different keys — length, type, passenger capacity — by writing a small
comparator for each. The point is that the sort order becomes a pluggable
object, separate from the class being sorted.

```java
import java.util.Comparator;

public class BoatLengthComparator implements Comparator<Boat> {
    public BoatLengthComparator() {}

    @Override
    public int compare(Boat o1, Boat o2) {
        return o1.compareTo(o2);
    }
}
```

*One comparator per sort key — the ordering becomes a value you can pass around.*

## Tech stack

- Java

## Status

Archived — CSC 203 coursework.
