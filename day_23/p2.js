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

// Check if nodes form a clique
function isClique(nodes) {
    const n = nodes.length;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (!adj[nodes[i]]?.includes(nodes[j])) {
                return false;
            }
        }
    }
    return true;
}

// Find the largest clique
let bigClique = [];

for (const node in adj) {
    const nbrs = adj[node];
    const totalMasks = 1 << nbrs.length; // 2^nbrs.length
    for (let mask = 0; mask < totalMasks; mask++) {
        const nodes = [node];
        for (let i = 0; i < nbrs.length; i++) {
            if (mask & (1 << i)) {
                nodes.push(nbrs[i]);
            }
        }

        if (isClique(nodes) && nodes.length > bigClique.length) {
            bigClique = nodes;
        }
    }
}

console.log(bigClique.length);
console.log(bigClique.sort().join(","));
