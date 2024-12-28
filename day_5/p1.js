const fs = require("fs");

// Function to parse input from file
function parseInput(filename) {
    const rules = new Map();
    const updates = [];

    try {
        const data = fs.readFileSync(filename, "utf8");
        const lines = data.split("\n");

        let parsingRules = true;

        lines.forEach(line => {
            line = line.trim();
            if (!line) {
                parsingRules = false; // Switch to parsing updates
                return;
            }

            if (parsingRules) {
                // Parse rules (e.g., "X|Y")
                const [x, y] = line.split("|").map(Number);
                if (!rules.has(x)) {
                    rules.set(x, new Set());
                }
                rules.get(x).add(y);
            } else {
                // Parse updates (e.g., "75,47,61,53,29")
                const update = line.split(",").map(Number);
                updates.push(update);
            }
        });
    } catch (err) {
        console.error("Error reading file:", err.message);
    }

    return { rules, updates };
}

// Function to validate an update against rules
function isValidUpdate(update, rules) {
    const positions = new Map();

    // Map each page to its position in the update
    update.forEach((page, index) => {
        positions.set(page, index);
    });

    // Validate rules
    for (const [x, ys] of rules.entries()) {
        for (const y of ys) {
            // If both x and y are in the update, check their order
            if (positions.has(x) && positions.has(y)) {
                if (positions.get(x) > positions.get(y)) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Function to find the middle page of an update
function findMiddlePage(update) {
    const n = update.length;
    return update[Math.floor(n / 2)];
}

// Main function
function main() {
    const filename = "input_puzzle.txt";

    // Parse the input file
    const { rules, updates } = parseInput(filename);

    // Process each update
    let sumMiddlePages = 0;
    updates.forEach(update => {
        if (isValidUpdate(update, rules)) {
            sumMiddlePages += findMiddlePage(update);
        }
    });

    // Output the result
    console.log("Sum of middle pages:", sumMiddlePages);
}

// Execute the main function
main();
