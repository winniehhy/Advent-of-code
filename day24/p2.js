const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf-8").trim().split("\n\n");

const ins = {};

// Number of wires
const N = 44;

input[1].split("\n").forEach(line => {
    const [w1, op, w2, , out] = line.split(" ");
    ins[out] = [w1, w2, op];
});

function simulate(x, y) {
    const wires = {};

    // Initialize the wires based on x and y
    for (let i = 0; i <= N; i++) {
        wires[`x${i.toString().padStart(2, '0')}`] = (x & (1 << i)) >> i;
        wires[`y${i.toString().padStart(2, '0')}`] = (y & (1 << i)) >> i;
    }

    function get(wire) {
        if (wire in wires) {
            return wires[wire];
        }

        const [w1, w2, op] = ins[wire];

        if (op === "AND") {
            wires[wire] = get(w1) & get(w2);
        } else if (op === "OR") {
            wires[wire] = get(w1) | get(w2);
        } else if (op === "XOR") {
            wires[wire] = get(w1) ^ get(w2);
        }

        return wires[wire];
    }

    let z = 0;
    for (let i = 0; i <= N; i++) {
        z <<= 1;
        z ^= get(`z${i.toString().padStart(2, '0')}`);
    }

    return [wires, z];
}

let x = 0;
let y = 0;

// Initialize x and y based on the first part of the input
input[0].split("\n").slice(0, N).forEach(line => {
    x <<= 1;
    x ^= parseInt(line.split(" ")[1]);
});
input[0].split("\n").slice(N, N * 2).forEach(line => {
    y <<= 1;
    y ^= parseInt(line.split(" ")[1]);
});

const bad = new Set();
for (let it = 0; it < 1000; it++) {
    x = Math.floor(Math.random() * (1 << (N + 1)));
    y = Math.floor(Math.random() * (1 << (N + 1)));
    
    const [wires, z_out] = simulate(x, y);
    const z = x + y;

    for (let i = 0; i <= N + 1; i++) {
        if ((z & (1 << i)) !== (z_out & (1 << i))) {
            const wire = `z${i.toString().padStart(2, '0')}`;
            if (!bad.has(wire)) {
                bad.add(wire);
            }
        }
    }
}

// Sorting and outputting the correct wire names involved in swaps
const badWires = [...bad].sort();
console.log(badWires.join(", "));
