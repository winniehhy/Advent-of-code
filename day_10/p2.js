const fs = require("fs");

function score_of_trail(grid, r, c, rows, cols) {
    const queue = [[r, c]];
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
            // Check if the next position is within bounds
            if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;

            // Check if the next cell's value is the current cell's value + 1
            if (grid[nr][nc] !== grid[cr][cc] + 1) continue;

            // If the next cell's value is 9, it is a trail end
            if (grid[nr][nc] === 9) {
                trailEnds++;
            } else {
                queue.push([nr, nc]);
            }
        }
    }

    return trailEnds;
}

function main() {
    // Read the input file
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

    // Compute the total score by summing up the scores from all trailheads
    const totalScore = trailheads.reduce((sum, [r, c]) => sum + score_of_trail(grid, r, c, rows, cols), 0);
    console.log(totalScore);
}

main();
