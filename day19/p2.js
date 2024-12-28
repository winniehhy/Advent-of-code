const fs = require('fs');

// Read input from the file
const lines = fs.readFileSync('input.txt', 'utf-8').trim().split("\n");
const units = lines[0].split(", ");
const designs = lines.slice(2);

// Function to check if a design can be made using the units
function possible(design) {
    const n = design.length;
    const dp = Array(n).fill(0); // Initialize dp array with 0

    for (let i = 0; i < n; i++) {
        // Check if the design can be created from the start
        if (units.includes(design.slice(0, i + 1))) {
            dp[i] = 1;
        }

        // Check if the design can be constructed from units
        for (const unit of units) {
            if (i - unit.length + 1 >= 0 && design.slice(i - unit.length + 1, i + 1) === unit) {
                dp[i] += dp[i - unit.length]; // Add ways from previous dp index
            }
        }

        // Debugging: Check the dp array at each index
        console.log(`dp[${i}] = ${dp[i]}`);
    }

    // Debugging: Check the final dp array and return the result
    console.log('Final dp array:', dp);
    return dp[n - 1];
}

let ans = 0;
for (const design of designs) {
    ans += possible(design);
}

console.log('Final answer:', ans);
