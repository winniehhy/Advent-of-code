const fs = require("fs");

// Constants
const MAX_ENTRIES = 100000;
const MAX_VALUE = 100000;

// Main Function
function processFile(filename) {
    try {
        console.log("Reading input file...");

        // Read and parse file content
        const data = fs.readFileSync(filename, "utf8").trim();
        const lines = data.split("\n");

        // Initialize arrays
        const left = [];
        const right = [];
        let maxLeft = 0,
            maxRight = 0;

        // Parse lines into left and right arrays
        for (const line of lines) {
            const [leftNum, rightNum] = line.split(/\s+/).map(Number);

            // Check for value range
            if (leftNum > MAX_VALUE || rightNum > MAX_VALUE) {
                console.error(`ERROR: Value out of range - Left: ${leftNum}, Right: ${rightNum}`);
                return;
            }

            left.push(leftNum);
            right.push(rightNum);

            maxLeft = Math.max(maxLeft, leftNum);
            maxRight = Math.max(maxRight, rightNum);

            // Limit entries to prevent overflow
            if (left.length >= MAX_ENTRIES || right.length >= MAX_ENTRIES) {
                console.warn("WARNING: Reached maximum number of entries");
                break;
            }
        }

        console.log(`Read ${left.length} entries`);
        console.log(`Max left value: ${maxLeft}`);
        console.log(`Max right value: ${maxRight}`);

        // Count occurrences in the `right` list
        console.log("Counting occurrences...");
        const rightCounts = new Array(maxRight + 1).fill(0);
        for (const num of right) {
            rightCounts[num]++;
        }

        // Debug: Print first few occurrence counts
        console.log("First 10 occurrence counts:");
        for (let i = 0; i < 10; i++) {
            if (rightCounts[i] > 0) {
                console.log(`Number ${i}: ${rightCounts[i]} occurrences`);
            }
        }

        // Calculate similarity score
        console.log("Calculating similarity score...");
        let similarityScore = 0n; // Use BigInt for large numbers
        for (let i = 0; i < left.length; i++) {
            const leftNum = left[i];
            similarityScore += BigInt(leftNum) * BigInt(rightCounts[leftNum] || 0);

            // Optional: Periodic progress and overflow check
            if (i % 10000 === 0) {
                console.log(`Progress: ${i}/${left.length}. Current score: ${similarityScore}`);
            }
        }

        console.log(`Similarity Score: ${similarityScore}`);

    } catch (err) {
        console.error("Error reading or processing the file:", err);
    }
}

// Call the function with the input file
processFile("input_puzzle.txt");
