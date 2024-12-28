//ans : 46362252142374

const fs = require('fs');

let known = {};

// Read the input file and parse the known wire values
const data = fs.readFileSync("input.txt", "utf-8");
const lines = data.split("\n");

// Parse known wire values
let i = 0;
while (lines[i].trim() !== "") {
    const [x, y] = lines[i].split(": ");
    known[x] = parseInt(y, 10);
    i++;
}

// Parse formulas
let formulas = {};
while (i < lines.length) {
    const [x, op, y, z] = lines[i].replace(" -> ", " ").split(" ");
    formulas[z] = [op, x, y];
    i++;
}

// Operators map
const operators = {
    "OR": (x, y) => x | y,
    "AND": (x, y) => x & y,
    "XOR": (x, y) => x ^ y
};

// Recursive function to calculate wire values
function calc(wire) {
    if (wire in known) {
        return known[wire];
    }
    const [op, x, y] = formulas[wire];
    known[wire] = operators[op](calc(x), calc(y));
    return known[wire];
}

// Collect values for z wires
let z = [];
let index = 0;
while (true) {
    let key = "z" + String(index).padStart(2, "0");
    if (!(key in formulas)) {
        break;
    }
    z.push(calc(key));
    index++;
}

// Convert to binary string and reverse, then print the result
let result = parseInt(z.reverse().join(""), 2);
console.log(result);
