//ans : Safety factor: 236628054

const fs = require("fs");

// Define grid dimensions
const WIDTH = 101;
const HEIGHT = 103;
const VERTICAL_MIDDLE = (HEIGHT - 1) / 2;
const HORIZONTAL_MIDDLE = (WIDTH - 1) / 2;

// Parse input
const parseInput = filePath => {
    const robots = [];
    const input = fs.readFileSync(filePath, "utf-8").trim().split("\n");

    input.forEach(line => {
        const [px, py, vx, vy] = line.match(/-?\d+/g).map(Number);
        robots.push({ px, py, vx, vy });
    });

    return robots;
};

// Simulate robot movement for a given number of seconds
const computeRobotPositions = (robots, seconds) => {
    const wrap = (value, range) => ((value % range) + range) % range;

    return robots.map(({ px, py, vx, vy }) => ({
        x: wrap(px + vx * seconds, WIDTH),
        y: wrap(py + vy * seconds, HEIGHT),
    }));
};

// Count robots in each quadrant
const countRobotsInQuadrants = positions => {
    let topLeft = 0, topRight = 0, bottomLeft = 0, bottomRight = 0;

    positions.forEach(({ x, y }) => {
        // Exclude robots on the middle boundaries
        if (x === HORIZONTAL_MIDDLE || y === VERTICAL_MIDDLE) return;

        if (x < HORIZONTAL_MIDDLE) {
            if (y < VERTICAL_MIDDLE) topLeft++;
            else bottomLeft++;
        } else {
            if (y < VERTICAL_MIDDLE) topRight++;
            else bottomRight++;
        }
    });

    return { topLeft, topRight, bottomLeft, bottomRight };
};

// Calculate the safety factor
const computeSafetyFactor = ({ topLeft, topRight, bottomLeft, bottomRight }) => {
    return topLeft * topRight * bottomLeft * bottomRight;
};

// Main execution
const robots = parseInput("input.txt");
const positionsAfter100Seconds = computeRobotPositions(robots, 100);
const quadrantCounts = countRobotsInQuadrants(positionsAfter100Seconds);
const safetyFactor = computeSafetyFactor(quadrantCounts);

console.log("Safety factor:", safetyFactor);
