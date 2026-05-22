[repo link](https://github.com/Damilss/225-asgn2)

# CPE 225 - Assignment 2: CountOnes in C and RISC-V Assembly

This project involves implementing a "CountOnes" program, which takes a signed integer from the user and counts the number of bits set to 1 in its binary representation. The project includes two versions: one written in C and another in RISC-V assembly language.

## Objectives

- To be able to compile and execute a C program in a Linux environment.
- To be able to translate a simple C program into RISC-V assembly.

## Description

This is a programming exercise to familiarize students with programming in C and RISC-V assembly using `gcc` and the RARS simulator.

---

## Part 1: C Implementation (`countones.c`)

This implementation is a C program that prompts the user for a signed integer, counts the number of set bits, and asks the user if they wish to continue.

### Requirements

- The program must take a signed integer as input.
- It must count the number of bits that are set to 1.
- The program should loop, prompting for new numbers, until the user enters 'n'.
- It must be compiled using `gcc` with the `-Wall`, `-std=c99` flags.

### Compilation and Execution

```bash
gcc -Wall -std=c99 asgn2/countones.c -o countones_c
./countones_c
```

---

## Part 2: RISC-V Assembly Implementation (`countones.asm`)

This is a translation of the C program into RISC-V assembly language, intended to be run in the RARS (RISC-V Assembler and Runtime Simulator).

### Requirements

- The program must be named `countones.asm`.
- The program flow and output must match the C version and the provided examples exactly.
- **Program Start:** Display the message: `Welcome to the CountOnes Program.`
- **Input:** Prompt the user with: `Please enter a number: `
- **Output:** Display the result as: `The number of bits set is: X`
- **Continue Prompt:** Ask the user: `Continue (y/n)?: `
- **Exit:** If the user enters 'n', display `Exiting` and terminate.
- The program must handle 32-bit signed integers.
- No subroutines (JAL/JALR) should be used.
- The `ecall` arguments for `sbrk` (9) and `exit` (10) are permitted.
- The use of a data segment for strings is allowed.
- The program must not rely on any specific initial state of the registers.

### Execution

1.  Open the RARS simulator.
2.  Load the `asgn2/countones.asm` file.
3.  Assemble the code.
4.  Run the simulation.

### Example Output

```
Please enter a number: 15
The number of bits set is: 4
Continue (y/n)?: y

Please enter a number: -1
The number of bits set is: 32
Continue (y/n)?: y

Please enter a number: 123456789
The number of bits set is: 16
Continue (y/n)?: n
Exiting
```
