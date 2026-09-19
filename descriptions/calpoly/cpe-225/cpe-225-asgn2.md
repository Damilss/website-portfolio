---
title: "CPE 225 Assignment 2: CountOnes"
summary: A set-bit counter for a signed 32-bit integer, written in C and then hand-translated to RISC-V assembly for the RARS simulator without subroutines.
period: "Apr 2026"
status: archived
tags: [C, RISC-V Assembly, RARS]
repo: https://github.com/Damilss/225-asgn2
---

A CPE 225 assignment: write "CountOnes", a program that reads a signed integer, reports how many of its bits are set to 1, and keeps prompting until the user answers `n`. I wrote it twice — first as a C program compiled with `gcc -Wall -std=c99`, then as a RISC-V assembly program for the RARS simulator that had to reproduce the C version's prompts and output exactly.

## How it works

The C version casts the signed input to `unsigned int` before the loop, so `>> 1` is a logical shift and the loop still reaches zero for negative inputs (`-1` reports 32 set bits). It masks the low bit with `& 1`, bumps a counter when that bit is set, shifts right, and stops once the value is zero.

The assembly version was written under the assignment's main constraint: no subroutines, so no `jal` or `jalr`. All control flow is labels and branches inside one `main`, and every register is loaded explicitly before it is read because the program could not rely on any initial register state. The prompt strings live in a `.data` segment, and all I/O goes through RARS ecall services: 4 to print a string, 5 to read an integer, 1 to print an integer, 12 to read a character, and 10 to exit.

The two programs give the same answers but loop differently. C stops as soon as the shifted value hits zero; the assembly walks all 32 bit positions in a counted loop, using `srli` so the sign bit is not replicated on the way down.

```asm
	li t3, 32		#32 is limit
	li t4, 0		#int i = 0: 	

forbody:
	bge t4, t3, forend
	andi t5, a0, 1		#storing result of first bit in t5
	
if:	beq t5, zero, endif
	addi a1, a1, 1
	
endif:
	srli t5, a0, 1 		#shift over one bit
	mv a0, t5		#set new shifted value to a0
	addi t4, t4, 1		#i++;
	b forbody 
```
*The bit-counting loop in RISC-V: mask the low bit, bump `a1` when it is set, logical-shift right, and repeat for all 32 positions.*

## Highlights

- No `jal` or `jalr` anywhere in the assembly; every loop and branch lives in the single `main` block.
- A `read_continue` loop re-issues the read-character ecall whenever it gets `'\n'`, so the newline left over from the integer read is not mistaken for the y/n answer.
- The C half counts in a data-dependent `while (tempInput != 0)` loop; the assembly half uses a fixed 32-iteration loop bounded by `li t3, 32`.
- The exit check compares the typed character against `'n'` preloaded into `t1`; anything else branches back to the `while` label for another number.
