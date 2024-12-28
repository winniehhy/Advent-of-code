// Read input file
const fs = require("fs");
const lines = fs.readFileSync("input.txt", "utf8").trim().split("\n").map(Number);

// Utility function
function steps(num) {
    num = (num ^ ((num * 64) % 16777216)); // Multiply by 64 then `mix` and `prune`
    num = (num ^ (Math.floor(num / 32) % 16777216)); // Floor by 32 then `mix` and `prune`
    num = (num ^ ((num * 2048) % 16777216)); // Multiply by 2048 then `mix` and `prune`
    return num;
}

// Calculate sequence to total mapping
const seqToTotal = {};

lines.forEach(line => {
    let num = line;
    const buyer = [num % 10];
    for (let i = 0; i < 2000; i++) {
        num = steps(num);
        buyer.push(num % 10);
    }

    const seen = new Set();
    for (let i = 0; i < buyer.length - 4; i++) { // Loop until the number of digits that allows a valid sequence
        const [a, b, c, d, e] = buyer.slice(i, i + 5); // Get the current 5 values
        const seq = [b - a, c - b, d - c, e - d].toString(); // Get the sequence in those 5 values
        if (seen.has(seq)) continue;
        seen.add(seq);
        if (!seqToTotal[seq]) seqToTotal[seq] = 0; // Add this sequence into the set
        seqToTotal[seq] += e; // Add the number of bananas bought if the sequence is seen
    }
});

console.log(Math.max(...Object.values(seqToTotal)));
