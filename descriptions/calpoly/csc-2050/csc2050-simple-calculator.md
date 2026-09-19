---
title: Simple Calculator
summary: A three-argument Bash script (./calc 2 + 4) that validates integer operands, dispatches five operators, and reports every error on stderr with exit 1.
period: "Sep 2026"
status: archived
tags: [Bash, Git]
repo: https://github.com/Damilss/csc2050-simplecalculator
---

Task 1 for CSC 2050 (software system mechanics): a script named `calc` that takes an
operand, an operator, and a second operand as three positional arguments and prints the
result, so `./calc 2 + 4` prints `6`. I wrote it as a single 66-line Bash file that handles
addition, subtraction, multiplication, division, and modulo, validates its input before
doing any math, and reports every problem on stderr with a non-zero exit.

## How it works

The script checks `$#` first: anything other than exactly three arguments prints a usage
line built from `$0` to stderr and exits 1. Both operands are then tested against the regex
`^-?[0-9]+$` with bash's `[[ … =~ ]]`, which accepts an optional leading minus followed by
one or more digits and, unlike piping to `grep`, runs without a subshell. An operand that
fails prints `Invalid operand` and exits 1 before any arithmetic runs.

Operators are dispatched by an `if`/`elif` chain comparing `$operator` against `+`, `-`,
`*`, `/`, and `%`; each branch evaluates with arithmetic expansion `$(( ))` and exits 0.
The `*` case is quoted in the comparison so `[[ ]]` matches it literally rather than as a
glob, and on the command line it has to be escaped (`./calc 4 \* 5`) so the shell does not
expand it first. The `/` and `%` branches test `$operand2 -eq 0` before evaluating and
print `Division by zero` instead. An operator that matches nothing falls through to
`Wrong operator`, exit 1. Because `$(( ))` is integer arithmetic, `./calc 4 / 3` prints
`1`; the assignment's sample run shows `1.33` via `bc`, which this version leaves out.

```bash
# checking that both operands are integers
# ^-?[0-9]+$ is a regex: ^ anchors the start, -? allows an optional
# leading minus, [0-9]+ requires one or more digits, $ anchors the end.
# =~ applies the pattern. Using [[ ]] avoids a subshell, unlike grep.

if [[ ! "$operand1" =~ ^-?[0-9]+$ ]] || [[ ! "$operand2" =~ ^-?[0-9]+$ ]]
then
        echo "Invalid operand" >&2
        exit 1
fi
```
*Operand validation with a bash regex test instead of a grep subshell.*

## Highlights

- Every failure path (usage, `Invalid operand`, `Division by zero`, `Wrong operator`) writes to stderr with `>&2` and exits 1; every result path exits 0.
- Negative integers are accepted as operands; decimals and non-numeric text are rejected before dispatch.
- Divide-by-zero is guarded on both `/` and `%`, not just `/`.
- Three files across five commits (Sep 8–10, 2026): the README, `calc`, and a short reflection on what I picked up beyond the assignment's scope — bash's `case` statement, `>&2` for stderr, and the difference between `$()`, `$(())`, and backticks.
