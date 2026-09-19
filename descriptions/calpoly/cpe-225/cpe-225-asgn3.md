---
title: "CPE 225 — Assignment 3: Calculator"
summary: A nine-operation integer calculator written in C, then translated by hand into RISC-V assembly with named wrapper routines around ecall.
period: "Apr 2026"
status: archived
tags: [RISC-V Assembly, C, Git]
repo: https://github.com/Damilss/225-asgn3
---

A CPE 225 assignment: write an interactive integer calculator in C, then translate it by
hand into RISC-V assembly. The program prints a menu of nine operations (add, subtract,
multiply, divide, AND, OR, XOR, left shift, right shift), reads two integers and an
operation code, prints the result, keeps a running count of operations, and loops until the
user answers `n` at a continue prompt.

## How it works

The C side is three files. `calculator.c` holds `main` — the welcome banner, the menu, the
`while (cont != 'n')` loop, the if/else chain over the operation code, and the operation
counter — while `operations.h` declares the nine one-line functions and `operations.c`
implements them. The one type subtlety is `unsigned int rshiftnums(unsigned int, int)`:
right shift is logical, everything else is signed `int`.

The assembly side is split the same way and stitched together with `.include "ecalls.asm"`
and `.include "operations.asm"` at the top of `calculator.asm`. `main` keeps its state in
callee-saved registers (`s0` for the count, `s1`–`s3` for the two inputs and the opcode,
`s4` for the result) and dispatches with a flat `li t0, N` / `beq s3, t0, do_*` chain; an
unmatched code prints `Invalid Operations` and branches straight to the continue prompt,
skipping the result print. Every routine in `operations.asm` is a leaf: arguments in
`a0`/`a1`, one instruction (`add`, `sub`, `mul`, `div`, `and`, `or`, `xor`, `sll`, `srl`),
result in `a0`, return with `jalr zero, ra, 0`. `sll` versus `srl` is where the header's
signed/unsigned distinction survives the translation.

`ecalls.asm` is a small wrapper library so `calculator.asm` never touches a syscall number
directly: `printstring`, `printint`, `printchar`, `readint`, `readchar`, `printdouble`, and
`exit0` each load `a7` and `ecall`. `readchar` is the only one with logic of its own — it
re-reads whenever the byte it got is `'\n'`, so a stray newline is never taken as the y/n
answer.

```asm
readchar:
	# receives no arguments and returns the the readchar form the i/o terminal in a0
	readchar_loop:
    	li a7, 12          
    	ecall

    	li t0, '\n'
    	beq a0, t0, readchar_loop

    	jalr zero, ra, 0
```
*`readchar` in `ecalls.asm` — the loop that discards leftover newlines before returning a character.*

## Highlights

- Nine operations, each a single RISC-V instruction plus a `jalr zero, ra, 0` return in `operations.asm`.
- Three assembly units (`calculator.asm`, `operations.asm`, `ecalls.asm`) assembled as one program through `.include`.
- The repo also carries `ecalltest.asm`, a harness that fills every caller- and callee-saved register with `-1`, exercises the wrappers, then prints `callee save register check passes` or `callee save registers corrupted`.
- One drift between the two versions: the C loop increments `opcnt` on every pass, while the assembly increments `s0` only in `show_result`, so invalid selections are not counted.
- The repo was created on April 21, 2026 with only a licence and a README; the C reference and the first assembly drafts landed on `main` on April 23, and the finishing pass ran on a `finish-asgn3` branch on April 25 and came back through pull request #1.
