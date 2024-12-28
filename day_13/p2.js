const fs = require("fs");

/**
 * Calculate the total cost for the given machines data with corrected prize coordinates
 */
function calculateMinimumTokens() {
    let cost = 0;

    const input = fs.readFileSync("input.txt", "utf8");
    const machines = input.split("\n\n");

    for (let machine of machines) {
        const [ax, ay, bx, by, px, py] = machine.match(/\d+/g).map(Number);

        // Correct the prize coordinates by adding 10000000000000 to px and py
        const correctedPx = px + 10000000000000;
        const correctedPy = py + 10000000000000;

        // Calculate a_count and b_count using the corrected prize coordinates
        const a_count = (correctedPx * by - correctedPy * bx) / (ax * by - ay * bx);
        const b_count = (correctedPx - ax * a_count) / bx;

        // Ensure that both a_count and b_count are integers
        if (Number.isInteger(a_count) && Number.isInteger(b_count)) {
            cost += a_count * 3 + b_count;
        }
    }

    return cost;
}

console.log(calculateMinimumTokens());
