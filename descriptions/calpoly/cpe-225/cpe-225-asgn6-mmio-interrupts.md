---
title: "CPE 225 — MMIO and Interrupts"
summary: Hand-written RISC-V memory-mapped I/O routines and a keyboard interrupt handler for the RARS display and keyboard device, built in four phases.
period: "Jun 2026"
status: archived
tags: [RISC-V Assembly, RARS, Embedded]
repo: https://github.com/Damilss/225-MMIO-interrupts
featured: 5
---

Assignment 6 for CPE 225 takes away the RARS system calls that normally handle input and
output and replaces them with routines I wrote directly against the simulator's
"MMIO Display and Keyboard" device. It builds up in four phases: a set of
memory-mapped I/O routines, a small test program that uses them, an interrupt service
routine that reacts to key presses, and a final step that repurposes the handler's return
path to restart the program. Everything is RISC-V assembly run in RARS; the only `ecall`
left in my three files is the exit at the very end.

## How it works

Phase 1 is `MMIO.asm`: `printChar`, `readchar`, `printstring`, `readstring`, `printint`,
`readint`, and `exit0`, each talking to the device registers instead of the OS. The device
sits at four addresses: receiver control at `0xFFFF0000`, receiver data at `0xFFFF0004`,
transmitter control at `0xFFFF0008`, and transmitter data at `0xFFFF000C`. `printChar` spins
on bit 0 of the transmitter control register until the display is ready, then stores the byte
to transmitter data; `readchar` is the mirror image on the receiver side. `printstring` and
`readstring` are loops over those two, with `readstring` stopping at a newline (`0x0A`) and
writing a null terminator in place. `printint` and `readint` handle a single digit by adding
or subtracting 48.

Phase 2 is `testint.asm`, a `main` that calls `init` and then loops forever calling
`printChar` with `a0` set to `*`. Phase 3 is `isr.asm`. Its `init` routine does the four
things an interrupt needs: it writes the handler's address into `utvec`, sets bit 8 of `uie`
to enable the user external interrupt, writes `2` into the receiver control register so the
keyboard device raises an interrupt on each key, and sets bit 0 of `ustatus` as the global
enable. The `handler` opens a 32-byte stack frame, saves `ra`, `t0`–`t2`, `a0`, and `a1`,
reads the key with `readchar`, prints `Key Pressed: ` followed by the character, restores
`ra` and `t0`–`t2`, and returns with `uret`. It deliberately does not restore `a0`: the key is
left there, so when control returns to the `printChar` loop the program starts echoing
whatever was typed instead of asterisks.

Phase 4 keeps a press count in a `.data` word called `counter` rather than in a register,
because the handler gives its scratch registers back before `uret` and nothing held in one
would survive to the next interrupt. On the fifth press it zeroes the counter, loads the
address of `main`, and writes it into `uepc`. `uret` jumps to whatever `uepc` holds, so
instead of resuming the interrupted instruction the program restarts from the top, runs
`init` again, and goes back to printing `*`.

```asm
	la t0, counter
	lw t1, 0(t0)		# t1 is contents of counter
	
	addi t1, t1, 1		# Adding one to counter
	sw t1, 0(t0)
	
	li t2, 5
	bne t1, t2, skip_re
	
	sw zero, 0(t0)
	
	la t3, main
	csrw t3, uepc
```
*The handler's press counter: on the fifth key it resets the count and points `uepc` at `main`, so the `uret` that follows restarts the program instead of resuming it.*

## Highlights

- Every I/O routine polls a ready bit before touching data: bit 0 of the control register at `0xFFFF0008` for the display and `0xFFFF0000` for the keyboard, with the data register one word above each.
- `init` arms the interrupt in four writes: the handler address into `utvec`, `0x100` into `uie`, `2` into the receiver control register, and `0x1` into `ustatus`.
- The handler leaves the pressed key in `a0` on purpose, which is all it takes to switch the main loop from printing `*` to echoing the last key.
- `exit0` prints `-- program is finished running (0) --` through the MMIO display before the one remaining `ecall`, so the output matches what the assignment specified.
- The course-supplied `ecalltest.asm` harness loads `-1` into every caller-save register, runs each routine, and then checks that `s0`–`s11` are untouched; `printstring` and `readstring` save and restore their `s` registers around their loops so they pass it.
