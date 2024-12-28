const fs = require("fs");

/**
 * Parses the input and calculates the cost based on machine data.
 * @param {string} input - The raw input string.
 * @returns {number} The total cost.
 */
function calculateCost(input) {
    const machines = input.split("\n\n");
    let cost = 0;

    machines.forEach(machine => {
        const numbers = machine.match(/\d+/g).map(Number);
        const [ax, ay, bx, by, px, py] = numbers;

        const aCount = (px * by - py * bx) / (ax * by - ay * bx);
        const bCount = (px - ax * aCount) / bx;

        if (Number.isInteger(aCount) && Number.isInteger(bCount)) {
            cost += aCount * 3 + bCount;
        }
    });

    return cost;
}

// Read input from the file and calculate the cost
const input = fs.readFileSync("input.txt", "utf8");
const totalCost = calculateCost(input);
console.log(totalCost);
