// ans : 1516281

const fs = require("fs");

// Read and process the input
const input = fs.readFileSync("input.txt", "utf-8").trim().split("\n\n");
const grid = input[0].split("\n").map(line => line.split(""));
const steps = input[1].replace(/\n/g, "");

const n = grid.length;

// Direction mappings
const directions = {
    "<": [0, -1],
    "v": [1, 0],
    ">": [0, 1],
    "^": [-1, 0]
};

// Find the starting position of "@"
let ci, cj;
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        if (grid[i][j] === "@") {
            ci = i;
            cj = j;
            break;
        }
    }
}

// Check if the position is within the grid
const inGrid = (i, j) => i >= 0 && i < n && j >= 0 && j < n;

// Move function
const move = dir => {
    const [di, dj] = dir;
    const newi = ci + di, newj = cj + dj;

    if (!inGrid(newi, newj)) return;

    let row = ci, col = cj;
    while (inGrid(row, col)) {
        row += di;
        col += dj;

        if (!inGrid(row, col)) break;

        if (grid[row][col] === "#") break;

        if (grid[row][col] === ".") {
            grid[row][col] = "O";
            grid[ci][cj] = ".";
            ci += di;
            cj += dj;
            grid[ci][cj] = "@";
            break;
        }
    }
};

// Execute the steps
for (const step of steps) {
    move(directions[step]);
}

// Calculate the answer
let ans = 0;
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        if (grid[i][j] === "O") {
            ans += 100 * i + j;
        }
    }
}

// Output the final grid and answer
console.log(grid.map(line => line.join("")).join("\n"));
console.log(ans);


