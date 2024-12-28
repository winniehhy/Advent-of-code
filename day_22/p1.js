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

// Calculate total
let total = 0;

lines.forEach(num => {
    for (let i = 0; i < 2000; i++) {
        num = steps(num);
    }
    total += num;
});

console.log(total);
