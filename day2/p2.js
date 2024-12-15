const fs = require("fs");

// Function to check if a report is safe
function isSafe(levels) {
    let increasing = true, decreasing = true;

    for (let i = 1; i < levels.length; i++) {
        const diff = levels[i] - levels[i - 1];

        // Rule 1: Adjacent differences must be between -3 and +3
        if (diff < -3 || diff > 3) {
            return false;
        }

        // Rule 2: Determine if the sequence is consistently increasing or decreasing
        if (diff > 0) {
            decreasing = false;
        } else if (diff < 0) {
            increasing = false;
        } else {
            // Rule 3: No plateaus allowed
            return false;
        }
    }

    // A report is safe if it is strictly increasing or strictly decreasing
    return increasing || decreasing;
}

// Function to check if a report is safe with the Problem Dampener
function isSafeWithDampener(levels) {
    // Check if the report is already safe
    if (isSafe(levels)) {
        return true;
    }

    // Try removing each level one by one
    for (let i = 0; i < levels.length; i++) {
        const modifiedLevels = levels.filter((_, index) => index !== i);
        
        // Check if the modified report is safe
        if (isSafe(modifiedLevels)) {
            return true;
        }
    }

    return false;
}

// Main function to process reports with the Problem Dampener
function processReports(filePath) {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        const lines = data.trim().split("\n");

        let safeCount = 0;
        let totalReports = 0;

        console.log("Processing reports with the Problem Dampener...");

        lines.forEach((line, index) => {
            const levels = line.split(" ").map(Number);

            // Check if the report is safe with the Problem Dampener
            if (levels.length > 0 && isSafeWithDampener(levels)) {
                console.log(`Report ${index + 1} is SAFE.`);
                safeCount++;
            } else {
                console.log(`Report ${index + 1} is UNSAFE.`);
            }

            totalReports++;
        });

        // Print the results
        console.log(`Total reports: ${totalReports}, Safe reports with Problem Dampener: ${safeCount}`);
    } catch (err) {
        console.error(`Error reading file: ${err.message}`);
    }
}

// Replace 'input_puzzle.txt' with the path to your input file
processReports("input_puzzle.txt");
