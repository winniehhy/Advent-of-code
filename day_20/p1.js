const fs = require('fs');

// Reading the grid from a file (equivalent to the Python file read operation)
const grid = fs.readFileSync("input.txt", "utf-8")
  .trim()
  .split("\n")
  .map(line => line.split(""));

// Get the grid dimensions
const N = grid.length;

// Helper function to check if a coordinate is within the grid
function inGrid(i, j) {
    return 0 <= i && i < N && 0 <= j && j < N;
}

// Variables to store the starting and ending positions
let si, sj, ei, ej;

// Find the start (S) and end (E) positions
for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
        if (grid[i][j] === "S") {
            si = i;
            sj = j;
        } else if (grid[i][j] === "E") {
            ei = i;
            ej = j;
        }
    }
}

// Direction vectors (right, down, up, left)
const dd = [[1, 0], [0, 1], [-1, 0], [0, -1]];

// Function to determine the original path
let path = [[si, sj]];
while (path[path.length - 1][0] !== ei || path[path.length - 1][1] !== ej) {
    const [i, j] = path[path.length - 1];
    for (let [di, dj] of dd) {
        const ii = i + di;
        const jj = j + dj;
        if (!inGrid(ii, jj)) continue;
        if (path.length > 1 && ii === path[path.length - 2][0] && jj === path[path.length - 2][1]) continue;
        if (grid[ii][jj] === "#") continue;
        
        path.push([ii, jj]);
        break;
    }
}

// Calculate original path length
const og = path.length - 1;

// Create a map for times
const times = {};
for (let t = 0; t < path.length; t++) {
    times[path[t]] = og - t;
}

// To keep track of the counts and saved times
const counts = new Map();
const saved = new Map();

// Iterate over the path and calculate saved values
for (let t = 0; t < path.length; t++) {
    const [i, j] = path[t];
    for (let [di1, dj1] of dd) {
        for (let [di2, dj2] of dd) {
            const ii = i + di1 + di2;
            const jj = j + dj1 + dj2;
            if (!inGrid(ii, jj) || grid[ii][jj] === "#") continue;

            const remT = times[[ii, jj]];
            saved.set(`${i},${j},${ii},${jj}`, og - (t + remT + 2));
        }
    }
}

// Calculate the answer based on saved times
let ans = 0;
saved.forEach(v => {
    if (v >= 0) {
        counts.set(v, (counts.get(v) || 0) + 1);
    }
    if (v >= 100) ans++;
});

console.log(ans);
