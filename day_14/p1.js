const fs = require("fs");

// Read the input file
const input = fs.readFileSync("input.txt", "utf-8").trim().split("\n");

const n = 103;
const m = 101;

let p = [];
let v = [];

// Parse the input data
input.forEach((line) => {
    const [a, b] = line.split(" ");
    const pos = a.split("=")[1].split(",").map(Number);
    const vel = b.split("=")[1].split(",").map(Number);

    p.push([pos[1], pos[0]]);
    v.push([vel[1], vel[0]]);
});

const N = p.length;

// Update positions based on velocities
const update = () => {
    for (let i = 0; i < N; i++) {
        p[i][0] = (p[i][0] + v[i][0] + n) % n;
        p[i][1] = (p[i][1] + v[i][1] + m) % m;
    }
};

// Count robots in a specific grid region
const countRobots = (i0, i1, j0, j1) => {
    let ans = 0;
    for (let i = i0; i < i1; i++) {
        for (let j = j0; j < j1; j++) {
            for (const [ii, jj] of p) {
                if (i === ii && j === jj) {
                    ans++;
                }
            }
        }
    }
    return ans;
};

// Run simulation for 100 updates
for (let _ = 0; _ < 100; _++) {
    // Uncomment this block to print grid
    // for (let i = 0; i < n; i++) {
    //     let row = "";
    //     for (let j = 0; j < m; j++) {
    //         const x = countRobots(i, i + 1, j, j + 1);
    //         row += x > 0 ? x.toString() : ".";
    //     }
    //     console.log(row);
    // }
    // console.log();

    update();
}

// Calculate the number of robots in each quadrant
const q0 = countRobots(0, Math.floor(n / 2), 0, Math.floor(m / 2));
const q1 = countRobots(Math.floor(n / 2) + 1, n, 0, Math.floor(m / 2));
const q2 = countRobots(0, Math.floor(n / 2), Math.floor(m / 2) + 1, m);
const q3 = countRobots(Math.floor(n / 2) + 1, n, Math.floor(m / 2) + 1, m);

console.log(q0, q1, q2, q3);
console.log(q0 * q1 * q2 * q3);
