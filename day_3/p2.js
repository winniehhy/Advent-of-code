const fs = require("fs");

// Function to solve the corrupted memory
function solveCorruptedMemory(memory) {
    // Regex patterns for mul(), do(), and don't() instructions
    const mulPattern = /mul\((\d+),(\d+)\)/g;
    const doPattern = /do\(\)/g;
    const dontPattern = /don'?t\(\)/g;

    // Track multiplication state
    let mulEnabled = true;
    const results = [];

    // Find all instructions in order
    const mulMatches = [...memory.matchAll(mulPattern)].map(m => ({
        position: m.index,
        type: "mul",
        values: [parseInt(m[1], 10), parseInt(m[2], 10)],
    }));
    const doMatches = [...memory.matchAll(doPattern)].map(m => ({
        position: m.index,
        type: "do",
    }));
    const dontMatches = [...memory.matchAll(dontPattern)].map(m => ({
        position: m.index,
        type: "dont",
    }));

    // Combine and sort all matches by their position
    const allMatches = [...mulMatches, ...doMatches, ...dontMatches].sort(
        (a, b) => a.position - b.position
    );

    // Process instructions in order
    allMatches.forEach(match => {
        if (match.type === "do") {
            mulEnabled = true;
        } else if (match.type === "dont") {
            mulEnabled = false;
        } else if (match.type === "mul" && mulEnabled) {
            results.push(match.values[0] * match.values[1]);
        }
    });

    // Sum all enabled multiplication results
    const totalSum = results.reduce((sum, val) => sum + val, 0);

    return { totalSum, results };
}

// Read the input file
const filePath = "input_puzzle.txt";
try {
    const corruptedMemory = fs.readFileSync(filePath, "utf8");

    // Solve the puzzle
    const { totalSum, results } = solveCorruptedMemory(corruptedMemory);

    console.log(`Total sum of enabled multiplications: ${totalSum}`);
    console.log(`Number of enabled mul() instructions: ${results.length}`);
    console.log(`Individual multiplication results: ${results}`);
} catch (err) {
    console.error(`Error reading file: ${err.message}`);
}
