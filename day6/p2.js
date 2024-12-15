const fs = require("fs");

// Directions: Up, Right, Down, Left
const STEP_DIRECTIONS = [
    [0, -1], // Up
    [1, 0],  // Right
    [0, 1],  // Down
    [-1, 0], // Left
];

// Locate the starting position of the guard (marked by '^')
function getStartingPosition(grid) {
    for (let j = 0; j < grid.length; j++) {
        for (let i = 0; i < grid[j].length; i++) {
            if (grid[j][i] === "^") {
                return [i, j];
            }
        }
    }
    return [-1, -1]; // Return invalid position if '^' is not found
}

// Check if placing an obstruction causes an infinite loop
function isPathInfinite(startPos, obstructionPos, grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    let currentPos = [...startPos];
    let directionIdx = 0;
    const visitedPositions = new Set();

    while (true) {
        // Calculate the next position
        const nextPosX = currentPos[0] + STEP_DIRECTIONS[directionIdx][0];
        const nextPosY = currentPos[1] + STEP_DIRECTIONS[directionIdx][1];

        // If the next position is outside the grid, the path is not infinite
        if (nextPosX < 0 || nextPosX >= cols || nextPosY < 0 || nextPosY >= rows) {
            return false;
        }

        const cell = grid[nextPosY][nextPosX];

        // If the next position is an obstruction or '#', turn right
        if ((nextPosX === obstructionPos[0] && nextPosY === obstructionPos[1]) || cell === "#") {
            directionIdx = (directionIdx + 1) % 4;
        } else if (cell === "." || cell === "^") {
            // Move forward
            currentPos = [nextPosX, nextPosY];
            const state = `${currentPos[0]},${currentPos[1]},${directionIdx}`;
            if (visitedPositions.has(state)) {
                return true; // Infinite loop detected
            }
            visitedPositions.add(state);
        }
    }
}

// Compute all distinct positions the guard can visit
function getDistinctPositionsSet(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const distinctPositions = new Set();
    const startPos = getStartingPosition(grid);
    let currentPos = [...startPos];
    let directionIdx = 0;

    while (true) {
        // Calculate the next position
        const nextPosX = currentPos[0] + STEP_DIRECTIONS[directionIdx][0];
        const nextPosY = currentPos[1] + STEP_DIRECTIONS[directionIdx][1];

        // If the next position is outside the grid, stop
        if (nextPosX < 0 || nextPosX >= cols || nextPosY < 0 || nextPosY >= rows) {
            break;
        }

        const cell = grid[nextPosY][nextPosX];
        if (cell === "." || cell === "^") {
            distinctPositions.add(`${nextPosX},${nextPosY}`);
            currentPos = [nextPosX, nextPosY];
        } else if (cell === "#") {
            directionIdx = (directionIdx + 1) % 4;
        }
    }

    return distinctPositions;
}

// Calculate positions where placing an obstruction causes an infinite loop
function getDistinctObstructionPositions(distinctPositions, grid) {
    const startPos = getStartingPosition(grid);
    const filteredPositions = Array.from(distinctPositions).filter(
        pos => pos !== `${startPos[0]},${startPos[1]}`
    );

    let infinitePaths = 0;
    for (const position of filteredPositions) {
        const [x, y] = position.split(",").map(Number);
        if (isPathInfinite(startPos, [x, y], grid)) {
            infinitePaths++;
        }
    }

    return infinitePaths;
}

// Main function
function main() {
    const filePath = "input.txt";
    try {
        const data = fs.readFileSync(filePath, "utf8");
        const grid = data.split("\n").map(line => line.trim());

        // Compute distinct positions the guard can visit
        const distinctPositions = getDistinctPositionsSet(grid);

        // Calculate the number of obstruction positions that cause an infinite loop
        const distinctObstructionPositions = getDistinctObstructionPositions(distinctPositions, grid);
        console.log(distinctObstructionPositions);
    } catch (err) {
        console.error("Error: Unable to open input.txt");
    }
}

// Execute the main function
main();
