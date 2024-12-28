//ans : 7584

const fs = require('fs');

// Define constants
const WIDTH = 101; // Grid width
const HEIGHT = 103; // Grid height
const pattern = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/;

// Robot class to store position and velocity
class Robot {
    constructor(px, py, vx, vy) {
        this.px = px;
        this.py = py;
        this.vx = vx;
        this.vy = vy;
    }

    // Update robot's position based on velocity
    updatePosition() {
        this.px = (this.px + this.vx + WIDTH) % WIDTH;
        this.py = (this.py + this.vy + HEIGHT) % HEIGHT;
    }
}

// Read input file and initialize robots
const lines = fs.readFileSync('./input.txt', 'utf-8').trim().split('\n');
const robots = lines.map(line => {
    const [, px, py, vx, vy] = pattern.exec(line).map(Number);
    return new Robot(px, py, vx, vy);
});

// Determine which quadrant the point belongs to
const getQuadrant = (x, y) => {
    const middle = x === Math.floor(WIDTH / 2) || y === Math.floor(HEIGHT / 2);
    if (middle) return -1;
    const left = x < Math.floor(WIDTH / 2);
    const top = y < Math.floor(HEIGHT / 2);
    if (left && top) return 0;
    if (!left && top) return 1;
    if (left && !top) return 2;
    return 3;
};

// Check for a valid rectangular frame in the grid
const checkFrame = (grid, row, col) => {
    let width = 0, height = 0;

    while (row + height < HEIGHT && grid[row + height][col] === '*') height++;
    while (col + width < WIDTH && grid[row][col + width] === '*') width++;

    if (height <= 3 || width <= 3) return false;

    for (let i = 0; i < width; i++) {
        if (grid[row + height - 1][col + i] !== '*') return false;
    }
    for (let i = 0; i < height; i++) {
        if (grid[row + i][col + width - 1] !== '*') return false;
    }

    return true;
};

// Check for the "Christmas tree" pattern in the grid
const checkChristmasTree = grid => {
    for (let i = 0; i < HEIGHT - 3; i++) {
        for (let j = 0; j < WIDTH - 3; j++) {
            if (checkFrame(grid, i, j)) return true;
        }
    }
    return false;
};

// Main simulation loop
let seconds = 0;
const quadrantRobots = [0, 0, 0, 0];

while (true) {
    // Create an empty grid
    const grid = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(' '));

    // Update positions and populate the grid
    robots.forEach(robot => {
        robot.updatePosition();
        grid[robot.py][robot.px] = '*';

        const quadrant = getQuadrant(robot.px, robot.py);
        if (quadrant !== -1) quadrantRobots[quadrant]++;
    });

    // Check for the pattern
    seconds++;
    if (checkChristmasTree(grid)) {
        break;
    }
}

// Output the final result
console.log(`Seconds: ${seconds}`);
