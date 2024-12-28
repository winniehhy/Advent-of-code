//ans : 1527969

const fs = require("fs");
const readline = require("readline");

// Read the input from file
const input = fs.readFileSync("input.txt", "utf-8").trim().split("\n\n");
const grid = input[0].split("\n").map(line => line.split(""));
const steps = input[1].replace(/\n/g, "");

// Constants and direction mapping
const n = grid.length;
const dirs = {
    "<": [0, -1],
    "v": [1, 0],
    ">": [0, 1],
    "^": [-1, 0]
};

// Initialize the positions of the robot, boxes, and walls
let ci, cj;
const boxes = [];
const walls = [];

for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        if (grid[i][j] === "@") {
            ci = i;
            cj = j * 2;  // Since grid has been modified to have twice the width
        } else if (grid[i][j] === "O") {
            boxes.push([i, j * 2]);
        } else if (grid[i][j] === "#") {
            walls.push([i, j * 2]);
            walls.push([i, j * 2 + 1]);  // Mark the walls as two separate elements for the grid.
        }
    }
}

// Function to check if a position is within grid bounds
const inGrid = (i, j) => (i >= 0 && i < n) && (j >= 0 && j < 2 * n);

// Function to perform a move
const move = (dir) => {
    const [di, dj] = dir;
    const newi = ci + di, newj = cj + dj;

    if (!inGrid(newi, newj)) return;

    // If new position is a wall, do nothing
    if (walls.some(wall => wall[0] === newi && wall[1] === newj)) return;

    // Stack to track boxes that need to be moved
    const stack = [];
    if (boxes.some(box => box[0] === newi && box[1] === newj)) {
        stack.push([newi, newj]);
    }
    if (boxes.some(box => box[0] === newi && box[1] === newj - 1)) {
        stack.push([newi, newj - 1]);
    }

    // Check if the boxes can move
    let canMove = true;
    const seen = new Set();

    while (stack.length > 0) {
        const [topi, topj] = stack.pop();
        const ni = topi + di, nj = topj + dj;

        if (!inGrid(ni, nj) || walls.some(wall => wall[0] === ni && wall[1] === nj || wall[0] === ni && wall[1] === nj + 1)) {
            canMove = false;
            break;
        }

        if (seen.has(`${topi},${topj}`)) continue;
        seen.add(`${topi},${topj}`);

        if (boxes.some(box => box[0] === ni && box[1] === nj)) {
            stack.push([ni, nj]);
        }
        if (boxes.some(box => box[0] === ni && box[1] === nj - 1)) {
            stack.push([ni, nj - 1]);
        }
        if (boxes.some(box => box[0] === ni && box[1] === nj + 1)) {
            stack.push([ni, nj + 1]);
        }
    }

    if (!canMove) return;

    // Move the boxes and the robot
    for (let i = 0; i < boxes.length; i++) {
        if (seen.has(`${boxes[i][0]},${boxes[i][1]}`)) {
            boxes[i][0] += di;
            boxes[i][1] += dj;
        }
    }

    ci += di;
    cj += dj;
};

// Function to print the current state of the grid
const printGrid = () => {
    let result = "";
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n * 2; j++) {
            if (walls.some(wall => wall[0] === i && wall[1] === j)) {
                result += "#";
            } else if (boxes.some(box => box[0] === i && box[1] === j)) {
                result += "[";
            } else if (boxes.some(box => box[0] === i && box[1] === j - 1)) {
                result += "]";
            } else if (i === ci && j === cj) {
                result += "@";
            } else {
                result += ".";
            }
        }
        result += "\n";
    }
    console.log(result);
};

// Process each step
for (const step of steps) {
    move(dirs[step]);
}

// Calculate the final answer
let ans = 0;
for (const [i, j] of boxes) {
    ans += i * 100 + j;
}

// Print the final grid and the result
printGrid();
console.log(ans);
