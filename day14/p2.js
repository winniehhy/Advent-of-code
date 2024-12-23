const fs = require("fs");

// Parse Input
const parseInput = filePath => {
    const robots = [];
    const input = fs.readFileSync(filePath, "utf-8").trim().split("\n");

    input.forEach(line => {
        const [px, py, vx, vy] = line.match(/-?\d+/g).map(Number);
        robots.push({ px, py, vx, vy });
    });

    return robots;
};

// Simulate Robot Motion
const simulatePositions = (robots, seconds) => {
    return robots.map(({ px, py, vx, vy }) => ({
        x: px + vx * seconds,
        y: py + vy * seconds,
    }));
};

// Compute Bounding Box
const getBoundingBox = positions => {
    const minX = Math.min(...positions.map(p => p.x));
    const maxX = Math.max(...positions.map(p => p.x));
    const minY = Math.min(...positions.map(p => p.y));
    const maxY = Math.max(...positions.map(p => p.y));
    return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
};

// Visualize the Grid
const visualizePositions = (positions, boundingBox) => {
    const grid = Array.from({ length: boundingBox.height + 1 }, () =>
        Array(boundingBox.width + 1).fill(".")
    );

    positions.forEach(({ x, y }) => {
        const gridX = x - boundingBox.minX;
        const gridY = y - boundingBox.minY;
        if (gridY >= 0 && gridY < grid.length && gridX >= 0 && gridX < grid[0].length) {
            grid[gridY][gridX] = "#";
        }
    });

    return grid.map(row => row.join("")).join("\n");
};

// Find Closest Clustering Time
const findEasterEggTime = robots => {
    let seconds = 0;
    let smallestArea = Infinity;
    let bestTime = 0;
    let previousBoundingBox;

    while (true) {
        const positions = simulatePositions(robots, seconds);
        const boundingBox = getBoundingBox(positions);
        const currentArea = boundingBox.width * boundingBox.height;

        if (currentArea < smallestArea) {
            smallestArea = currentArea;
            bestTime = seconds;
            previousBoundingBox = boundingBox;
        } else {
            // If the bounding box starts expanding, stop
            break;
        }

        seconds++;
    }

    return { time: bestTime, boundingBox: previousBoundingBox };
};

// Main Execution
const robots = parseInput("input.txt");
const { time, boundingBox } = findEasterEggTime(robots);
const positions = simulatePositions(robots, time);
const visualization = visualizePositions(positions, boundingBox);

console.log(`Fewest seconds: ${time}`);
console.log("Visualization of the Christmas tree:");
console.log(visualization);
