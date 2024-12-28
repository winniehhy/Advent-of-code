const fs = require('fs');

// Implementation of a simple Deque class since JS doesn't have one built-in
class Deque {
    constructor() {
        this.items = [];
    }

    append(item) {
        this.items.push(item);
    }

    popleft() {
        return this.items.shift();
    }

    get length() {
        return this.items.length;
    }
}

function findPath(size = 70, bytes = 1024) {
    // Read and parse input file
    const coords = fs.readFileSync('input.txt', 'utf8')
        .trim()
        .split('\n')
        .map(line => line.split(',').map(Number));

    // Create grid
    const grid = Array(size + 1).fill().map(() => Array(size + 1).fill(0));

    // Fill grid with coordinates
    const coordsToUse = coords.slice(0, bytes);
    for (const [c, r] of coordsToUse) {
        grid[r][c] = 1;
    }

    // Initialize queue and seen set
    const q = new Deque();
    q.append([0, 0, 0]); // [row, col, distance]
    const seen = new Set(['0,0']); // Using string representation for coordinates

    while (q.length > 0) {
        const [r, c, d] = q.popleft();

        for (const [nr, nc] of [
            [r + 1, c],
            [r, c + 1],
            [r - 1, c],
            [r, c - 1]
        ]) {
            if (nr < 0 || nc < 0 || nr > size || nc > size) {
                continue;
            }

            if (grid[nr][nc] === 1) {
                continue;
            }

            const coordKey = `${nr},${nc}`;
            if (seen.has(coordKey)) {
                continue;
            }

            if (nr === size && nc === size) {
                return d + 1;
            }

            seen.add(coordKey);
            q.append([nr, nc, d + 1]);
        }
    }

    return -1; // No path found
}

// Run the algorithm and print the result
const result = findPath();
console.log(result);