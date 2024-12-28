const fs = require("fs");

/**
 * Calculate the total expense based on the regions and their boundaries in the grid.
 * @param {string[][]} grid - The 2D grid of crops.
 * @returns {number} The computed total expense.
 */
const computeExpense = (grid) => {
    const rows = grid.length;
    const cols = grid[0].length;

    const cropRegions = [];
    const regionBoundaries = [];
    const visitedCells = new Set();

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cellKey = `${r},${c}`;
            if (visitedCells.has(cellKey)) continue;

            visitedCells.add(cellKey);
            let boundaryLength = 0;
            const currentRegion = new Set([cellKey]);
            const cellsQueue = [[r, c]];
            const cropType = grid[r][c];

            while (cellsQueue.length > 0) {
                const [currentRow, currentCol] = cellsQueue.shift();

                const adjacentCells = [
                    [currentRow + 1, currentCol],
                    [currentRow - 1, currentCol],
                    [currentRow, currentCol + 1],
                    [currentRow, currentCol - 1]
                ];

                for (const [neighborRow, neighborCol] of adjacentCells) {
                    if (
                        neighborRow < 0 || 
                        neighborCol < 0 || 
                        neighborRow >= rows || 
                        neighborCol >= cols
                    ) {
                        boundaryLength++;
                        continue;
                    }
                    if (grid[neighborRow][neighborCol] !== cropType) {
                        boundaryLength++;
                        continue;
                    }
                    const neighborKey = `${neighborRow},${neighborCol}`;
                    if (currentRegion.has(neighborKey)) continue;

                    currentRegion.add(neighborKey);
                    cellsQueue.push([neighborRow, neighborCol]);
                }
            }

            for (const cell of currentRegion) {
                visitedCells.add(cell);
            }

            cropRegions.push(currentRegion);
            regionBoundaries.push(boundaryLength);
        }
    }

    let totalExpense = 0;
    for (let i = 0; i < cropRegions.length; i++) {
        totalExpense += cropRegions[i].size * regionBoundaries[i];
    }

    return totalExpense;
};

// Read input from file and run the expense calculation
const runExpenseCalculator = () => {
    const grid = fs.readFileSync("input.txt", "utf-8")
        .trim()
        .split("\n")
        .map(line => line.split(""));
    
    const totalCost = computeExpense(grid);
    console.log(totalCost);
};

// Execute the program
runExpenseCalculator();
