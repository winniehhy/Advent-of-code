const fs = require("fs");

// Read input file and parse
const input = fs.readFileSync("input.txt", "utf-8").trim().split("\n");

// Extract A, B, C from the first three lines of the input
const A = parseInt(input[0].split(" ")[2]);
const B = parseInt(input[1].split(" ")[2]);
const C = parseInt(input[2].split(" ")[2]);

// Extract the program (array of integers)
const program = input[4].split(" ")[1].split(",").map(Number);

/**
 * Function to execute the program with given A, B, and C
 * @param {number[]} program - The list of opcodes and operands
 * @param {number} A - Initial value for A
 * @param {number} B - Initial value for B
 * @param {number} C - Initial value for C
 * @returns {Generator<number>} - Yields results for opcode 5
 */
function* run(program, A, B, C) {
    let ptr = 0; // Program counter

    // Helper function to resolve the "combo" value
    const combo = () => {
        const x = program[ptr + 1];
        if (x <= 3) return x; // Literal values 0, 1, 2, 3
        if (x === 4) return A;
        if (x === 5) return B;
        if (x === 6) return C;
    };

    // Helper function to get literal value from the program
    const lit = () => program[ptr + 1];

    while (true) {
        if (ptr >= program.length) {
            return; // Exit when pointer goes out of bounds
        }

        const opcode = program[ptr]; // Current opcode

        // Debugging print statement (optional)
        // console.log(`ptr: ${ptr} (A: ${A}, B: ${B}, C: ${C}), opcode: ${opcode}, lit: ${lit()}, combo: ${combo()}`);

        switch (opcode) {
            case 0: // Divide A by 2^combo() and store in A
                A = Math.floor(A / Math.pow(2, combo()));
                break;

            case 1: // XOR B with literal and store in B
                B = B ^ lit();
                break;

            case 2: // Get combo() % 8 and store in B
                B = combo() % 8;
                break;

            case 3: // Conditional jump
                if (A !== 0) {
                    ptr = lit(); // Jump to address specified by literal
                    continue;
                } else {
                    ptr += 2; // Skip to the next instruction
                }
                break;

            case 4: // XOR B with C and store in B
                B = B ^ C;
                break;

            case 5: // Get combo() % 8 and yield the result
                yield combo() % 8;
                break;

            case 6: // Divide A by 2^combo() and store in B
                B = Math.floor(A / Math.pow(2, combo()));
                break;

            case 7: // Divide A by 2^combo() and store in C
                C = Math.floor(A / Math.pow(2, combo()));
                break;

            default: // Invalid opcode
                throw new Error(`Unknown opcode: ${opcode}`);
        }

        // Move to the next instruction (unless jumped)
        if (opcode !== 3) {
            ptr += 2;
        }
    }
}

// Run the program and collect results from opcode 5
const ans = run(program, A, B, C);
console.log([...ans].join(","));
