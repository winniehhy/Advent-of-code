const fs = require('fs');

// Read input from file and split into lines
const lines = fs.readFileSync('input.txt', 'utf-8').split('\n');

// Parse the patterns from the first line and store them in a set
const patterns = new Set(lines[0].split(', '));
const maxLen = Math.max(...patterns.size ? [...patterns].map(p => p.length) : [0]);

// Cache to store previously calculated results for designs
const cache = {};

// Recursive function to find permutations for a given design
function findPermutation(design) {
    if (design === "") {
        return 1;
    }
    let count = 0;
    if (cache[design]) {
        return cache[design];
    }
    for (let i = 0; i <= Math.min(design.length, maxLen); i++) {
        if (patterns.has(design.substring(0, i))) {
            count += findPermutation(design.substring(i));
        }
    }
    cache[design] = count;
    return count;
}

// Sum the permutations for each design in the input
let result = 0;
for (let i = 2; i < lines.length; i++) {
    const design = lines[i];
    result += findPermutation(design);
}

// Output the result
console.log(result);
