[repo link](https://github.com/Damilss/csc203-project2/tree/main)
# csc203-project2
Rock Paper Scissors simulation v1.0

## What it does
Grid-based Rock Paper Scissors game. Entities (Rock, Paper, Scissors) are placed randomly on a 2D array and move one cell per round. When an entity moves into a cell occupied by the type it beats, the loser is removed. The game ends when only one type remains.

## How to run

**Game:**
```
javac src/Main.java src/entities/*.java
java -cp src Main
```

**Tests:**
```
javac src/Tests.java src/entities/*.java
java -cp src Tests
```

## Rules
- Rock beats Scissors
- Scissors beats Paper
- Paper beats Rock

## Authors
Roscoe, Emilio 