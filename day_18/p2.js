const fs = require('fs');

const size = 70;
const coords = fs.readFileSync('input.txt', 'utf-8').split('\n')
    .map(line => line.split(',').map(Number));

function connected(bytes) {
    const grid = Array.from({ length: size + 1 }, () => Array(size + 1).fill(0));

    // Populate the grid with the coordinates
    coords.slice(0, bytes).forEach(([c, r]) => {
        grid[r][c] = 1;
    });

    const queue = [[0, 0]]; // Start with (0, 0)
    const seen = new Set();
    seen.add('0,0'); // Mark the starting point as visited

    while (queue.length > 0) {
        const [r, c] = queue.shift(); // Dequeue the first element

        const directions = [
            [r + 1, c], [r, c + 1], [r - 1, c], [r, c - 1]
        ];

        for (const [nr, nc] of directions) {
            if (nr < 0 || nc < 0 || nr > size || nc > size) continue;
            if (grid[nr][nc] === 1) continue; // Skip blocked cells

            const key = `${nr},${nc}`;
            if (seen.has(key)) continue; // Skip already visited cells

            if (nr === nc && nr === size) {
                return true; // Return true if we reach the target
            }

            seen.add(key); // Mark as visited
            queue.push([nr, nc]); // Enqueue the new position
        }
    }

    return false; // Return false if no connection is found
}

let low = 0;
let high = coords.length - 1;

while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (connected(mid + 1)) {
        low = mid + 1;
    } else {
        high = mid;
    }
}

console.log(coords[low]);
