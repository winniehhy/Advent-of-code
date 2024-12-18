// Function to calculate the score of a trail starting from a given cell (r, c)
function score_of_trail(grid, r, c) {
    const rows = grid.length;
    const cols = grid[0].length;
    const queue = [[r, c]];
    const visited = new Set();
    visited.add(`${r},${c}`);
    let trailEnds = 0;

    while (queue.length > 0) {
        const [cr, cc] = queue.shift();

        const directions = [
            [cr - 1, cc], // up
            [cr, cc + 1], // right
            [cr + 1, cc], // down
            [cr, cc - 1]  // left
        ];

        for (const [nr, nc] of directions) {
            if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
            if (grid[nr][nc] !== grid[cr][cc] + 1) continue;
            if (visited.has(`${nr},${nc}`)) continue;

            visited.add(`${nr},${nc}`);

            if (grid[nr][nc] === 9) {
                trailEnds++;
            } else {
                queue.push([nr, nc]);
            }
        }
    }

    return trailEnds;
}

// Main function to read input, find trailheads, and calculate the total score
function main() {
    const fs = require("fs");
    const input = fs.readFileSync("input.txt", "utf8");
    const grid = input.trim().split("\n").map(line => line.split("").map(Number));
    const rows = grid.length;
    const cols = grid[0].length;

    // Find all trailheads (cells with value 0)
    const trailheads = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 0) {
                trailheads.push([r, c]);
            }
        }
    }

    // Calculate the total score by summing the scores of all trails starting from trailheads
    const totalScore = trailheads.reduce((sum, [r, c]) => sum + score_of_trail(grid, r, c), 0);
    console.log(totalScore);
}

main();