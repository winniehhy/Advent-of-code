const fs = require("fs");

// Function to check if a report is safe
function isSafe(levels) {
    let increasing = true, decreasing = true;

    for (let i = 1; i < levels.length; i++) {
        const diff = levels[i] - levels[i - 1];

        console.log(`Checking levels[${i - 1}]: ${levels[i - 1]} -> levels[${i}]: ${levels[i]} | diff: ${diff}`);

        // Rule 1: Adjacent differences must be between -3 and +3
        if (diff < -3 || diff > 3) {
            console.log(`Unsafe: Difference ${diff} is out of range [-3, +3].`);
            return false;
        }

        // Rule 2: Determine if the sequence is consistently increasing or decreasing
        if (diff > 0) {
            decreasing = false;
        } else if (diff < 0) {
            increasing = false;
        } else {
            // Rule 3: No plateaus allowed
            console.log("Unsafe: Plateau detected (diff = 0).");
            return false;
        }
    }

    // The report is safe if it is strictly increasing or strictly decreasing
    console.log(`Report is increasing: ${increasing}, decreasing: ${decreasing}`);
    return increasing || decreasing;
}

// Main function to process reports
function processReports(filePath) {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        const lines = data.trim().split("\n");

        let safeCount = 0;
        let totalReports = 0;

        console.log("Processing reports...");

        lines.forEach((line, index) => {
            const levels = line.split(" ").map(Number);

            // Check if the report is safe
            if (levels.length > 0 && isSafe(levels)) {
                console.log(`Report ${index + 1} is SAFE.`);
                safeCount++;
            } else {
                console.log(`Report ${index + 1} is UNSAFE.`);
            }

            totalReports++;
        });

        // Print the results
        console.log(`Total reports: ${totalReports}, Safe reports: ${safeCount}`);
    } catch (err) {
        console.error(`Error reading file: ${err.message}`);
    }
}

// Replace 'input_puzzle.txt' with the path to your input file
processReports("input_puzzle.txt");
