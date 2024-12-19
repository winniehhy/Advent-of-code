class Deque {
    constructor() {
        this.items = [];
    }

    // Add an element to the front of the deque
    unshift(element) {
        this.items.unshift(element);
    }

    // Add an element to the back of the deque
    push(element) {
        this.items.push(element);
    }

    // Remove and return an element from the front of the deque
    shift() {
        return this.items.shift();
    }

    // Remove and return an element from the back of the deque
    pop() {
        return this.items.pop();
    }

    // Get the number of elements in the deque
    get length() {
        return this.items.length;
    }
}

const fs = require("fs");

/**
 * Calculate the number of sides for a given region in the grid.
 * @param {Set<string>} region - Set of coordinates in the region.
 * @returns {number} The number of sides for the region.
 */
const findSides = (region) => {
    const edges = {};
    for (const cell of region) {
        const [r, c] = cell.split(",").map(Number);
        for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
            const neighborKey = `${nr},${nc}`;
            if (region.has(neighborKey)) continue;

            const er = (r + nr) / 2;
            const ec = (c + nc) / 2;
            edges[`${er},${ec}`] = [er - r, ec - c];
        }
    }

    const seen = new Set();
    let sideCount = 0;

    for (const edge in edges) {
        if (seen.has(edge)) continue;
        seen.add(edge);
        sideCount += 1;
        const [er, ec] = edge.split(",").map(Number);
        const direction = edges[edge];

        if (er % 1 === 0) {
            for (const dr of [-1, 1]) {
                let cr = er + dr;
                while (edges[`${cr},${ec}`] && edges[`${cr},${ec}`].toString() === direction.toString()) {
                    seen.add(`${cr},${ec}`);
                    cr += dr;
                }
            }
        } else {
            for (const dc of [-1, 1]) {
                let cc = ec + dc;
                while (edges[`${er},${cc}`] && edges[`${er},${cc}`].toString() === direction.toString()) {
                    seen.add(`${er},${cc}`);
                    cc += dc;
                }
            }
        }
    }

    return sideCount;
};

/**
 * Main function to calculate total cost from the grid.
 */
function main() {
    const input = fs.readFileSync("input.txt", "utf8");
    const grid = input.trim().split("\n").map(line => line.split(""));

    const rows = grid.length;
    const cols = grid[0].length;

    const regions = [];
    const seen = new Set();

    // Create a new instance of the custom Deque class
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cellKey = `${r},${c}`;
            if (seen.has(cellKey)) continue;

            seen.add(cellKey);
            const region = new Set([cellKey]);
            const q = new Deque();
            q.push([r, c]);  // Push the initial coordinates onto the deque
            const crop = grid[r][c];

            while (q.length > 0) {
                const [cr, cc] = q.shift();  // Shift the first element from the deque

                for (const [nr, nc] of [[cr + 1, cc], [cr - 1, cc], [cr, cc + 1], [cr, cc - 1]]) {
                    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
                    if (grid[nr][nc] !== crop) continue;

                    const neighborKey = `${nr},${nc}`;
                    if (seen.has(neighborKey)) continue;

                    seen.add(neighborKey);
                    region.add(neighborKey);
                    q.push([nr, nc]);  // Push the neighboring coordinates onto the deque
                }
            }

            regions.push(region);
        }
    }

    const totalCost = regions.reduce((sum, region) => sum + region.size * findSides(region), 0);
    console.log(totalCost);
}

main();
