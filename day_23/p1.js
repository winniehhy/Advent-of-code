// Read input file
const fs = require("fs");
const lines = fs.readFileSync("input.txt", "utf8").trim().split("\n");

// Build adjacency list
const adj = {};
lines.forEach(line => {
    const [a, b] = line.split("-");
    if (!adj[a]) adj[a] = [];
    if (!adj[b]) adj[b] = [];
    adj[a].push(b);
    adj[b].push(a);
});

// Find triangles
const triangles = new Set();
for (const a in adj) {
    for (const i of adj[a]) {
        for (const j of adj[a]) {
            if (adj[i]?.includes(j)) {
                const triangle = [a, i, j].sort();
                triangles.add(triangle.toString());
            }
        }
    }
}

// Count triangles containing nodes starting with 't'
let ans = 0;
triangles.forEach(triangle => {
    const [a, b, c] = triangle.split(",");
    if ([a[0], b[0], c[0]].includes("t")) {
        ans++;
    }
});

console.log(ans);
