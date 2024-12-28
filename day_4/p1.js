const fs = require("fs");

// Function to find occurrences of a word in the grid
function findWord(grid, word) {
    const rows = grid.length;
    const cols = grid[0].length;
    const wordLen = word.length;
    let count = 0;

    // Define directions for movement: (rowStep, colStep)
    const directions = [
        [0, 1],   // Right
        [1, 0],   // Down
        [1, 1],   // Down-right diagonal
        [1, -1],  // Down-left diagonal
        [0, -1],  // Left
        [-1, 0],  // Up
        [-1, -1], // Up-left diagonal
        [-1, 1]   // Up-right diagonal
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            for (const [dr, dc] of directions) {
                let match = true;
                for (let k = 0; k < wordLen; k++) {
                    const nr = r + k * dr;
                    const nc = c + k * dc;

                    if (
                        nr < 0 || nr >= rows ||
                        nc < 0 || nc >= cols ||
                        grid[nr][nc] !== word[k]
                    ) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    count++;
                }
            }
        }
    }

    return count;
}

// Read the input file
const filePath = "input.txt";
try {
    const fileData = fs.readFileSync(filePath, "utf8");
    const wordSearch = fileData.trim().split("\n").map(line => line.split(""));
    const wordToFind = "XMAS";

    // Count occurrences of the word
    const totalOccurrences = findWord(wordSearch, wordToFind);

    console.log(`Total occurrences of '${wordToFind}': ${totalOccurrences}`);
} catch (err) {
    console.error(`Error reading file: ${err.message}`);
}
