[repo link](https://github.com/Damilss/225-asgn2)

# CPE 225 — Assignment 2: CountOnes

> Count the set bits in a signed integer — written twice, in C and in RISC-V assembly.

A CPE 225 (Computer Organization) assignment: implement "CountOnes" — read a
signed integer and count how many of its bits are set to 1 — first in C, then
as a faithful translation into RISC-V assembly. The point is the translation:
seeing exactly what a simple C loop becomes at the instruction level.

```c
int main(void) {
    signed int userInput = 1;
    unsigned int tempInput;
    int counter;
    char cont = 'y';

    printf("\nWelcome to the CountOnes program.\n");
    while (cont != 'n') {
        counter = 0;
        printf("\nPlease enter a number: ");
        scanf(" %d", &userInput);
        tempInput = (unsigned int)userInput;

        while (tempInput != 0) {
            if ((tempInput & 1) == 1) {   // test the low bit
                counter++;
            }
            tempInput = tempInput >> 1;   // shift right
        }
        printf("The number of bits set is: %d\n", counter);
        printf("Continue (y/n)?: ");
        scanf(" %c", &cont);
    }
    return 0;
}
```

*Mask the low bit, shift right, repeat — the C version, before the RISC-V translation.*

## Tech stack

- C, RISC-V assembly (RARS simulator)

## Status

Archived — CPE 225 coursework.
