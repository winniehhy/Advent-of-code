const fs = require("fs");

// Function to extract and evaluate valid mul() instructions
function extractValidMulInstructions(memory) {
    const mulPattern = /mul\((\d+),(\d+)\)/g; // Regex to match mul() instructions
    let match;
    const results = [];

    // Iterate through all matches
    while ((match = mulPattern.exec(memory)) !== null) {
        const x = parseInt(match[1], 10);
        const y = parseInt(match[2], 10);
        results.push(x * y);
    }

    return results;
}

// Function to solve the corrupted memory
function solveCorruptedMemory(memory) {
    // Extract and multiply results
    const mulResults = extractValidMulInstructions(memory);

    // Calculate the total sum
    const totalSum = mulResults.reduce((sum, val) => sum + val, 0);

    return { totalSum, mulResults };
}

// Read the input file
const filePath = "input_puzzle.txt";
try {
    const corruptedMemory = fs.readFileSync(filePath, "utf8");

    // Solve the puzzle
    const { totalSum, mulResults } = solveCorruptedMemory(corruptedMemory);

    console.log(`Total sum of multiplications: ${totalSum}`);
    console.log(`Number of valid mul() instructions: ${mulResults.length}`);
} catch (err) {
    console.error(`Error reading file: ${err.message}`);
}
