const fs = require('fs');

// Function to map antennas by their type (renamed to `createAntennaMap`)
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

// Function to calculate antinode locations and visualize the map (renamed to `countUniqueAntinodes`)
function countUniqueAntinodes(grid, antennaMap) {
    const rows = grid.length, columns = grid[0].length;
    const antinodeSet = new Set();

    for (const key in antennaMap) {
        const positions = antennaMap[key];

        for (let pos1 of positions) {
            for (let pos2 of positions) {
                if (pos1[0] === pos2[0] && pos1[1] === pos2[1]) continue;

                // Add the second position as an antinode
                antinodeSet.add(`${pos2[0]},${pos2[1]}`);

                // Calculate the gradient
                const gradient = [
                    pos2[0] - pos1[0],
                    pos2[1] - pos1[1]
                ];

                // Extend the gradient to find more antinode positions
                let antinodePos = [
                    pos2[0] + gradient[0],
                    pos2[1] + gradient[1]
                ];

                while (
                    antinodePos[0] >= 0 && antinodePos[0] < rows &&
                    antinodePos[1] >= 0 && antinodePos[1] < columns
                ) {
                    // Mark the grid for visualization
                    grid[antinodePos[0]][antinodePos[1]] = '#';

                    // Add the position to the antinode set
                    antinodeSet.add(`${antinodePos[0]},${antinodePos[1]}`);

                    // Move further along the gradient
                    antinodePos = [
                        antinodePos[0] + gradient[0],
                        antinodePos[1] + gradient[1]
                    ];
                }
            }
        }
    }

    // Print the updated grid for visualization
    grid.forEach(line => console.log(line.join('')));

    return antinodeSet.size;
}

// Main function to process the input
function main() {
    const input = fs.readFileSync('./input.txt', 'utf-8');
    const grid = input.trim().split('\n').map(line => line.split(''));

    const antennaMap = createAntennaMap(grid);
    const totalAntinodes = countUniqueAntinodes(grid, antennaMap);

    console.log(totalAntinodes);
}

// Execute the main function
main();
