//ans : 94436

const fs = require("fs");

// Read and parse the input file
const grid = fs.readFileSync("input.txt", "utf8").trim().split("\n");

class PriorityQueue {
    constructor() {
        this.data = [];
    }

    // Add an element to the priority queue and sort by cost
    push(element) {
        this.data.push(element);
        this.data.sort((a, b) => a[0] - b[0]); // Sort by cost (first element)
    }

    // Remove and return the element with the smallest cost
    pop() {
        return this.data.shift(); // Pop the smallest element (min-heap behavior)
    }

    // Get the size of the priority queue
    size() {
        return this.data.length;
    }
}

const n = grid.length;
let start, end;

// Find the start (S) and end (E) positions in the grid
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        if (grid[i][j] === "S") {
            start = [i, j];
        } else if (grid[i][j] === "E") {
            end = [i, j];
        }
    }
}

const dd = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // Direction vectors: right, down, left, up
const q = new PriorityQueue();
q.push([0, 0, ...start]); // [cost, direction, i, j]

const seen = new Set();

// Dijkstra's algorithm loop
while (q.size() > 0) {
    const [cost, d, i, j] = q.pop();
    const state = `${d},${i},${j}`;

    if (seen.has(state)) continue;
    seen.add(state);

    if (grid[i][j] === "#") continue; // Skip walls

    if (grid[i][j] === "E") {
        console.log(cost); // Found the end, print the cost
        break;
    }

    const ii = i + dd[d][0];
    const jj = j + dd[d][1];

    const neighbors = [
        [cost + 1, d, ii, jj], // Move forward
        [cost + 1000, (d + 1) % 4, i, j], // Turn right
        [cost + 1000, (d + 3) % 4, i, j], // Turn left
    ];

    for (const nbr of neighbors) {
        const [nbrCost, nbrDir, nbrI, nbrJ] = nbr;
        const nbrState = `${nbrDir},${nbrI},${nbrJ}`;
        if (seen.has(nbrState)) continue;
        q.push(nbr);
    }
}