const fs = require("fs");

// Read the input file and split by double newlines
const input = fs.readFileSync("input.txt", "utf-8").trim().split("\n\n");

// Initialize wires object
let wires = {};

// Process the first part of the input
input[0].split("\n").forEach(line => {
    const [wire, value] = line.split(": ");
    wires[wire] = parseInt(value, 10);
});

console.log(wires);

// Process the second part of the input
while (true) {
    let good = true;
    input[1].split("\n").forEach(line => {
        const [w1, op, w2, , out] = line.split(" ");
        if (!(w1 in wires && w2 in wires)) {
            good = false;
            return;
        }

        if (op === "AND") {
            wires[out] = wires[w1] & wires[w2];
        } else if (op === "OR") {
            wires[out] = wires[w1] | wires[w2];
        } else if (op === "XOR") {
            wires[out] = wires[w1] ^ wires[w2];
        }
    });

    if (good) {
        break;
    }
}

// Get the wires that start with "z" and sort them
const values = Object.entries(wires)
    .filter(([key]) => key.startsWith("z"))
    .sort((a, b) => a[0].localeCompare(b[0]));

// Print the sorted values
console.log(values);

// Convert the binary values to a string and reverse it
const result = parseInt(values.map(([_, v]) => v).reverse().join(""), 2);
console.log(result);
