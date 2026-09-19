---
title: Programming Practice 2026
summary: "A personal 2026 practice repo: one written-up folder per LeetCode problem, plus a C++ exercise track I set myself after Java and C."
period: "Aug 2026 – present"
status: active
tags: [Java, C++, Git]
repo: https://github.com/Damilss/programming-practice-2026
---

programming-practice-2026 is where I keep my own algorithm practice for the
year. The README states the rule I was holding myself to: every problem gets
written-up notes rather than a code dump, because the point is recognizing
patterns and being able to explain why a solution works. It is early.

## How it works

Problems are grouped into a folder per month, and each gets its own
`<number>-<Problem-Title>` folder so they sort by number. The README fixes what
goes inside: the problem statement with its examples and constraints, a solution
file covering approach and complexity, a `reflection.md` for how I actually
attacked it and where I got stuck, and the source attempt beside them.

One problem is archived so far — LeetCode 2904, "Shortest and Lexicographically
Smallest Beautiful String": given a binary string and a `k`, return the shortest
substring holding exactly `k` ones, breaking ties lexicographically. Its solution
file is the LeetCode editorial, attributed as such in the file, and records an
O(n^3) enumeration and an O(n^2) sliding window. My own attempt is kept apart:

```java
class Solution {
	public String shortestBeautifulSubstring(String s, int k) {
		int totalval = 0;

		// Checking if total lexiographical values minus zero add up to k.
		// Otherwise k will be unreachable if total lexiographical values minus 
		// zero can't reach k
		for (int i = 0; i < s.length(); i++) {
		totalval += s.charAt(i) - '0';
		}
		if (totalval < k) return "";
```
*My own in-progress attempt: if the whole string holds fewer than `k` ones, no
beautiful substring exists and there is nothing to scan for.*

That file is committed mid-write — the loop below the guard declares `left_idx`
but then reads `left`, the braces do not balance, and nothing is returned. The
matching `reflection.md` is still a bare heading, so the part of the convention I
most wanted to keep is the part I have not filled in.

## The C++ track

`cpp_practice/` landed in the most recent commit and is a curriculum I wrote for
myself rather than notes taken from one. Coming from Java, Python, and C, I framed
the goal as the three things C++ adds that the others do not: value semantics,
RAII, and the standard library as the default toolbox. The first exercise, a word
frequency counter, bans `new`, `delete`, `malloc`, raw arrays, and `printf` —
restrictions whose only purpose is to stop me writing C with classes. A running
"Gotchas" list tracks what my background gets wrong: silent copies, `map[key]`
inserting on a miss, `auto` stripping references and const, `const` propagating.

## Where it stands

Seven commits between 26 August and 14 September 2026. The C++ side is further
along on paper than on disk: the word frequency exercise has a full spec and an
empty directory, and what exists instead is seven short programs totalling about
106 lines — a greeter, a temperature converter, w3schools drills — covering
console I/O and nothing from the roadmap yet. Two are committed mid-statement.
The root README still says everything is written in Java, which stopped being
true when the C++ folder landed; correcting that and finishing 01 are next.
