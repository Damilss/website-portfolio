[repo link](https://github.com/Damilss/225-asgn3)

# CPE 225 — Assignment 3: Calculator

> A small calculator — arithmetic and bitwise operations, in C and RISC-V assembly.

A CPE 225 assignment that builds on Assignment 2: a calculator that takes two
numbers and an operation code and runs it — add, subtract, multiply, divide,
plus the bitwise operations (AND, OR, XOR, left shift, right shift). Like the
others, it is written in C and then translated into RISC-V assembly.

```c
int main() {
    int num1, num2, op, result;
    char cont = 'y';

    printf("Operations - 1:add 2:subtract 3:multiply 4:divide "
           "5:and 6:or 7:xor 8:lshift 9:rshift\n");

    while (cont != 'n') {
        printf("\nEnter number: ");
        scanf("%d", &num1);
        printf("Enter second number: ");
        scanf("%d", &num2);
        printf("Select operation: ");
        scanf("%d", &op);

        if      (op == 1) result = addnums(num1, num2);
        else if (op == 2) result = subnums(num1, num2);
        else if (op == 5) result = andnums(num1, num2);
        // ...the rest of the operation table
        printf("Result: %d\n", result);
    }
    return 0;
}
```

*Each operation lives in its own function (`operations.h`); `main` is just the dispatch loop.*

## Tech stack

- C, RISC-V assembly (RARS simulator)

## Status

Archived — CPE 225 coursework.
