const fs = require('fs');

// Read input from the file
const lines = fs.readFileSync('input.txt', 'utf-8').trim().split("\n");
const units = lines[0].split(", ");
const designs = lines.slice(2);

// Function to check if a design can be made using the units
function possible(design) {
    const n = design.length;
    const dp = Array(n).fill(false); // Initialize dp array with false values

    for (let i = 0; i < n; i++) {
        if (units.includes(design.slice(0, i + 1))) {
            dp[i] = true;
            continue;
        }

        for (const unit of units) {
            if (i - unit.length + 1 >= 0 && design.slice(i - unit.length + 1, i + 1) === unit && dp[i - unit.length]) {
                dp[i] = true;
                break;
            }
        }
    }

    return dp[n - 1];
}

let ans = 0;
for (const design of designs) {
    if (possible(design)) {
        console.log(design);
        ans++;
    }
}

console.log(ans);
