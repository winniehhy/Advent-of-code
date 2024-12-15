const fs = require("fs");

// Define directions for checking X-MAS patterns
function getDirections() {
    return {
        UL: [-1, -1],
        UR: [1, -1],
        DL: [-1, 1],
        DR: [1, 1],
    };
}

// Check if the position (i, j) is valid within the array boundaries
function isValidPosition(arr, i, j) {
    return i >= 0 && i < arr.length && j >= 0 && j < arr[0].length;
}

// Check if the cell in the given direction matches the expected letter
function checkDirection(arr, i, j, direction, letter, directions) {
    const [dx, dy] = directions[direction];
    const ni = i + dy;
    const nj = j + dx;
    if (!isValidPosition(arr, ni, nj)) {
        return false;
    }
    return arr[ni][nj] === letter;
}

// Check for X-MAS patterns centered at (i, j)
function findXmas(arr, i, j) {
    if (arr[i][j] !== "A") {
        return 0; // Start check only for "A"
    }

    const directions = getDirections();

    // Check for the four directional pairings forming the XMAS pattern
    const ulDrMatch =
        (checkDirection(arr, i, j, "UL", "M", directions) &&
            checkDirection(arr, i, j, "DR", "S", directions)) ||
        (checkDirection(arr, i, j, "UL", "S", directions) &&
            checkDirection(arr, i, j, "DR", "M", directions));

    const urDlMatch =
        (checkDirection(arr, i, j, "UR", "M", directions) &&
            checkDirection(arr, i, j, "DL", "S", directions)) ||
        (checkDirection(arr, i, j, "UR", "S", directions) &&
            checkDirection(arr, i, j, "DL", "M", directions));

    // Return 1 if both matches are found
    return ulDrMatch && urDlMatch ? 1 : 0;
}

// Count all X-MAS patterns in the array
function countXmasPatterns(arr) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
            count += findXmas(arr, i, j);
        }
    }
    return count;
}

// Main execution function
function main() {
    const filePath = "input.txt";
    try {
        const fileData = fs.readFileSync(filePath, "utf8");
        const array = fileData.trim().split("\n").map(line => line.split(""));

        const totalXmas = countXmasPatterns(array);
        console.log("Total X-MAS patterns:", totalXmas);
    } catch (err) {
        console.error(`Error reading file: ${err.message}`);
    }
}

// Execute the main function
main();
