const fs = require("fs");

// Directions: Up, Right, Down, Left
const directions = [
    [-1, 0], // Up
    [0, 1],  // Right
    [1, 0],  // Down
    [0, -1], // Left
];

function main() {
    let grid = [];

    // Read the grid input from file
    const filePath = "input.txt";
    try {
        const data = fs.readFileSync(filePath, "utf8");
        grid = data
            .trim()
            .split("\n")
            .map(line => line.trim());
    } catch (err) {
        console.error("Error: Unable to open input.txt");
        return;
    }

    // Find the starting position and direction of the guard
    const rows = grid.length;
    const cols = grid[0].length;
    let startX = -1,
        startY = -1,
        direction = -1;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === "^") direction = 0;
            else if (grid[i][j] === ">") direction = 1;
            else if (grid[i][j] === "v") direction = 2;
            else if (grid[i][j] === "<") direction = 3;

            if (direction !== -1) {
                startX = i;
                startY = j;
                break;
            }
        }
        if (direction !== -1) break;
    }

    // Track visited positions
    const visited = new Set();
    let x = startX,
        y = startY;
    visited.add(`${x},${y}`);

    while (true) {
        const nextX = x + directions[direction][0];
        const nextY = y + directions[direction][1];

        // Check if the guard is about to leave the grid
        if (nextX < 0 || nextX >= rows || nextY < 0 || nextY >= cols) {
            break;
        }

        // Check for an obstacle
        if (grid[nextX][nextY] === "#") {
            direction = (direction + 1) % 4; // Turn right
        } else {
            x = nextX;
            y = nextY;
            visited.add(`${x},${y}`); // Move forward
        }
    }

    // Output the number of distinct positions visited
    console.log("Distinct positions visited:", visited.size);
}

// Execute the main function
main();
