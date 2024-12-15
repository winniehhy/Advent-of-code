const fs = require('fs');

// Function to map antennas by their type
function createAntennaMap(grid) {
    const antennaMap = {};
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            const cell = grid[row][col];
            if (cell === '.') continue;
            if (!antennaMap[cell]) {
                antennaMap[cell] = [];
            }
            antennaMap[cell].push([row, col]);
        }
    }
    return antennaMap;
}

// Function to calculate the count of unique antinodes
function countUniqueAntinodes(grid, antennaMap) {
    const numRows = grid.length, numCols = grid[0].length;
    const antinodes = new Set();

    for (const type in antennaMap) {
        const positions = antennaMap[type];
        for (let pos1 of positions) {
            for (let pos2 of positions) {
                if (pos1[0] === pos2[0] && pos1[1] === pos2[1]) continue;

                const candidateAntinode = [
                    2 * pos2[0] - pos1[0],
                    2 * pos2[1] - pos1[1]
                ];

                if (
                    candidateAntinode[0] >= 0 && candidateAntinode[0] < numRows &&
                    candidateAntinode[1] >= 0 && candidateAntinode[1] < numCols
                ) {
                    antinodes.add(`${candidateAntinode[0]},${candidateAntinode[1]}`);
                }
            }
        }
    }

    return antinodes.size;
}

// Main function to process the input and compute the result
function processAntinodeCalculation() {
    const input = fs.readFileSync('./input.txt', 'utf-8');
    const grid = input.trim().split('\n').map(line => line.split(''));

    const antennaMap = createAntennaMap(grid);
    const totalAntinodes = countUniqueAntinodes(grid, antennaMap);

    console.log(totalAntinodes);
}

// Execute the main function
processAntinodeCalculation();
