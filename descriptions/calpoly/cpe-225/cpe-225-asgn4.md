---
title: "CPE 225 — Assignment 4: String Routines"
summary: "RISC-V assembly string routines for the RARS simulator: a syscall wrapper library, a null-terminating readstring, and strlen; strcmp was left unfinished."
period: "May 2026"
status: paused
tags: [RISC-V Assembly, RARS]
---

Assignment 4 of Cal Poly's CPE 225 writes string handling directly in RISC-V
assembly for the RARS simulator. `strlen` and `strcmp` reimplement their C
standard-library counterparts; `readstring` is a console routine that fills a
buffer from the keyboard. Each is written against a prototype kept as a comment
above the routine rather than translated from C source — the folder holds no C
code. I stopped partway through, so this page describes what exists.

## How it works

The foundation is `ecalls.asm`, a small library that turns RARS system calls
into ordinary subroutines: each wrapper loads a service number into `a7` and
issues `ecall`, so a test program can `jal printstring` or `jal readchar`
without knowing the syscall table.

`readstring` takes a buffer address in `a0`, spills `ra` and `s0` into two
fixed `.data` words (`readstring_ra`, `readstring_s0`) instead of the stack,
then calls `readchar` in a loop until it sees `'\n'` (10) or `'\r'` (13). Each
byte is stored with `sb`, and on exit it writes a trailing null so the buffer
meets the `.asciz` contract before restoring `ra` and `s0`.

```asm
readstring_loop:
	jal readchar
	
	li t0, 10 			# t0 = '\n'
	beq a0, t0, readstring_end	# if the char read is equal to '\n', end loop.
	
	li t0, 13 			# t0 = '\r'
	beq a0, t0, readstring_end	# if the char read is equal to '\r', end loop.
	
	sb a0, 0(s0)			# save char to readstring_s0, where we are storing the char
	addi a0, a0, 1			# PC + 1, since char is 1 byte we only move up one memory address
	
	b readstring_loop
```
*The readstring loop: read one byte, stop on Enter, store it, repeat.*

`strings.asm` implements `strlen` as a byte-load loop that copies the argument
address into `t0` and accumulates the count directly in the return register
`a0`. A companion harness, `readtest.asm`, preloads every `s`, `t`, and `a`
register with `-1` before calling `readstring`, then runs a `calleesavecheck`
that reports any of `s0`–`s11` that came back changed.

## Where it stands

This assignment was not finished. `strcmp` in `strings.asm` is a labeled
skeleton: it copies both argument pointers, has an `li a0,` with no operand,
and begins a byte-load loop whose comparison was never written.
`stringarrays.asm` is a two-line comment header with no instructions. The
`readstring` loop also advances `a0` (the character just read) instead of `s0`
(the buffer pointer), so as written every byte lands at the same address. The
code exists only in a local, uncommitted folder; the two GitHub repos I made
for it, `225-asgn4` and `cpe225-asgn4`, hold nothing but a README — and, in one
case, a licence — with no source.
